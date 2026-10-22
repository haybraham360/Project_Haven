import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AppShell, LoadingCard } from "@/components/shells";
import { MoodFace } from "@/components/mood-face";
import { card, primaryButton } from "@/components/ui";
import { requireArea } from "@/lib/auth/dal";
import { ROUTES } from "@/lib/auth/redirects";

export const metadata: Metadata = { title: "You're all set — Haven" };

export default function OnboardingCompletePage() {
  return (
    <AppShell nav={false}>
      <div className={`${card} mx-auto max-w-2xl p-6 text-center sm:p-12`}>
        <Suspense fallback={<LoadingCard />}>
          <Complete />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function Complete() {
  const { profile } = await requireArea("onboarding-complete", ROUTES.onboardingComplete);
  return (
    <>
      <div className="flex justify-center gap-3" aria-hidden="true">
        <MoodFace shape="star" expression="happy" className="size-12" />
        <MoodFace shape="square" expression="calm" className="size-12" />
        <MoodFace shape="circle" expression="happy" className="size-12" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        You&apos;re all set{profile.display_name ? `, ${profile.display_name}` : ""}
      </h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-muted">
        Your account is ready. For now, you can manage your details and preferences. Your
        dashboard shows clearly which features are available and which are still to come.
      </p>
      <Link href={ROUTES.dashboard} className={`${primaryButton} mt-8`}>
        Go to your dashboard
      </Link>
    </>
  );
}
