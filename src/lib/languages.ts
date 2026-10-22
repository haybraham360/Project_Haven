/**
 * Languages a member can record as a preference. The interface itself is
 * English-only for now; translations need review before launch (spec §9).
 */
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "de", name: "Deutsch (German)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "it", name: "Italiano (Italian)" },
  { code: "ja", name: "日本語 (Japanese)" },
  { code: "ko", name: "한국어 (Korean)" },
  { code: "nl", name: "Nederlands (Dutch)" },
  { code: "pl", name: "Polski (Polish)" },
  { code: "pt", name: "Português (Portuguese)" },
  { code: "ru", name: "Русский (Russian)" },
  { code: "sw", name: "Kiswahili (Swahili)" },
  { code: "tr", name: "Türkçe (Turkish)" },
  { code: "uk", name: "Українська (Ukrainian)" },
  { code: "vi", name: "Tiếng Việt (Vietnamese)" },
  { code: "yo", name: "Yorùbá (Yoruba)" },
  { code: "zh", name: "中文 (Chinese)" },
] as const;

export function languageName(code: string | null | undefined): string | null {
  if (!code) return null;
  return LANGUAGES.find((l) => l.code === code)?.name ?? null;
}
