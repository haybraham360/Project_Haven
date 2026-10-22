# Phase 1 — Authentication & Onboarding: implementation notes

Status: **implemented in code; not yet verified against a live Supabase project.**
See "Verification status" below before ticking any acceptance item.

## Architecture

| Concern | Choice |
| --- | --- |
| Auth & database | Supabase (hosted), via `@supabase/ssr` cookie sessions |
| Session refresh | `src/proxy.ts` (Next 16 "proxy", formerly middleware) calls `auth.getClaims()` on auth-related routes |
| Authorization boundary | `src/lib/auth/dal.ts`: every protected page and server action calls `getMember()` → `auth.getUser()` (verified with the auth server) and applies `redirectFor()` |
| Routing rules | `src/lib/auth/redirects.ts` (pure, unit-tested) |
| Database rules | `supabase/migrations/20261022120000_phase1_profiles_consents.sql` (RLS, column grants, `SECURITY DEFINER` functions) |
| Validation | `src/lib/validation.ts` (zod, server-side) |
| Privileged keys | **None used by the app.** The app uses only the publishable key; RLS governs access |

### Routes

| Path | Who | Notes |
| --- | --- | --- |
| `/sign-up`, `/sign-in`, `/forgot-password` | signed-out | signed-in users are redirected to where they belong |
| `/verify-email` | anyone | "check your email" + resend form |
| `/auth/confirm` | email links | handles `token_hash` (recommended) and `?code=` links |
| `/reset-password` | signed in via a recovery link | requires the recovery marker cookie |
| `/onboarding/{welcome,age,profile,preferences,terms}` | signed in, eligible or undeclared, not completed | progress is stored server-side |
| `/onboarding/complete` | completed | |
| `/dashboard`, `/settings` | signed in, eligible, onboarding completed | |
| `/not-eligible` | declared under 18 | explanation, safety guidance, deletion request |

### Data model

- `profiles`: one row per auth user, created by the `on_auth_user_created` trigger. There's no date of birth, no role or verification columns, and no health data.
- `consents`: append-only acknowledgement records (`consent_type`, `policy_version`, `required`, `accepted_at`, `withdrawn_at`). The pair (user, type, version) is unique, so retries never duplicate.
- `policy_versions`: which terms and privacy versions are current, and whether they are drafts. Seeded with `0.1-draft` for both.

What members can do (enforced in the database and covered by `tests/db/policies.test.ts`):

- Read only their own `profiles` and `consents` rows.
- Directly update only `display_name`, `country_code`, `preferred_language` and `support_interests`.
- Change eligibility, onboarding progress, consents and deletion requests **only** through:
  - `declare_age(is_adult)`. This is one-way: a recorded answer can't be changed by the member.
  - `advance_onboarding(target)`. Steps advance one at a time, and steps after the age gate need eligibility.
  - `accept_required_policies()`. This records the current versions; the client can't choose a version.
  - `complete_onboarding()`. This requires eligibility, step 5, and acknowledgement of every current required policy.
  - `request_account_deletion()`. This is idempotent.
- Anonymous visitors can only read `policy_versions`.

## Supabase project setup (development)

1. Create a **development** project. Don't reuse it for staging or production.
2. Apply the migration. Either paste `supabase/migrations/20261022120000_phase1_profiles_consents.sql` into the SQL editor, or run
   `psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20261022120000_phase1_profiles_consents.sql`.
3. Go to **Authentication → Sign In / Providers → Email** and turn on **Confirm email**. Optionally turn on leaked-password protection, which the app handles as `weak_password`.
4. Go to **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (each environment uses its own origin)
   - Redirect URLs: `http://localhost:3000/auth/confirm`
5. Go to **Authentication → Emails → Templates**. These are recommended because they work when the link is opened on another device.
   - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/onboarding`
   - Reset password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`

   The default templates also work, but only in the same browser that started the flow.
6. Go to **Authentication → Rate Limits** and review the email-sending and verification limits. The built-in email service is for testing only. Configure a reviewed SMTP provider before any pilot.
7. Copy `.env.example` to `.env.local` and fill in the URL and publishable key.

## Running checks

```bash
pnpm lint
pnpm typecheck        # next typegen && tsc --noEmit
pnpm test             # unit tests (validation, redirects, rate limiter, onboarding rules)
pnpm test:db:local    # policy tests on a throwaway local PostgreSQL (needs psql/createdb)
pnpm test:db          # the same tests against TEST_DATABASE_URL (development DB only)
pnpm build
```

`test:db:local` applies `supabase/tests/local-auth-shim.sql`, a minimal stand-in for Supabase's `auth` schema and roles. **Never apply the shim to a real Supabase project.**

## Security notes

- Error messages don't reveal whether an account exists. Sign-up for an existing email shows the same "check your email" result. Password reset and resend always show the same success message.
- Only provider error **codes** are logged. Passwords, tokens, email links and free text are never logged.
- `next` redirect parameters are restricted to same-origin paths (`safeNextPath`). Email-link redirects use `NEXT_PUBLIC_APP_URL`, never the request `Host` header.
- Signing out revokes the current session on the auth server (`scope: "local"`). A successful password reset signs out other sessions. A deletion request signs out all sessions.
- Password recovery: `/auth/confirm` sets a 15-minute httpOnly marker cookie bound to the user ID, and the reset form requires it.

## Known limitations

1. **Rate limiting is in-memory per server process.** It works locally and on one Node server, but not across serverless instances. Before the pilot, back it with a shared store or platform rate limiting, and enable CAPTCHA in Supabase Auth.
2. **Age check is a self-declaration**, not age assurance. A person can create a new account and answer differently. This needs legal review per launch jurisdiction (spec §6 step 2).
3. **Policy text is a draft** (`0.1-draft`) and is labelled as such in the UI. Reviewed text and a new `policy_versions` row are needed before launch. Members who accepted an older version are not yet prompted to accept a new one.
4. **Account deletion is request-only.** `deletion_requested_at` is recorded and the user is signed out. There is no admin tool yet to process requests, and the backup and retention schedule is undefined.
5. Consents cascade-delete with the auth user. Whether acknowledgement records must outlive the account is a retention decision for legal review.
6. The interface is English-only. `preferred_language` is stored for later.
7. **Verification status:** the end-to-end auth flows (sign-up email, verify, sign-in, reset) have **not** been run against a real Supabase project, because no credentials were available. The database policies were tested on local PostgreSQL with a Supabase-compatible auth shim, not on Supabase itself.

## Decisions needed from the founder

- Approve the interim deletion-request process, and decide who processes requests and within what timeframe.
- Age-eligibility approach for each launch jurisdiction, after legal review.
- Reviewed terms of service and privacy notice text.
- Email provider (SMTP) and sender domain.
- Shared rate-limit store or platform choice for production.
- Retention period for consent records after account deletion.
