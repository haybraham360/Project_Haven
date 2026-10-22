import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell, LoadingCard } from "@/components/shells";
import { MoodFace } from "@/components/mood-face";
import { card } from "@/components/ui";
import { requireArea } from "@/lib/auth/dal";
import { ROUTES } from "@/lib/auth/redirects";
import { DeletionRequestForm } from "../(member)/settings/settings-forms";

export const metadata: Metadata = { title: "Haven isn't available yet — Haven" };

export default function NotEligiblePage() {
  return (
    <AppShell nav={false}>
      <div className={`${card} mx-auto max-w-2xl p-6 sm:p-10`}>
        <Suspense fallback={<LoadingCard />}>
          <NotEligible />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function NotEligible() {
  await requireArea("not-eligible", ROUTES.notEligible);
  return (
    <>
      <MoodFace shape="blob" expression="calm" className="size-14" />
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Thank you for telling us</h1>
      <div className="mt-4 space-y-4 leading-relaxed text-ink-muted">
        <p>
          Haven&apos;s first pilot is only open to adults aged 18 and over, so we can&apos;t offer
          you an account right now. This isn&apos;t about you. We want to make sure any service
          for younger people has the right protections in place first.
        </p>
        <p>
          Reaching out is a strong step. Talking to someone you trust, like a family member,
          friend, teacher, school counsellor, or doctor, can really help.
        </p>
        <p className="rounded-2xl bg-cream-100 px-4 py-3 text-ink">
          <strong>If you are in danger or need help right now,</strong> contact your local
          emergency number or go to the nearest emergency department.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-bold">Remove your account</h2>
      <p className="mb-5 mt-2 text-sm leading-relaxed text-ink-muted">
        You can ask us to delete the account you created. A team member completes deletion
        requests during this preview.
      </p>
      <DeletionRequestForm />
    </>
  );
}
