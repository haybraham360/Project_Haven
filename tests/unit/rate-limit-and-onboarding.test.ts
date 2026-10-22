import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";
import { canVisitStep, maxVisitableStep, stepPath } from "@/lib/onboarding";

describe("createRateLimiter", () => {
  it("allows up to the limit, blocks, then resets after the window", () => {
    let t = 0;
    const check = createRateLimiter(() => t);
    const rule = { limit: 3, windowMs: 1000 };
    expect(check("k", rule).ok).toBe(true);
    expect(check("k", rule).ok).toBe(true);
    expect(check("k", rule).ok).toBe(true);
    const blocked = check("k", rule);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBe(1000);
    expect(check("other", rule).ok).toBe(true);
    t = 1000;
    expect(check("k", rule).ok).toBe(true);
  });
});

describe("onboarding navigation", () => {
  it("caps steps at the age gate until eligibility is confirmed", () => {
    expect(maxVisitableStep(1, "unknown")).toBe(1);
    expect(maxVisitableStep(2, "unknown")).toBe(2);
    expect(maxVisitableStep(5, "unknown")).toBe(2);
    expect(maxVisitableStep(3, "eligible")).toBe(3);
    expect(maxVisitableStep(6, "eligible")).toBe(5);
    expect(maxVisitableStep(5, "ineligible")).toBe(2);
  });

  it("allows going back but not skipping ahead", () => {
    expect(canVisitStep(1, 4, "eligible")).toBe(true);
    expect(canVisitStep(4, 4, "eligible")).toBe(true);
    expect(canVisitStep(5, 4, "eligible")).toBe(false);
    expect(canVisitStep(3, 3, "unknown")).toBe(false);
    expect(canVisitStep(0, 3, "eligible")).toBe(false);
  });

  it("maps steps to paths", () => {
    expect(stepPath(1)).toBe("/onboarding/welcome");
    expect(stepPath(5)).toBe("/onboarding/terms");
    expect(stepPath(6)).toBe("/onboarding/complete");
  });
});
