import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell, LoadingCard } from "@/components/shells";
import { redirectIfSignedIn } from "@/lib/auth/dal";
import { safeNextPath } from "@/lib/auth/redirects";
import { SignInForm } from "../auth-forms";
import { Notice } from "../notice";

export const metadata: Metadata = { title: "Sign in — Haven" };

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <AuthShell title="Welcome back" intro="Sign in to continue to your Haven account.">
      <Suspense fallback={<LoadingCard />}>
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function SignInContent({ searchParams }: Pick<PageProps<"/sign-in">, "searchParams">) {
  await redirectIfSignedIn();
  const params = await searchParams;
  const next = typeof params.next === "string" ? safeNextPath(params.next) : undefined;

  return (
    <>
      {params.error === "link_invalid" && (
        <Notice tone="error">
          That link has expired or was already used. Sign in below, or request a new
          verification email if you haven&apos;t verified yet.
        </Notice>
      )}
      {params.signed_out === "1" && <Notice>You&apos;ve signed out. Take care.</Notice>}
      {params.deletion === "requested" && (
        <Notice>Your deletion request has been recorded and you&apos;ve been signed out.</Notice>
      )}
      <SignInForm next={next} />
    </>
  );
}
