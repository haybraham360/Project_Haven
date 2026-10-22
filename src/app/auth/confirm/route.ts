import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { markRecovery } from "@/lib/auth/dal";
import { ROUTES, safeNextPath } from "@/lib/auth/redirects";
import { publicEnv } from "@/lib/env";

const ALLOWED_TYPES = new Set<EmailOtpType>(["signup", "email", "recovery", "email_change"]);

/**
 * Handles links from verification and password-recovery emails.
 * Supports both the recommended token-hash templates (works across devices)
 * and the default PKCE "?code=" links (same browser only).
 * Tokens are never logged.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"), ROUTES.onboarding);
  const isRecovery = type === "recovery" || next === ROUTES.resetPassword;

  // Redirect to the configured app origin, never to the request's Host header.
  const origin = publicEnv().appUrl;
  const fail = () =>
    NextResponse.redirect(
      isRecovery
        ? `${origin}${ROUTES.forgotPassword}?error=link_invalid`
        : `${origin}${ROUTES.signIn}?error=link_invalid`,
    );

  const supabase = await createSupabaseServerClient();
  let userId: string | null = null;

  if (tokenHash && type && ALLOWED_TYPES.has(type)) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      console.error("[auth] verifyOtp failed", error.code ?? "unknown");
      return fail();
    }
    userId = data.user?.id ?? null;
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth] code exchange failed", error.code ?? "unknown");
      return fail();
    }
    userId = data.user?.id ?? null;
  } else {
    return fail();
  }

  if (!userId) return fail();
  if (isRecovery) await markRecovery(userId);

  return NextResponse.redirect(`${origin}${isRecovery ? ROUTES.resetPassword : next}`);
}
