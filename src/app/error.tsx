"use client";

import Link from "next/link";
import { MoodFace } from "@/components/mood-face";
import { card, primaryButton, secondaryButton } from "@/components/ui";

/** Friendly fallback for unexpected failures. Never shows error details. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-4 py-16">
      <div className={`${card} w-full max-w-md p-8 text-center`}>
        <MoodFace shape="blob" expression="neutral" className="mx-auto size-14" />
        <h1 className="mt-5 text-2xl font-extrabold">Something went wrong</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">
          We couldn&apos;t load this page. This might be a connection problem or something on our
          side. Your information hasn&apos;t been changed.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className={primaryButton}>
            Try again
          </button>
          <Link href="/" className={secondaryButton}>
            Go to home
          </Link>
        </div>
      </div>
    </main>
  );
}
