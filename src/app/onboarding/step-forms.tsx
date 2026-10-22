"use client";

import { useActionState } from "react";
import { FieldError, FormAlert, SubmitButton, initialFormState } from "@/components/forms";
import { InterestFields, ProfileFields, choiceBox, choiceInput, type ProfileValues } from "@/components/profile-fields";
import { secondaryButton } from "@/components/ui";
import type { PolicyDoc } from "@/content/policies";
import { acceptTerms, continueFromWelcome, saveProfile, savePreferences, submitAge } from "./actions";

export function WelcomeForm() {
  const [state, action] = useActionState(continueFromWelcome, initialFormState);
  return (
    <form action={action} className="space-y-5">
      <FormAlert state={state} />
      <SubmitButton pendingLabel="One moment…">Let&apos;s begin</SubmitButton>
    </form>
  );
}

export function AgeForm() {
  const [state, action] = useActionState(submitAge, initialFormState);
  const error = state.fieldErrors?.isAdult;
  return (
    <form action={action} noValidate className="space-y-6">
      <FormAlert state={state} />
      <fieldset aria-describedby={error ? "age-error" : undefined} className="space-y-3">
        <legend className="mb-3 font-semibold">How old are you?</legend>
        <label className={choiceBox}>
          <input type="radio" name="isAdult" value="yes" className={choiceInput} />
          <span>I am 18 or older</span>
        </label>
        <label className={choiceBox}>
          <input type="radio" name="isAdult" value="no" className={choiceInput} />
          <span>I am under 18</span>
        </label>
      </fieldset>
      <FieldError id="age-error" message={error} />
      <p className="text-sm text-ink-muted">
        Please answer honestly. You can&apos;t change this answer later, so that the adult pilot
        stays adults-only.
      </p>
      <SubmitButton pendingLabel="Saving…">Continue</SubmitButton>
    </form>
  );
}

export function ProfileForm({ defaults }: { defaults: ProfileValues }) {
  const [state, action] = useActionState(saveProfile, initialFormState);
  const values = (state.values as ProfileValues | undefined) ?? defaults;
  return (
    <form action={action} noValidate className="space-y-6">
      <FormAlert state={state} />
      <ProfileFields values={values} errors={state.fieldErrors} />
      <SubmitButton pendingLabel="Saving…">Save and continue</SubmitButton>
    </form>
  );
}

export function PreferencesForm({ selected }: { selected: string[] }) {
  const [state, action] = useActionState(savePreferences, initialFormState);
  return (
    <form action={action} noValidate className="space-y-6">
      <FormAlert state={state} />
      <InterestFields selected={selected} legend="Choose any that interest you" />
      <p className="text-sm text-ink-muted">
        These are just preferences, not a diagnosis or assessment. You can change them any time
        in Settings.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton pendingLabel="Saving…">Save and continue</SubmitButton>
        <button type="submit" name="intent" value="skip" formNoValidate className={secondaryButton}>
          Skip for now
        </button>
      </div>
    </form>
  );
}

export function TermsForm({ policies }: { policies: PolicyDoc[] }) {
  const [state, action] = useActionState(acceptTerms, initialFormState);
  const fields = { terms_of_service: "acceptTerms", privacy_notice: "acceptPrivacy" } as const;
  return (
    <form action={action} noValidate className="space-y-6">
      <FormAlert state={state} />
      {policies.map((p) => {
        const field = fields[p.type];
        const error = state.fieldErrors?.[field];
        return (
          <section key={p.type} aria-labelledby={`${p.type}-title`} className="rounded-3xl bg-cream-100 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id={`${p.type}-title`} className="text-lg font-bold">
                {p.title}
              </h2>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-ink-muted">
                Version {p.version}
              </span>
              {p.isDraft && (
                <span className="rounded-full bg-mood-orange/40 px-2.5 py-0.5 text-xs font-semibold">
                  Draft · not yet legally reviewed
                </span>
              )}
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink-muted">
              {p.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <label className={`${choiceBox} mt-5`}>
              <input
                type="checkbox"
                name={field}
                className={choiceInput}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${field}-error` : undefined}
              />
              <span>
                I have read and understand the {p.title.toLowerCase()} (version {p.version}).
              </span>
            </label>
            <div className="mt-2">
              <FieldError id={`${field}-error`} message={error} />
            </div>
          </section>
        );
      })}
      <p className="text-sm text-ink-muted">
        We only ask for what&apos;s needed to use Haven. We never bundle marketing, research, or AI
        consent into account setup.
      </p>
      <SubmitButton pendingLabel="Saving…">Agree and finish</SubmitButton>
    </form>
  );
}
