import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/shells";
import { ForgotPasswordForm } from "../auth-forms";
import { Notice } from "../notice";

export const metadata: Metadata = { title: "Reset your password — Haven" };

export default function ForgotPasswordPage({ searchParams }: PageProps<"/forgot-password">) {
  return (
    <AuthShell
      title="Reset your password"
      intro="Enter the email you signed up with and we'll send you a link to choose a new password."
    >
      <Suspense fallback={null}>
        <LinkError searchParams={searchParams} />
      </Suspense>
      <ForgotPasswordForm />
    </AuthShell>
  );
}

async function LinkError({ searchParams }: Pick<PageProps<"/forgot-password">, "searchParams">) {
  const params = await searchParams;
  if (params.error !== "link_invalid") return null;
  return (
    <Notice tone="error">
      That reset link has expired or was already used. Request a new one below.
    </Notice>
  );
}
