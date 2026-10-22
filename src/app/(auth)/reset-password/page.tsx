import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell, LoadingCard } from "@/components/shells";
import { primaryButton } from "@/components/ui";
import { hasRecoveryFor, requireArea } from "@/lib/auth/dal";
import { ROUTES } from "@/lib/auth/redirects";
import { ResetPasswordForm } from "../auth-forms";

export const metadata: Metadata = { title: "Choose a new password — Haven" };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Choose a new password" face={{ shape: "blob", expression: "calm" }}>
      <Suspense fallback={<LoadingCard />}>
        <ResetContent />
      </Suspense>
    </AuthShell>
  );
}

async function ResetContent() {
  const member = await requireArea("recovery", ROUTES.resetPassword);
  // The recovery marker is set only after a valid reset link is verified.
  if (!(await hasRecoveryFor(member.userId))) {
    return (
      <div className="space-y-5">
        <p className="leading-relaxed text-ink-muted">
          This reset link has expired or was already used. You can request a new one.
        </p>
        <Link href={ROUTES.forgotPassword} className={`${primaryButton} w-full`}>
          Request a new link
        </Link>
      </div>
    );
  }
  return <ResetPasswordForm />;
}
