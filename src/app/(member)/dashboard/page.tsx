import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AppShell, LoadingCard } from "@/components/shells";
import { MoodFace } from "@/components/mood-face";
import { card, focusRing } from "@/components/ui";
import { requireArea } from "@/lib/auth/dal";
import { ROUTES } from "@/lib/auth/redirects";

export const metadata: Metadata = { title: "Dashboard — Haven" };

const COMING_LATER = [
  { title: "Daily check-ins", body: "Optional, private notes on how you're doing." },
  { title: "Self-help resources", body: "Reviewed, practical guides and activities." },
  { title: "Volunteer professionals", body: "Free sessions with verified volunteers." },
  { title: "Peer support", body: "Moderated groups with trained listeners." },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingCard label="Loading your dashboard…" />}>
        <Dashboard />
      </Suspense>
    </AppShell>
  );
}

async function Dashboard() {
  const { profile } = await requireArea("member", ROUTES.dashboard);
  const name = profile.display_name;

  return (
    <div className="space-y-8">
      <section className={`${card} flex flex-col gap-6 bg-linear-to-br from-white to-cream-50 p-6 sm:flex-row sm:items-center sm:p-10`}>
        <MoodFace shape="star" expression="happy" className="size-16 shrink-0" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {name ? `Welcome, ${name}` : "Welcome to Haven"}
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
            Your account is set up. Haven is still being built, so for now this is where you
            manage your account. New features will appear here when they are ready.
          </p>
        </div>
      </section>

      <section aria-labelledby="now-title">
        <h2 id="now-title" className="text-xl font-bold">
          Available now
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          <li>
            <Link
              href={ROUTES.settings}
              className={`${card} flex h-full items-start gap-4 p-6 transition hover:-translate-y-0.5 ${focusRing}`}
            >
              <MoodFace shape="square" expression="calm" className="size-10 shrink-0" />
              <span>
                <span className="block font-bold">Account and settings</span>
                <span className="mt-1 block text-sm text-ink-muted">
                  Update your details and preferences, review terms, or request deletion.
                </span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/#safety"
              className={`${card} flex h-full items-start gap-4 p-6 transition hover:-translate-y-0.5 ${focusRing}`}
            >
              <MoodFace shape="circle" expression="calm" className="size-10 shrink-0" />
              <span>
                <span className="block font-bold">Safety information</span>
                <span className="mt-1 block text-sm text-ink-muted">
                  What to do if you need help right now. Haven is not an emergency service.
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="later-title">
        <h2 id="later-title" className="text-xl font-bold">
          Coming later
        </h2>
        <p className="mt-1 text-sm text-ink-muted">These features aren&apos;t available yet.</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMING_LATER.map((f) => (
            <li key={f.title} className="rounded-[28px] border-2 border-dashed border-cream-200 p-5">
              <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Not available yet
              </span>
              <p className="mt-3 font-bold">{f.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
