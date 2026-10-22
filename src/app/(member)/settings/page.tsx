import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { AppShell, LoadingCard, SignOutButton } from "@/components/shells";
import { card } from "@/components/ui";
import { requireArea } from "@/lib/auth/dal";
import { ROUTES } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { policyFor } from "@/content/policies";
import { DeletionRequestForm, PreferencesSettingsForm, ProfileSettingsForm } from "./settings-forms";

export const metadata: Metadata = { title: "Settings — Haven" };

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" });

export default function SettingsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Settings</h1>
      <Suspense fallback={<LoadingCard label="Loading your settings…" />}>
        <SettingsContent />
      </Suspense>
    </AppShell>
  );
}

function Section({ id, title, intro, children }: { id: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`${card} p-6 sm:p-8`}>
      <h2 id={id} className="text-xl font-bold">
        {title}
      </h2>
      {intro && <div className="mt-2 leading-relaxed text-ink-muted">{intro}</div>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

async function SettingsContent() {
  const { email, profile } = await requireArea("member", ROUTES.settings);
  const supabase = await createSupabaseServerClient();
  const { data: consents, error } = await supabase
    .from("consents")
    .select("consent_type, policy_version, accepted_at, withdrawn_at")
    .order("accepted_at", { ascending: false });

  return (
    <div className="mt-8 space-y-6">
      <Section id="account-title" title="Account">
        <dl className="grid gap-1">
          <dt className="text-sm text-ink-muted">Email</dt>
          <dd className="font-semibold break-all">{email}</dd>
        </dl>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </Section>

      <Section id="details-title" title="Your details" intro="All optional. Only you can see these.">
        <ProfileSettingsForm
          defaults={{
            displayName: profile.display_name ?? "",
            countryCode: profile.country_code ?? "",
            preferredLanguage: profile.preferred_language ?? "",
          }}
        />
      </Section>

      <Section
        id="prefs-title"
        title="Support preferences"
        intro="These are preferences only, not a diagnosis or assessment."
      >
        <PreferencesSettingsForm selected={profile.support_interests} />
      </Section>

      <Section id="policies-title" title="Terms and privacy" intro="The versions you've acknowledged.">
        {error ? (
          <p role="alert">We couldn&apos;t load this right now. Please try again later.</p>
        ) : (
          <ul className="space-y-3">
            {(consents ?? []).map((c) => {
              const doc = policyFor(c.consent_type, c.policy_version);
              return (
                <li key={`${c.consent_type}-${c.policy_version}`} className="rounded-2xl bg-cream-100 px-4 py-3">
                  <p className="font-semibold">
                    {doc?.title ?? c.consent_type} · version {c.policy_version}
                    {doc?.isDraft && <span className="ml-2 text-sm font-normal text-ink-muted">(draft)</span>}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Acknowledged {dateFormat.format(new Date(c.accepted_at))}
                    {c.withdrawn_at ? ` · withdrawn ${dateFormat.format(new Date(c.withdrawn_at))}` : ""}
                  </p>
                  {doc && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-semibold text-haven-purple">Read summary</summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-muted">
                        {doc.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section
        id="delete-title"
        title="Delete your account"
        intro={
          <p>
            During this preview, deletion requests are recorded and then completed by a team
            member rather than instantly. Some information may stay in encrypted backups until
            they expire, or where the law requires us to keep it.
          </p>
        }
      >
        <DeletionRequestForm />
      </Section>
    </div>
  );
}
