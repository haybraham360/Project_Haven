/**
 * Public configuration. These values are safe to expose to the browser; the
 * publishable key only grants what Row Level Security allows. No privileged
 * (secret / service-role) key is used by the application.
 */

export type PublicEnv = {
  supabaseUrl: string;
  supabasePublishableKey: string;
  appUrl: string;
};

export class MissingEnvError extends Error {
  constructor(names: string[]) {
    super(`Missing environment variables: ${names.join(", ")}. See .env.example and docs/phase-1-auth.md.`);
    this.name = "MissingEnvError";
  }
}

export function readPublicEnv(): PublicEnv | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!supabaseUrl || !supabasePublishableKey || !appUrl) return null;
  return { supabaseUrl, supabasePublishableKey, appUrl: appUrl.replace(/\/+$/, "") };
}

export function publicEnv(): PublicEnv {
  const env = readPublicEnv();
  if (!env) {
    const missing = [
      ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
      ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY],
      ["NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL],
    ]
      .filter(([, v]) => !v)
      .map(([k]) => k as string);
    throw new MissingEnvError(missing);
  }
  return env;
}
