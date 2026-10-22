import { describe, expect, it } from "vitest";
import {
  ageSchema,
  fieldErrors,
  preferencesSchema,
  profileSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation";

describe("signUpSchema", () => {
  const valid = { email: "  Synthetic.User@Example.test ", password: "calm river 42", confirmPassword: "calm river 42" };

  it("normalises email and accepts a strong password", () => {
    const r = signUpSchema.safeParse(valid);
    expect(r.success).toBe(true);
    expect(r.data?.email).toBe("synthetic.user@example.test");
  });

  it.each([
    [{ ...valid, email: "not-an-email" }, "email"],
    [{ ...valid, password: "short1", confirmPassword: "short1" }, "password"],
    [{ ...valid, password: "onlylettersherex", confirmPassword: "onlylettersherex" }, "password"],
    [{ ...valid, password: "x1".repeat(40), confirmPassword: "x1".repeat(40) }, "password"],
    [{ ...valid, confirmPassword: "different 123" }, "confirmPassword"],
  ])("rejects invalid input on %#", (input, field) => {
    const r = signUpSchema.safeParse(input);
    expect(r.success).toBe(false);
    expect(Object.keys(fieldErrors(r.error!))).toContain(field);
  });
});

describe("signInSchema", () => {
  it("requires a password", () => {
    expect(signInSchema.safeParse({ email: "a@example.test", password: "" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires matching passwords", () => {
    expect(resetPasswordSchema.safeParse({ password: "new phrase 77", confirmPassword: "new phrase 77" }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ password: "new phrase 77", confirmPassword: "new phrase 78" }).success).toBe(false);
  });
});

describe("ageSchema", () => {
  it("accepts only yes or no", () => {
    expect(ageSchema.safeParse({ isAdult: "yes" }).success).toBe(true);
    expect(ageSchema.safeParse({ isAdult: "no" }).success).toBe(true);
    expect(ageSchema.safeParse({ isAdult: "true" }).success).toBe(false);
    expect(ageSchema.safeParse({ isAdult: null }).success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("treats empty optional fields as null", () => {
    const r = profileSchema.safeParse({ displayName: "  ", countryCode: "", preferredLanguage: "" });
    expect(r.data).toEqual({ displayName: null, countryCode: null, preferredLanguage: null });
  });

  it("accepts listed values", () => {
    const r = profileSchema.safeParse({ displayName: "Sam O'Neil", countryCode: "GB", preferredLanguage: "es" });
    expect(r.success).toBe(true);
  });

  it.each([
    { displayName: "x".repeat(41), countryCode: "", preferredLanguage: "" },
    { displayName: "<script>", countryCode: "", preferredLanguage: "" },
    { displayName: "", countryCode: "ZZ", preferredLanguage: "" },
    { displayName: "", countryCode: "gb", preferredLanguage: "" },
    { displayName: "", countryCode: "", preferredLanguage: "klingon" },
  ])("rejects %j", (input) => {
    expect(profileSchema.safeParse(input).success).toBe(false);
  });
});

describe("preferencesSchema", () => {
  it("allows skipping (empty) and de-duplicates", () => {
    expect(preferencesSchema.parse({ interests: [] }).interests).toEqual([]);
    expect(preferencesSchema.parse({ interests: ["peer", "peer", "learning"] }).interests).toEqual(["peer", "learning"]);
  });

  it("rejects unknown values, including clinical labels", () => {
    expect(preferencesSchema.safeParse({ interests: ["depression"] }).success).toBe(false);
  });
});
