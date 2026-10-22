import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { readPublicEnv } from "@/lib/env";
import { ROUTES, isProtectedPath } from "@/lib/auth/redirects";

/**
 * Refreshes the Supabase session cookie on each navigation and makes an
 * optimistic redirect for signed-out visitors on protected paths.
 *
 * This is NOT the authorization boundary: every protected page and server
 * action re-checks the user via the data access layer (src/lib/auth/dal.ts).
 */
export async function proxy(request: NextRequest) {
  const env = readPublicEnv();
  // Without configuration, let pages render their own configuration error.
  if (!env) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // Validates the JWT and refreshes it when needed. Do not add code between
  // client creation and this call.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  const { pathname, search } = request.nextUrl;
  if (!signedIn && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.signIn;
    url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    const redirect = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  return response;
}

export const config = {
  // Only auth-related routes need the session; the public landing page and
  // static assets are left untouched.
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/not-eligible",
    "/reset-password",
    "/sign-in",
    "/sign-up",
    "/verify-email",
    "/forgot-password",
    "/auth/:path*",
  ],
};
