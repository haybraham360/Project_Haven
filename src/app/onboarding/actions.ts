"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/components/forms";
import { getMember, toViewer, type Member } from "@/lib/auth/dal";
import { redirectFor, ROUTES } from "@/lib/auth/redirects";
import { stepPath } from "@/lib/onboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ageSchema, fieldErrors, preferencesSchema, profileSchema } from "@/lib/validation";

const MSG = {
  service: "We couldn't save that just now. Please check your connection and try again.",
  profile: "We couldn't save your details. Please try again.",
  consent: "We couldn't record your acknowledgement. Please try again.",
};

/** Re-checks session and onboarding access on every action. */
async function requireOnboardingMember(): Promise<Member> {
  const member = await getMember();
  const target = redirectFor(toViewer(member), "onboarding", ROUTES.onboarding);
  if (target) redirect(target);
  return member!;
}

/** Maps database exceptions raised by our SQL functions to safe outcomes. */
function rpcFailure(error: { message?: string; code?: string }, fallback: string): FormState {
  if (error.message === "not_eligible") redirect(ROUTES.notEligible);
  if (error.message === "step_out_of_order") redirect(ROUTES.onboarding);
  console.error("[onboarding] rpc failed", error.code ?? "unknown");
  return { status: "error", message: fallback };
}

async function advance(target: number): Promise<FormState | null> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("advance_onboarding", { target });
  return error ? rpcFailure(error, MSG.service) : null;
}

export async function continueFromWelcome(): Promise<FormState> {
  await requireOnboardingMember();
  const failed = await advance(2);
  if (failed) return failed;
  redirect(stepPath(2));
}

export async function submitAge(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireOnboardingMember();
  const parsed = ageSchema.safeParse({ isAdult: formData.get("isAdult") });
  if (!parsed.success) {
    return { status: "error", message: "Please choose one option.", fieldErrors: fieldErrors(parsed.error) };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("declare_age", { is_adult: parsed.data.isAdult === "yes" });
  if (error) return rpcFailure(error, MSG.service);

  // The server decides the outcome; a previously recorded answer is kept.
  if (data === "ineligible") redirect(ROUTES.notEligible);
  redirect(stepPath(3));
}

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await requireOnboardingMember();
  const raw = {
    displayName: String(formData.get("displayName") ?? ""),
    countryCode: String(formData.get("countryCode") ?? ""),
    preferredLanguage: String(formData.get("preferredLanguage") ?? ""),
  };
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), values: raw };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      country_code: parsed.data.countryCode,
      preferred_language: parsed.data.preferredLanguage,
    })
    .eq("id", member.userId);
  if (error) {
    console.error("[onboarding] profile update failed", error.code ?? "unknown");
    return { status: "error", message: MSG.profile, values: raw };
  }

  const failed = await advance(4);
  if (failed) return failed;
  redirect(stepPath(4));
}

export async function savePreferences(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await requireOnboardingMember();

  if (formData.get("intent") !== "skip") {
    const parsed = preferencesSchema.safeParse({ interests: formData.getAll("interests").map(String) });
    if (!parsed.success) {
      return { status: "error", message: "Please choose from the listed options." };
    }
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("profiles")
      .update({ support_interests: parsed.data.interests })
      .eq("id", member.userId);
    if (error) {
      console.error("[onboarding] preferences update failed", error.code ?? "unknown");
      return { status: "error", message: MSG.profile };
    }
  }

  const failed = await advance(5);
  if (failed) return failed;
  redirect(stepPath(5));
}

export async function acceptTerms(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireOnboardingMember();
  const errors: Record<string, string> = {};
  if (formData.get("acceptTerms") !== "on") errors.acceptTerms = "Please confirm you've read the terms of service.";
  if (formData.get("acceptPrivacy") !== "on") errors.acceptPrivacy = "Please confirm you've read the privacy notice.";
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Both acknowledgements are needed to use Haven.", fieldErrors: errors };
  }

  const supabase = await createSupabaseServerClient();
  const { error: consentError } = await supabase.rpc("accept_required_policies");
  if (consentError) return rpcFailure(consentError, MSG.consent);

  const { error: completeError } = await supabase.rpc("complete_onboarding");
  if (completeError) return rpcFailure(completeError, MSG.service);

  redirect(ROUTES.onboardingComplete);
}
