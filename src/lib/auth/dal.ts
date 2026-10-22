import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirectFor, type AgeEligibility, type Area, type OnboardingStatus, type Viewer } from "@/lib/auth/redirects";

/**
 * Data access layer: the single place that resolves who the current user is.
 * Uses supabase.auth.getUser(), which verifies the session with the auth
 * server (so revoked sessions are rejected), then loads the member's profile
 * through RLS.
 */

export type Profile = {
  id: string;
  display_name: string | null;
  country_code: string | null;
  preferred_language: string | null;
  support_interests: string[];
  age_eligibility: AgeEligibility;
  onboarding_status: OnboardingStatus;
  onboarding_step: number;
  onboarding_completed_at: string | null;
  deletion_requested_at: string | null;
};

export type Member = { userId: string; email: string | null; profile: Profile };

const PROFILE_COLUMNS =
  "id, display_name, country_code, preferred_language, support_interests, age_eligibility, onboarding_status, onboarding_step, onboarding_completed_at, deletion_requested_at";

export class ProfileUnavailableError extends Error {
  constructor() {
    super("Profile could not be loaded.");
    this.name = "ProfileUnavailableError";
  }
}

export const getMember = cache(async (): Promise<Member | null> => {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userData.user.id)
    .single<Profile>();

  if (error || !profile) {
    // Do not log provider error details that could include identifiers.
    console.error("[dal] profile load failed", error?.code ?? "no_row");
    throw new ProfileUnavailableError();
  }

  return { userId: userData.user.id, email: userData.user.email ?? null, profile };
});

export function toViewer(member: Member | null): Viewer {
  if (!member) return { signedIn: false };
  return {
    signedIn: true,
    ageEligibility: member.profile.age_eligibility,
    onboardingStatus: member.profile.onboarding_status,
  };
}

/**
 * Enforces the access rules for an area and returns the member. Redirects
 * (never returns) when the viewer does not belong there.
 */
export async function requireArea(area: Exclude<Area, "guest">, currentPath: string): Promise<Member> {
  const member = await getMember();
  const target = redirectFor(toViewer(member), area, currentPath);
  if (target) redirect(target);
  return member!;
}

/** For sign-in/sign-up pages: send signed-in users to where they belong. */
export async function redirectIfSignedIn(): Promise<void> {
  const member = await getMember().catch(() => null);
  const target = redirectFor(toViewer(member), "guest");
  if (target) redirect(target);
}

/** Best-effort client IP for rate limiting. Never logged or stored. */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "local";
}

// --- Password recovery marker ----------------------------------------------

const RECOVERY_COOKIE = "haven_recovery";
const RECOVERY_TTL_SECONDS = 15 * 60;

/** Set after a recovery link is verified; binds the reset form to that user. */
export async function markRecovery(userId: string): Promise<void> {
  const store = await cookies();
  store.set(RECOVERY_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: RECOVERY_TTL_SECONDS,
  });
}

export async function hasRecoveryFor(userId: string): Promise<boolean> {
  const store = await cookies();
  return store.get(RECOVERY_COOKIE)?.value === userId;
}

export async function clearRecovery(): Promise<void> {
  const store = await cookies();
  store.delete(RECOVERY_COOKIE);
}
