import { z } from "zod";
import { COUNTRY_CODES } from "@/lib/countries";
import { LANGUAGES } from "@/lib/languages";

/**
 * Server-side validation schemas. Client forms show the same rules as hints,
 * but these are the source of truth.
 */

export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 72; // bcrypt input limit used by Supabase Auth

export const emailSchema = z
  .string({ error: "Enter your email address." })
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address.")
  .max(254, "That email address is too long.")
  .pipe(z.email({ error: "Enter a valid email address, like name@example.com." }));

export const newPasswordSchema = z
  .string({ error: "Choose a password." })
  .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters.`)
  .max(PASSWORD_MAX, `Use ${PASSWORD_MAX} characters or fewer.`)
  .refine((v) => /[a-zA-Z]/.test(v) && /[^a-zA-Z]/.test(v), {
    message: "Include at least one letter and one number or symbol.",
  });

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords don't match.",
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password.").max(PASSWORD_MAX, "Email or password is incorrect."),
});

export const emailOnlySchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: newPasswordSchema, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords don't match.",
  });

export const ageSchema = z.object({
  isAdult: z.enum(["yes", "no"], { error: "Choose one option to continue." }),
});

const optionalText = (schema: z.ZodString) =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(schema.nullable());

export const profileSchema = z.object({
  displayName: optionalText(
    z
      .string()
      .max(40, "Use 40 characters or fewer.")
      .regex(/^[\p{L}\p{N} .'_-]+$/u, "Use letters, numbers, spaces, or . ' _ -"),
  ),
  countryCode: optionalText(
    z.string().refine((v) => (COUNTRY_CODES as readonly string[]).includes(v), "Choose a country from the list."),
  ),
  preferredLanguage: optionalText(
    z
      .string()
      .refine((v) => LANGUAGES.some((l) => l.code === v), "Choose a language from the list."),
  ),
});

export const SUPPORT_INTERESTS = [
  { value: "self_help", label: "Practical self-help resources" },
  { value: "professional", label: "Talking with a volunteer professional" },
  { value: "peer", label: "Moderated peer support" },
  { value: "learning", label: "Learning about mental wellbeing" },
] as const;

export type SupportInterest = (typeof SUPPORT_INTERESTS)[number]["value"];

export const preferencesSchema = z.object({
  interests: z
    .array(z.enum(SUPPORT_INTERESTS.map((i) => i.value) as [SupportInterest, ...SupportInterest[]]))
    .max(SUPPORT_INTERESTS.length)
    .transform((v) => Array.from(new Set(v))),
});

/** Field errors keyed by field name, first message only. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
