/** Onboarding step definitions and pure navigation rules. */

export const ONBOARDING_STEPS = [
  { n: 1, slug: "welcome", title: "Welcome" },
  { n: 2, slug: "age", title: "Age" },
  { n: 3, slug: "profile", title: "About you" },
  { n: 4, slug: "preferences", title: "What might help" },
  { n: 5, slug: "terms", title: "Terms and privacy" },
] as const;

export type StepSlug = (typeof ONBOARDING_STEPS)[number]["slug"];

export const TOTAL_STEPS = ONBOARDING_STEPS.length;

export function stepBySlug(slug: string) {
  return ONBOARDING_STEPS.find((s) => s.slug === slug) ?? null;
}

export function stepPath(n: number): string {
  const step = ONBOARDING_STEPS.find((s) => s.n === n);
  return step ? `/onboarding/${step.slug}` : "/onboarding/complete";
}

/**
 * The furthest step a member may open. `reached` is the server-stored
 * onboarding_step (1–6). Steps beyond the age gate need eligibility.
 */
export function maxVisitableStep(reached: number, ageEligibility: string): number {
  const cap = ageEligibility === "eligible" ? TOTAL_STEPS : 2;
  return Math.max(1, Math.min(reached, cap));
}

export function canVisitStep(n: number, reached: number, ageEligibility: string): boolean {
  return n >= 1 && n <= maxVisitableStep(reached, ageEligibility);
}
