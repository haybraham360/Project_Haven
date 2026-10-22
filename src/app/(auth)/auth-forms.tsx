"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormAlert, SubmitButton, TextField, initialFormState } from "@/components/forms";
import { primaryButton, textLink } from "@/components/ui";
import { PASSWORD_MIN } from "@/lib/validation";
import {
  requestPasswordReset,
  resendVerification,
  signIn,
  signUp,
  updatePassword,
} from "./actions";

const passwordHint = `At least ${PASSWORD_MIN} characters, with a letter and a number or symbol. A short phrase works well.`;

export function SignUpForm() {
  const [state, action] = useActionState(signUp, initialFormState);
  return (
    <form action={action} noValidate className="space-y-5">
      <FormAlert state={state} />
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        hint={passwordHint}
        error={state.fieldErrors?.password}
      />
      <TextField
        name="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.confirmPassword}
      />
      <SubmitButton className="w-full" pendingLabel="Creating your account…">
        Create account
      </SubmitButton>
      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className={textLink}>
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function SignInForm({ next }: { next?: string }) {
  const [state, action] = useActionState(signIn, initialFormState);
  return (
    <form action={action} noValidate className="space-y-5">
      <FormAlert state={state} />
      {state.values?.unverified && (
        <p className="text-sm">
          <Link href="/verify-email" className={textLink}>
            Resend verification email
          </Link>
        </p>
      )}
      {next && <input type="hidden" name="next" value={next} />}
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />
      <div className="text-right text-sm">
        <Link href="/forgot-password" className={textLink}>
          Forgot your password?
        </Link>
      </div>
      <SubmitButton className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
      <p className="text-center text-sm text-ink-muted">
        New to Haven?{" "}
        <Link href="/sign-up" className={textLink}>
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function ResendVerificationForm() {
  const [state, action] = useActionState(resendVerification, initialFormState);
  return (
    <form action={action} noValidate className="space-y-5">
      <FormAlert state={state} />
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <SubmitButton className="w-full" pendingLabel="Sending…">
        Resend verification email
      </SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, initialFormState);
  return (
    <form action={action} noValidate className="space-y-5">
      <FormAlert state={state} />
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <SubmitButton className="w-full" pendingLabel="Sending…">
        Send reset link
      </SubmitButton>
      <p className="text-center text-sm text-ink-muted">
        Remembered it?{" "}
        <Link href="/sign-in" className={textLink}>
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, initialFormState);
  if (state.status === "success") {
    return (
      <div className="space-y-5">
        <FormAlert state={state} />
        <Link href="/dashboard" className={`${primaryButton} w-full`}>
          Continue
        </Link>
      </div>
    );
  }
  return (
    <form action={action} noValidate className="space-y-5">
      <FormAlert state={state} />
      <TextField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        hint={passwordHint}
        error={state.fieldErrors?.password}
      />
      <TextField
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.confirmPassword}
      />
      <SubmitButton className="w-full" pendingLabel="Saving…">
        Save new password
      </SubmitButton>
    </form>
  );
}
