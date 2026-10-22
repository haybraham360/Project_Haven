/**
 * Pure routing rules for authentication and onboarding. Kept free of
 * framework imports so they can be unit-tested and reused by the proxy and
 * the server-side data access layer.
 */

export type AgeEligibility = "unknown" | "eligible" | "ineligible";
export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export type Viewer =
  | { signedIn: false }
  | {
      signedIn: true;
      ageEligibility: AgeEligibility;
      onboardingStatus: OnboardingStatus;
    };

/**
 * Areas of the app with different access rules:
 * - guest: sign-in / sign-up screens (signed-out visitors only)
 * - onboarding: the setup wizard (signed in, not yet completed)
 * - onboarding-complete: the final "you're all set" screen
 * - member: dashboard, settings (signed in, eligible, onboarded)
 * - not-eligible: explanation for users who did not pass the age gate
 * - recovery: set a new password (signed in via a recovery link)
 */
export type Area =
  | "guest"
  | "onboarding"
  | "onboarding-complete"
  | "member"
  | "not-eligible"
  | "recovery";

export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  onboarding: "/onboarding",
  onboardingComplete: "/onboarding/complete",
  dashboard: "/dashboard",
  settings: "/settings",
  notEligible: "/not-eligible",
} as const;

/** Path prefixes that require a signed-in user. Used by the proxy for an early, optimistic redirect. */
export const PROTECTED_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.settings,
  ROUTES.onboarding,
  ROUTES.notEligible,
  ROUTES.resetPassword,
];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Accepts only same-origin relative paths. Anything else (absolute URLs,
 * protocol-relative "//", backslash tricks, control characters) falls back.
 */
export function safeNextPath(value: unknown, fallback: string = ROUTES.dashboard): string {
  if (typeof value !== "string") return fallback;
  if (value.length === 0 || value.length > 512) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f\u007f\\]/.test(value)) return fallback;
  try {
    const url = new URL(value, "http://haven.invalid");
    if (url.origin !== "http://haven.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

/** Where a signed-in viewer belongs by default. */
export function homeFor(viewer: Extract<Viewer, { signedIn: true }>): string {
  if (viewer.ageEligibility === "ineligible") return ROUTES.notEligible;
  if (viewer.onboardingStatus !== "completed") return ROUTES.onboarding;
  return ROUTES.dashboard;
}

/**
 * Returns the path to redirect to, or null when the viewer may stay.
 * Every redirect target is itself allowed for that viewer, so no loops.
 */
export function redirectFor(viewer: Viewer, area: Area, currentPath?: string): string | null {
  if (!viewer.signedIn) {
    if (area === "guest") return null;
    const next = currentPath ? `?next=${encodeURIComponent(safeNextPath(currentPath))}` : "";
    return `${ROUTES.signIn}${next}`;
  }

  // Password recovery is allowed for any signed-in user; the page checks the
  // recovery marker separately.
  if (area === "recovery") return null;

  const home = homeFor(viewer);

  switch (area) {
    case "guest":
      return home;
    case "not-eligible":
      return viewer.ageEligibility === "ineligible" ? null : home;
    case "onboarding":
      return home === ROUTES.onboarding ? null : home;
    case "onboarding-complete":
      return home === ROUTES.dashboard ? null : home;
    case "member":
      return home === ROUTES.dashboard ? null : home;
  }
}
