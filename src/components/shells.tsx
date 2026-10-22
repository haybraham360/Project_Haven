import Link from "next/link";
import type { ReactNode } from "react";
import { MoodFace } from "@/components/mood-face";
import { SafetyBar } from "@/components/safety-bar";
import { card, focusRing } from "@/components/ui";
import { signOut } from "@/app/(auth)/actions";

type FaceProps = Parameters<typeof MoodFace>[0];

function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className={`flex items-center gap-2 rounded-full text-lg font-extrabold ${focusRing}`}>
      <MoodFace shape="star" expression="happy" className="size-8" />
      Haven
    </Link>
  );
}

function SimpleFooter() {
  return (
    <footer className="border-t border-black/5">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-ink-muted sm:flex-row sm:justify-between sm:px-6">
        <p>Project Haven (working name). Preview build.</p>
        <Link href="/#safety" className={`rounded hover:text-ink ${focusRing}`}>
          Safety information
        </Link>
      </div>
    </footer>
  );
}

/** Centered single-card layout for sign-in, sign-up and recovery screens. */
export function AuthShell({
  title,
  intro,
  face = { shape: "square", expression: "calm" },
  children,
}: {
  title: string;
  intro?: ReactNode;
  face?: Pick<FaceProps, "shape" | "expression">;
  children: ReactNode;
}) {
  return (
    <>
      <SafetyBar />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <Link href="/" className={`rounded text-sm font-medium text-ink-muted hover:text-ink ${focusRing}`}>
          Back to home
        </Link>
      </header>
      <main id="main" className="relative flex flex-1 items-start justify-center px-4 pb-16 pt-4 sm:pt-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-cream-50 to-cream-100" />
        <div className={`${card} w-full max-w-md p-6 sm:p-9`}>
          <MoodFace shape={face.shape} expression={face.expression} className="size-12" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight">{title}</h1>
          {intro && <div className="mt-3 leading-relaxed text-ink-muted">{intro}</div>}
          <div className="mt-7">{children}</div>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}

export function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition hover:bg-ink hover:text-white ${focusRing} ${className}`}
      >
        Sign out
      </button>
    </form>
  );
}

/** Layout for signed-in screens (dashboard, settings, onboarding). */
export function AppShell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <>
      <SafetyBar />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Logo href={nav ? "/dashboard" : "/"} />
        <div className="flex items-center gap-5">
          {nav && (
            <nav aria-label="Account">
              <ul className="flex items-center gap-5 text-sm font-medium text-ink-muted">
                <li>
                  <Link href="/dashboard" className={`rounded hover:text-ink ${focusRing}`}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className={`rounded hover:text-ink ${focusRing}`}>
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          )}
          <SignOutButton />
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-4 sm:px-6">
        {children}
      </main>
      <SimpleFooter />
    </>
  );
}

export function LoadingCard({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-6 text-ink-muted">
      <span className="size-3 rounded-full bg-haven-violet motion-safe:animate-pulse" aria-hidden="true" />
      {label}
    </div>
  );
}
