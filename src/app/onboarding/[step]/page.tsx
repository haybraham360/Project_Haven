import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { AppShell, LoadingCard } from "@/components/shells";
import { MoodFace } from "@/components/mood-face";
import { card, focusRing, primaryButton } from "@/components/ui";
import { policyFor, type PolicyDoc } from "@/content/policies";
import { requireArea, type Member } from "@/lib/auth/dal";
import { ONBOARDING_STEPS, TOTAL_STEPS, canVisitStep, maxVisitableStep, stepBySlug, stepPath } from "@/lib/onboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AgeForm, PreferencesForm, ProfileForm, TermsForm, WelcomeForm } from "../step-forms";

export const metadata: Metadata = { title: "Set up your account — Haven" };

export function generateStaticParams() {
  return ONBOARDING_STEPS.map((s) => ({ step: s.slug }));
}

export default function OnboardingStepPage({ params }: PageProps<"/onboarding/[step]">) {
  return (
    <AppShell nav={false}>
      <div className={`${card} mx-auto max-w-2xl p-6 sm:p-10`}>
        <Suspense fallback={<LoadingCard />}>
          <StepContent params={params} />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function StepContent({ params }: Pick<PageProps<"/onboarding/[step]">, "params">) {
  const { step: slug } = await params;
  const step = stepBySlug(slug);
  if (!step) notFound();

  const member = await requireArea("onboarding", `/onboarding/${slug}`);
  const { onboarding_step: reached, age_eligibility: eligibility } = member.profile;
  if (!canVisitStep(step.n, reached, eligibility)) {
    redirect(stepPath(maxVisitableStep(reached, eligibility)));
  }

  return (
    <>
      <Progress current={step.n} />
      {step.n > 1 && (
        <Link
          href={stepPath(step.n - 1)}
          className={`mb-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-ink-muted hover:text-ink ${focusRing}`}
        >
          <span aria-hidden="true">←</span> Back
        </Link>
      )}
      {await renderStep(step.slug, member)}
    </>
  );
}

function Progress({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-haven-purple">
        Step {current} of {TOTAL_STEPS}
      </p>
      <ol className="mt-3 grid grid-cols-5 gap-2" aria-label="Setup progress">
        {ONBOARDING_STEPS.map((s) => (
          <li key={s.slug} aria-current={s.n === current ? "step" : undefined}>
            <span
              className={`block h-2 rounded-full ${s.n <= current ? "bg-linear-to-r from-haven-purple to-haven-coral" : "bg-cream-200"}`}
            />
            <span className="sr-only">
              {s.title}
              {s.n < current ? " (done)" : s.n === current ? " (current step)" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      {children && <div className="mt-4 space-y-3 leading-relaxed text-ink-muted">{children}</div>}
    </div>
  );
}

async function renderStep(slug: string, member: Member) {
  const { profile } = member;
  switch (slug) {
    case "welcome":
      return (
        <>
          <MoodFace shape="star" expression="happy" className="mb-5 size-14" />
          <StepHeading title="Welcome to Haven">
            <p>
              Haven is being built to help people find support and practical resources,
              without having to pay for the basics.
            </p>
            <p>
              Right now you can set up your account and choose your preferences. Volunteer
              professional sessions, peer support, and self-help tools are planned but{" "}
              <strong className="text-ink">not available yet</strong>. We&apos;ll be honest about
              what&apos;s ready.
            </p>
            <p>Setup takes about two minutes. You can skip anything marked optional.</p>
          </StepHeading>
          <WelcomeForm />
        </>
      );
    case "age":
      return (
        <>
          <StepHeading title="Confirm your age">
            <p>
              Haven&apos;s first pilot is for adults aged 18 and over. We don&apos;t ask for your
              date of birth, just whether you&apos;re 18 or older.
            </p>
          </StepHeading>
          {profile.age_eligibility === "eligible" ? (
            <div className="space-y-6">
              <p className="rounded-2xl bg-mood-green/30 px-4 py-3">You&apos;ve confirmed you&apos;re 18 or older.</p>
              <Link href={stepPath(3)} className={primaryButton}>
                Continue
              </Link>
            </div>
          ) : (
            <AgeForm />
          )}
        </>
      );
    case "profile":
      return (
        <>
          <StepHeading title="A little about you">
            <p>Everything here is optional. Share only what you&apos;re comfortable with.</p>
          </StepHeading>
          <ProfileForm
            defaults={{
              displayName: profile.display_name ?? "",
              countryCode: profile.country_code ?? "",
              preferredLanguage: profile.preferred_language ?? "",
            }}
          />
        </>
      );
    case "preferences":
      return (
        <>
          <StepHeading title="What might help you?">
            <p>
              Tell us what you&apos;d like to explore when these features are ready. You don&apos;t
              need to explain why.
            </p>
          </StepHeading>
          <PreferencesForm selected={profile.support_interests} />
        </>
      );
    case "terms": {
      const policies = await currentPolicies();
      return (
        <>
          <StepHeading title="Terms and privacy">
            <p>Here&apos;s a plain-language summary of how Haven works and how we handle your information.</p>
          </StepHeading>
          {policies ? (
            <TermsForm policies={policies} />
          ) : (
            <p role="alert" className="rounded-2xl bg-haven-coral-soft/25 px-4 py-3">
              We couldn&apos;t load the current terms right now. Please refresh the page or try again later.
            </p>
          )}
        </>
      );
    }
    default:
      notFound();
  }
}

/** Current policy versions come from the database; text from src/content. */
async function currentPolicies(): Promise<PolicyDoc[] | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("policy_versions")
    .select("consent_type, version")
    .eq("is_current", true)
    .order("consent_type", { ascending: false });
  if (error || !data || data.length === 0) return null;
  const docs = data.map((row) => policyFor(row.consent_type, row.version));
  return docs.every((d): d is PolicyDoc => d !== null) ? docs : null;
}
