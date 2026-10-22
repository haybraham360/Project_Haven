"use client";

import { useFormStatus } from "react-dom";
import { useId, type ReactNode } from "react";
import { inputBase, primaryButton } from "@/components/ui";

/** Result returned by every form server action. */
export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Non-sensitive values to re-fill after an error (never passwords). */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

export function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  hint,
  error,
  defaultValue,
  required,
  optional,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  hint?: ReactNode;
  error?: string;
  defaultValue?: string;
  required?: boolean;
  optional?: boolean;
  maxLength?: number;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-semibold">
        {label}
        {optional && <span className="ml-2 text-sm font-normal text-ink-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputBase}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  error,
  hint,
  optional,
  placeholder = "Prefer not to say",
}: {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  defaultValue?: string | null;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-semibold">
        {label}
        {optional && <span className="ml-2 text-sm font-normal text-ink-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputBase}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-2 text-sm font-medium text-haven-coral">
      <span aria-hidden="true">●</span>
      {message}
    </p>
  );
}

/** Announces form-level results to screen readers. */
export function FormAlert({ state }: { state: FormState }) {
  if (state.status === "idle" || !state.message) return null;
  const isError = state.status === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isError ? "bg-haven-coral-soft/25 text-ink ring-1 ring-haven-coral/30" : "bg-mood-green/30 text-ink ring-1 ring-mood-green"
      }`}
    >
      {state.message}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Please wait…",
  className = "",
  name,
  value,
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      aria-disabled={pending}
      className={`${primaryButton} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
