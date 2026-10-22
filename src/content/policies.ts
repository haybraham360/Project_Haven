/**
 * Plain-language policy summaries shown during onboarding and in Settings.
 *
 * DRAFT: this text has NOT been reviewed by legal, privacy, clinical or
 * safeguarding advisers. It must be replaced with reviewed text, and a new
 * version published in public.policy_versions, before any real launch.
 */

export type PolicyDoc = {
  type: "terms_of_service" | "privacy_notice";
  title: string;
  version: string;
  isDraft: boolean;
  points: string[];
};

export const POLICIES: Record<string, PolicyDoc> = {
  "terms_of_service@0.1-draft": {
    type: "terms_of_service",
    title: "Terms of service",
    version: "0.1-draft",
    isDraft: true,
    points: [
      "Haven is a free support platform in development. During this preview it is for adults aged 18 and over.",
      "Haven is not an emergency or crisis service. If you are in immediate danger, contact your local emergency number.",
      "Haven does not diagnose, treat, or prescribe. Information here does not replace care from a qualified professional.",
      "Volunteer professional sessions and peer support are planned but not available yet. We will never present a feature as available when it is not.",
      "Please treat others with respect. We may restrict accounts that put others at risk.",
      "You can stop using Haven and request deletion of your account at any time.",
    ],
  },
  "privacy_notice@0.1-draft": {
    type: "privacy_notice",
    title: "Privacy notice",
    version: "0.1-draft",
    isDraft: true,
    points: [
      "We collect only what we need: your email, an optional display name, and optional country, language and support preferences.",
      "We do not ask for your date of birth, diagnoses, medication, or mental-health history during sign-up.",
      "Your preferences are not a diagnosis or assessment, and only you can see them.",
      "We never sell personal data or use it for advertising.",
      "We record which version of these terms you acknowledged and when, so we can show what you agreed to.",
      "You can update your details in Settings and request deletion of your account. Some records may be kept for a limited time where the law requires it.",
    ],
  },
};

export function policyFor(type: string, version: string): PolicyDoc | null {
  return POLICIES[`${type}@${version}`] ?? null;
}
