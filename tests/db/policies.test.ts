/**
 * Database access-policy tests for Phase 1 (profiles, consents, onboarding
 * functions). They connect as a privileged role, then switch to the
 * `authenticated` / `anon` roles with a synthetic JWT "sub" claim, exactly as
 * Supabase's API does, so RLS and grants are exercised for real.
 *
 * Requires TEST_DATABASE_URL. Uses synthetic users only and removes them
 * afterwards. NEVER point this at a production database.
 */
import { randomUUID } from "node:crypto";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.TEST_DATABASE_URL;
const suite = url ? describe : describe.skip;

let db: pg.Client;
const createdUsers: string[] = [];

async function createUser(): Promise<string> {
  const id = randomUUID();
  await db.query("insert into auth.users (id, email) values ($1, $2)", [id, `synthetic+${id}@example.test`]);
  createdUsers.push(id);
  return id;
}

/** Runs queries as a signed-in member (role authenticated, sub = uid). */
async function asUser<T>(uid: string, fn: (q: pg.Client) => Promise<T>): Promise<T> {
  await db.query("begin");
  try {
    await db.query("set local role authenticated");
    await db.query("select set_config('request.jwt.claims', $1, true), set_config('request.jwt.claim.sub', $2, true)", [
      JSON.stringify({ sub: uid, role: "authenticated" }),
      uid,
    ]);
    const result = await fn(db);
    await db.query("commit");
    return result;
  } catch (error) {
    await db.query("rollback");
    throw error;
  }
}

async function asAnon<T>(fn: (q: pg.Client) => Promise<T>): Promise<T> {
  await db.query("begin");
  try {
    await db.query("set local role anon");
    const result = await fn(db);
    await db.query("commit");
    return result;
  } catch (error) {
    await db.query("rollback");
    throw error;
  }
}

/** Expects a query to fail; returns the Postgres error message. */
async function failure(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error("Expected the query to fail, but it succeeded.");
}

const PERMISSION_DENIED = /permission denied/;

async function profileOf(uid: string) {
  const { rows } = await db.query("select * from public.profiles where id = $1", [uid]);
  return rows[0];
}

suite("Phase 1 database access policies", () => {
  let alice: string;
  let bob: string;

  beforeAll(async () => {
    db = new pg.Client({ connectionString: url });
    await db.connect();
    alice = await createUser();
    bob = await createUser();
  });

  afterAll(async () => {
    if (!db) return;
    if (createdUsers.length) await db.query("delete from auth.users where id = any($1::uuid[])", [createdUsers]);
    await db.end();
  });

  describe("profiles", () => {
    it("creates one profile per new user with safe defaults", async () => {
      const p = await profileOf(alice);
      expect(p).toMatchObject({ age_eligibility: "unknown", onboarding_status: "not_started", onboarding_step: 1 });
    });

    it("lets a member read only their own profile", async () => {
      const rows = await asUser(alice, async (q) => (await q.query("select id from public.profiles")).rows);
      expect(rows.map((r) => r.id)).toEqual([alice]);
      const other = await asUser(alice, async (q) => (await q.query("select id from public.profiles where id = $1", [bob])).rowCount);
      expect(other).toBe(0);
    });

    it("lets a member update their own allowed fields", async () => {
      await asUser(alice, (q) => q.query("update public.profiles set display_name = 'Synthetic A', country_code = 'GB' where id = $1", [alice]));
      expect((await profileOf(alice)).display_name).toBe("Synthetic A");
    });

    it("does not let a member edit another member's profile", async () => {
      const affected = await asUser(alice, async (q) =>
        (await q.query("update public.profiles set display_name = 'hijacked' where id = $1", [bob])).rowCount,
      );
      expect(affected).toBe(0);
      expect((await profileOf(bob)).display_name).toBeNull();
    });

    it.each([
      "age_eligibility = 'eligible'",
      "onboarding_status = 'completed'",
      "onboarding_step = 6",
      "onboarding_completed_at = now()",
      "deletion_requested_at = null",
      "id = gen_random_uuid()",
    ])("rejects direct update of protected column: %s", async (assignment) => {
      const message = await failure(asUser(alice, (q) => q.query(`update public.profiles set ${assignment} where id = $1`, [alice])));
      expect(message).toMatch(PERMISSION_DENIED);
    });

    it("rejects direct insert and delete", async () => {
      expect(await failure(asUser(alice, (q) => q.query("insert into public.profiles (id) values (gen_random_uuid())")))).toMatch(PERMISSION_DENIED);
      expect(await failure(asUser(alice, (q) => q.query("delete from public.profiles where id = $1", [alice])))).toMatch(PERMISSION_DENIED);
    });

    it("enforces field constraints in the database too", async () => {
      expect(await failure(asUser(alice, (q) => q.query("update public.profiles set country_code = 'gb' where id = $1", [alice])))).toMatch(/check constraint/);
      expect(
        await failure(asUser(alice, (q) => q.query("update public.profiles set support_interests = array['diagnosis'] where id = $1", [alice]))),
      ).toMatch(/check constraint/);
    });

    it("gives anonymous visitors no access", async () => {
      expect(await failure(asAnon((q) => q.query("select * from public.profiles")))).toMatch(PERMISSION_DENIED);
      expect(await failure(asAnon((q) => q.query("select * from public.consents")))).toMatch(PERMISSION_DENIED);
      expect(await failure(asAnon((q) => q.query("select public.declare_age(true)")))).toMatch(PERMISSION_DENIED);
    });
  });

  describe("age gate and onboarding", () => {
    it("refuses to advance past the age gate before eligibility", async () => {
      const carol = await createUser();
      expect(await failure(asUser(carol, (q) => q.query("select public.advance_onboarding(5)")))).toMatch(/invalid_step|step_out_of_order|not_eligible/);
      expect(await failure(asUser(carol, (q) => q.query("select public.advance_onboarding(3)")))).toMatch(/not_eligible/);
      expect(await failure(asUser(carol, (q) => q.query("select public.complete_onboarding()")))).toMatch(/not_eligible/);
    });

    it("makes an under-18 declaration final and blocks completion", async () => {
      const dana = await createUser();
      const first = await asUser(dana, async (q) => (await q.query("select public.declare_age(false) as r")).rows[0].r);
      expect(first).toBe("ineligible");
      const retry = await asUser(dana, async (q) => (await q.query("select public.declare_age(true) as r")).rows[0].r);
      expect(retry).toBe("ineligible");
      expect(await failure(asUser(dana, (q) => q.query("select public.accept_required_policies()")))).toMatch(/not_eligible/);
      expect(await failure(asUser(dana, (q) => q.query("select public.complete_onboarding()")))).toMatch(/not_eligible/);
      expect(await profileOf(dana)).toMatchObject({ age_eligibility: "ineligible", onboarding_status: "in_progress" });
    });

    it("completes onboarding only after every required step, without duplicate consents", async () => {
      const erin = await createUser();
      await asUser(erin, (q) => q.query("select public.advance_onboarding(2)"));
      expect(await asUser(erin, async (q) => (await q.query("select public.declare_age(true) as r")).rows[0].r)).toBe("eligible");
      expect((await profileOf(erin)).onboarding_step).toBe(3);

      // Cannot skip ahead or finish early.
      expect(await failure(asUser(erin, (q) => q.query("select public.advance_onboarding(5)")))).toMatch(/step_out_of_order/);
      expect(await failure(asUser(erin, (q) => q.query("select public.complete_onboarding()")))).toMatch(/step_out_of_order/);

      await asUser(erin, (q) => q.query("select public.advance_onboarding(4)"));
      await asUser(erin, (q) => q.query("select public.advance_onboarding(5)"));
      // Going "back" never lowers recorded progress.
      expect(await asUser(erin, async (q) => (await q.query("select public.advance_onboarding(3) as r")).rows[0].r)).toBe(5);

      expect(await failure(asUser(erin, (q) => q.query("select public.complete_onboarding()")))).toMatch(/consent_missing/);

      // Retrying acceptance (e.g. a refresh or double submit) is idempotent.
      await asUser(erin, (q) => q.query("select public.accept_required_policies()"));
      await asUser(erin, (q) => q.query("select public.accept_required_policies()"));
      const { rows: consents } = await db.query("select consent_type, policy_version, required from public.consents where user_id = $1 order by consent_type", [erin]);
      expect(consents).toEqual([
        { consent_type: "privacy_notice", policy_version: "0.1-draft", required: true },
        { consent_type: "terms_of_service", policy_version: "0.1-draft", required: true },
      ]);

      await asUser(erin, (q) => q.query("select public.complete_onboarding()"));
      await asUser(erin, (q) => q.query("select public.complete_onboarding()"));
      const p = await profileOf(erin);
      expect(p).toMatchObject({ onboarding_status: "completed", onboarding_step: 6 });
      expect(p.onboarding_completed_at).not.toBeNull();
    });
  });

  describe("consents", () => {
    let frank: string;

    beforeAll(async () => {
      frank = await createUser();
      await asUser(frank, (q) => q.query("select public.declare_age(true)"));
      await asUser(frank, (q) => q.query("select public.accept_required_policies()"));
    });

    it("lets a member read only their own consent records", async () => {
      const own = await asUser(frank, async (q) => (await q.query("select user_id from public.consents")).rows);
      expect(own.length).toBe(2);
      expect(own.every((r) => r.user_id === frank)).toBe(true);
      const others = await asUser(alice, async (q) => (await q.query("select 1 from public.consents where user_id = $1", [frank])).rowCount);
      expect(others).toBe(0);
    });

    it("does not let members create, rewrite or delete consent records directly", async () => {
      expect(
        await failure(
          asUser(frank, (q) =>
            q.query("insert into public.consents (user_id, consent_type, policy_version, required) values ($1, 'terms_of_service', '0.1-draft', true)", [frank]),
          ),
        ),
      ).toMatch(PERMISSION_DENIED);
      expect(await failure(asUser(frank, (q) => q.query("update public.consents set accepted_at = now() - interval '1 year'")))).toMatch(PERMISSION_DENIED);
      expect(await failure(asUser(frank, (q) => q.query("delete from public.consents")))).toMatch(PERMISSION_DENIED);
      expect(await failure(asUser(frank, (q) => q.query("update public.policy_versions set is_current = false")))).toMatch(PERMISSION_DENIED);
    });

    it("keeps historical consents when a new policy version is published", async () => {
      await db.query("begin");
      try {
        await db.query("update public.policy_versions set is_current = false where consent_type = 'terms_of_service'");
        await db.query("insert into public.policy_versions (consent_type, version, is_current) values ('terms_of_service', '0.2-draft', true)");
        await db.query("set local role authenticated");
        await db.query("select set_config('request.jwt.claim.sub', $1, true)", [frank]);
        await db.query("select public.accept_required_policies()");
        await db.query("reset role");
        const { rows } = await db.query("select policy_version from public.consents where user_id = $1 and consent_type = 'terms_of_service' order by policy_version", [frank]);
        expect(rows.map((r) => r.policy_version)).toEqual(["0.1-draft", "0.2-draft"]);
      } finally {
        await db.query("rollback");
      }
    });
  });

  describe("deletion requests", () => {
    it("records a request once and only for the caller", async () => {
      const gina = await createUser();
      const first = await asUser(gina, async (q) => (await q.query("select public.request_account_deletion() as r")).rows[0].r);
      const second = await asUser(gina, async (q) => (await q.query("select public.request_account_deletion() as r")).rows[0].r);
      expect(first).not.toBeNull();
      expect(second.getTime()).toBe(first.getTime());
      expect((await profileOf(bob)).deletion_requested_at).toBeNull();
    });
  });
});
