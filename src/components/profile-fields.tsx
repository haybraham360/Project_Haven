"use client";

import { SelectField, TextField } from "@/components/forms";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import { LANGUAGES } from "@/lib/languages";
import { SUPPORT_INTERESTS } from "@/lib/validation";

export type ProfileValues = { displayName: string; countryCode: string; preferredLanguage: string };

export const choiceBox =
  "flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-cream-200 bg-white p-4 transition hover:border-haven-violet/50 has-checked:border-haven-violet has-checked:bg-haven-violet/5 has-focus-visible:ring-4 has-focus-visible:ring-haven-violet/30";
export const choiceInput = "mt-1 size-5 shrink-0 accent-haven-purple";

/** Minimal profile fields shared by onboarding and Settings. All optional. */
export function ProfileFields({ values, errors }: { values: ProfileValues; errors?: Record<string, string> }) {
  return (
    <>
      <TextField
        name="displayName"
        label="What should we call you?"
        optional
        maxLength={40}
        autoComplete="nickname"
        hint="It doesn't need to be your real name."
        defaultValue={values.displayName}
        error={errors?.displayName}
      />
      <SelectField
        name="countryCode"
        label="Where are you based?"
        optional
        hint="This helps us show services and safety information for your area when they become available."
        options={COUNTRY_OPTIONS.map((c) => ({ value: c.code, label: c.name }))}
        defaultValue={values.countryCode}
        error={errors?.countryCode}
      />
      <SelectField
        name="preferredLanguage"
        label="Preferred language"
        optional
        hint="Haven is in English for now. We'll use this when other languages are ready."
        options={LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
        defaultValue={values.preferredLanguage}
        error={errors?.preferredLanguage}
      />
    </>
  );
}

export function InterestFields({ selected, legend }: { selected: string[]; legend: string }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 font-semibold">
        {legend} <span className="font-normal text-ink-muted">(optional)</span>
      </legend>
      {SUPPORT_INTERESTS.map((i) => (
        <label key={i.value} className={choiceBox}>
          <input
            type="checkbox"
            name="interests"
            value={i.value}
            defaultChecked={selected.includes(i.value)}
            className={choiceInput}
          />
          <span>{i.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
