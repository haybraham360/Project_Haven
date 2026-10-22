"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/components/forms";
import { clearRecovery, getMember, toViewer, type Member } from "@/lib/auth/dal";
import { redirectFor, ROUTES, type Area } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fieldErrors, preferencesSchema, profileSchema } from "@/lib/validation";

async function requireMemberIn(area: Area): Promise<Member> {
  const member = await getMember();
  const target = redirectFor(toViewer(member), area, ROUTES.settings);
  if (target) redirect(target);
  return member!;
}

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await requireMemberIn("member");
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
    console.error("[settings] profile update failed", error.code ?? "unknown");
    return { status: "error", message: "We couldn't save your details. Please try again.", values: raw };
  }
  return { status: "success", message: "Your details have been saved.", values: raw };
}

export async function updatePreferences(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await requireMemberIn("member");
  const parsed = preferencesSchema.safeParse({ interests: formData.getAll("interests").map(String) });
  if (!parsed.success) return { status: "error", message: "Please choose from the listed options." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ support_interests: parsed.data.interests })
    .eq("id", member.userId);
  if (error) {
    console.error("[settings] preferences update failed", error.code ?? "unknown");
    return { status: "error", message: "We couldn't save your preferences. Please try again." };
  }
  return { status: "success", message: "Your preferences have been saved." };
}

/**
 * Records a deletion request for manual processing, then signs the member
 * out. Available to onboarded members and to members who did not pass the
 * age gate. Does NOT delete data immediately (see docs/phase-1-auth.md).
 */
export async function requestDeletion(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await getMember();
  if (!member) redirect(ROUTES.signIn);

  if (formData.get("confirm") !== "on") {
    return {
      status: "error",
      message: "Please confirm you want to request deletion.",
      fieldErrors: { confirm: "Tick the box to confirm." },
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("request_account_deletion");
  if (error) {
    console.error("[settings] deletion request failed", error.code ?? "unknown");
    return { status: "error", message: "We couldn't record your request. Please try again." };
  }

  await supabase.auth.signOut({ scope: "global" });
  await clearRecovery();
  redirect(`${ROUTES.signIn}?deletion=requested`);
}
