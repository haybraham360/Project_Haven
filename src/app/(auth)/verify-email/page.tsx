import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell, LoadingCard } from "@/components/shells";
import { textLink } from "@/components/ui";
import { ResendVerificationForm } from "../auth-forms";
import { Notice } from "../notice";

export const metadata: Metadata = { title: "Verify your email — Haven" };

export default function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  return (
    <AuthShell
      title="Check your email"
      face={{ shape: "circle", expression: "happy" }}
      intro={
        <p>
          To finish creating your account, open the verification link we emailed you. The
          link expires after a while, so use it soon.
        </p>
      }
    >
      <Suspense fallback={<LoadingCard />}>
        <SentNotice searchParams={searchParams} />
      </Suspense>
      <h2 className="text-lg font-bold">Didn&apos;t get it?</h2>
      <p className="mb-5 mt-1 text-sm text-ink-muted">
        Check your spam folder, or enter your email to send a new link.
      </p>
      <ResendVerificationForm />
      <p className="mt-6 text-center text-sm text-ink-muted">
        Already verified?{" "}
        <Link href="/sign-in" className={textLink}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

async function SentNotice({ searchParams }: Pick<PageProps<"/verify-email">, "searchParams">) {
  const params = await searchParams;
  if (params.sent !== "1") return null;
  return (
    <Notice>
      If that address can be used to create an account, we&apos;ve sent a verification email.
    </Notice>
  );
}
