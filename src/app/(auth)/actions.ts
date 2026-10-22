"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/components/forms";
import { publicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clearRecovery, clientKey, getMember, hasRecoveryFor } from "@/lib/auth/dal";
import { ROUTES, safeNextPath } from "@/lib/auth/redirects";
import { RATE_LIMITS, rateLimit, type RateLimitRule } from "@/lib/rate-limit";
import {
  emailOnlySchema,
  fieldErrors,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation";

// User-facing messages. Never include provider error text, tokens or stack traces.
const MSG = {
  tooMany: "Too many attempts. Please wait a few minutes and try again.",
  service: "Something went wrong on our side. Please try again in a moment.",
  invalidLogin: "Email or password is incorrect.",
  unverified:
    "Please verify your email address first. Check your inbox, or request a new verification email below.",
  checkEmail:
    "If that address can receive email, a message is on its way. It may take a few minutes. Check your spam folder too.",
};

async function limited(action: string, rule: RateLimitRule, extra = ""): Promise<boolean> {
  const key = `${action}:${await clientKey()}:${extra}`;
  return !rateLimit(key, rule).ok;
}

/** Logs a provider error code only — never messages, which may echo input. */
function logAuthError(action: string, error: { code?: string; status?: number } | null) {
  console.error(`[auth] ${action} failed`, error?.code ?? "unknown", error?.status ?? "");
}

function isRateLimited(error: { code?: string; status?: number }) {
  return error.status === 429 || error.code?.startsWith("over_") === true;
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const parsed = signUpSchema.safeParse({
    email,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), values: { email } };
  }
  if (await limited("signUp", RATE_LIMITS.signUp)) {
    return { status: "error", message: MSG.tooMany, values: { email } };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${publicEnv().appUrl}/auth/confirm?next=${ROUTES.onboarding}` },
  });

  if (error) {
    if (error.code === "weak_password") {
      return {
        status: "error",
        message: "Please choose a different password.",
        fieldErrors: { password: "This password is too easy to guess or has appeared in a data breach. Try another." },
        values: { email },
      };
    }
    if (isRateLimited(error)) return { status: "error", message: MSG.tooMany, values: { email } };
    // "Already registered" is deliberately treated like success so the
    // response does not reveal whether an account exists.
    if (error.code !== "user_already_exists" && error.code !== "email_exists") {
      logAuthError("signUp", error);
      return { status: "error", message: MSG.service, values: { email } };
    }
  }

  redirect(`${ROUTES.verifyEmail}?sent=1`);
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const next = safeNextPath(formData.get("next"), ROUTES.dashboard);
  const parsed = signInSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), values: { email } };
  }
  if (await limited("signIn", RATE_LIMITS.signIn, parsed.data.email)) {
    return { status: "error", message: MSG.tooMany, values: { email } };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { status: "error", message: MSG.unverified, values: { email, unverified: "1" } };
    }
    if (isRateLimited(error)) return { status: "error", message: MSG.tooMany, values: { email } };
    if (error.code !== "invalid_credentials") logAuthError("signIn", error);
    return { status: "error", message: error.code === "invalid_credentials" ? MSG.invalidLogin : MSG.service, values: { email } };
  }

  // The destination page applies onboarding / eligibility rules itself.
  redirect(next);
}

export async function resendVerification(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const parsed = emailOnlySchema.safeParse({ email });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error), message: "Please fix the highlighted field.", values: { email } };
  }
  if (await limited("resend", RATE_LIMITS.resendVerification, parsed.data.email)) {
    return { status: "error", message: MSG.tooMany, values: { email } };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: `${publicEnv().appUrl}/auth/confirm?next=${ROUTES.onboarding}` },
  });
  if (error) {
    if (isRateLimited(error)) return { status: "error", message: MSG.tooMany, values: { email } };
    logAuthError("resend", error);
  }
  // Same response whether or not the address has an account.
  return { status: "success", message: MSG.checkEmail, values: { email } };
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const parsed = emailOnlySchema.safeParse({ email });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error), message: "Please fix the highlighted field.", values: { email } };
  }
  if (await limited("forgot", RATE_LIMITS.forgotPassword, parsed.data.email)) {
    return { status: "error", message: MSG.tooMany, values: { email } };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${publicEnv().appUrl}/auth/confirm?next=${ROUTES.resetPassword}`,
  });
  if (error) {
    if (isRateLimited(error)) return { status: "error", message: MSG.tooMany, values: { email } };
    logAuthError("forgot", error);
  }
  return {
    status: "success",
    message:
      "If an account exists for that address, we've sent a link to reset your password. The link expires after a short time and works once.",
    values: { email },
  };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await getMember().catch(() => null);
  if (!member || !(await hasRecoveryFor(member.userId))) {
    return { status: "error", message: "This reset link has expired or was already used. Please request a new one." };
  }
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  if (await limited("reset", RATE_LIMITS.resetPassword, member.userId)) {
    return { status: "error", message: MSG.tooMany };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") {
      return { status: "error", message: "Please choose a new password.", fieldErrors: { password: "Choose a password you haven't used for this account." } };
    }
    if (error.code === "weak_password") {
      return { status: "error", message: "Please choose a different password.", fieldErrors: { password: "This password is too easy to guess or has appeared in a data breach." } };
    }
    if (isRateLimited(error)) return { status: "error", message: MSG.tooMany };
    logAuthError("updatePassword", error);
    return { status: "error", message: MSG.service };
  }

  await clearRecovery();
  // End sessions on other devices after a password reset.
  await supabase.auth.signOut({ scope: "others" });
  return { status: "success", message: "Your password has been updated." };
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  // "local" revokes this device's session on the auth server and clears cookies.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) logAuthError("signOut", error);
  await clearRecovery();
  redirect(`${ROUTES.signIn}?signed_out=1`);
}
