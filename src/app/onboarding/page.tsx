import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppShell, LoadingCard } from "@/components/shells";
import { requireArea } from "@/lib/auth/dal";
import { ROUTES } from "@/lib/auth/redirects";
import { maxVisitableStep, stepPath } from "@/lib/onboarding";

/** Sends the member to the furthest onboarding step they have reached. */
export default function OnboardingIndex() {
  return (
    <AppShell nav={false}>
      <Suspense fallback={<LoadingCard label="Picking up where you left off…" />}>
        <ResumeOnboarding />
      </Suspense>
    </AppShell>
  );
}

async function ResumeOnboarding(): Promise<never> {
  const { profile } = await requireArea("onboarding", ROUTES.onboarding);
  redirect(stepPath(maxVisitableStep(profile.onboarding_step, profile.age_eligibility)));
}
