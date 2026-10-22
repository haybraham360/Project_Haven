"use client";

import { useActionState } from "react";
import { FieldError, FormAlert, SubmitButton, initialFormState } from "@/components/forms";
import { InterestFields, ProfileFields, choiceBox, choiceInput, type ProfileValues } from "@/components/profile-fields";
import { requestDeletion, updatePreferences, updateProfile } from "./actions";

export function ProfileSettingsForm({ defaults }: { defaults: ProfileValues }) {
  const [state, action] = useActionState(updateProfile, initialFormState);
  const values = (state.values as ProfileValues | undefined) ?? defaults;
  return (
    <form action={action} noValidate className="space-y-6">
      <FormAlert state={state} />
      <ProfileFields values={values} errors={state.fieldErrors} />
      <SubmitButton pendingLabel="Saving…">Save details</SubmitButton>
    </form>
  );
}

export function PreferencesSettingsForm({ selected }: { selected: string[] }) {
  const [state, action] = useActionState(updatePreferences, initialFormState);
  return (
    <form action={action} noValidate className="space-y-6">
      <FormAlert state={state} />
      <InterestFields selected={selected} legend="What would you like to explore when it's ready?" />
      <SubmitButton pendingLabel="Saving…">Save preferences</SubmitButton>
    </form>
  );
}

export function DeletionRequestForm() {
  const [state, action] = useActionState(requestDeletion, initialFormState);
  const error = state.fieldErrors?.confirm;
  return (
    <form action={action} noValidate className="space-y-5">
      <FormAlert state={state} />
      <label className={choiceBox}>
        <input
          type="checkbox"
          name="confirm"
          className={choiceInput}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "confirm-error" : undefined}
        />
        <span>I want to request deletion of my Haven account. I understand I&apos;ll be signed out.</span>
      </label>
      <FieldError id="confirm-error" message={error} />
      <SubmitButton pendingLabel="Sending request…">Request account deletion</SubmitButton>
    </form>
  );
}
