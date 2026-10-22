import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell, LoadingCard } from "@/components/shells";
import { redirectIfSignedIn } from "@/lib/auth/dal";
import { SignUpForm } from "../auth-forms";

export const metadata: Metadata = { title: "Create an account — Haven" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      face={{ shape: "star", expression: "happy" }}
      intro={
        <p>
          Haven is free to use. During this preview, accounts are for adults aged 18 and over.
          We&apos;ll ask for as little information as possible.
        </p>
      }
    >
      <Suspense fallback={<LoadingCard />}>
        <SignUpContent />
      </Suspense>
    </AuthShell>
  );
}

async function SignUpContent() {
  await redirectIfSignedIn();
  return <SignUpForm />;
}
