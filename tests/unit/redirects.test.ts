import { describe, expect, it } from "vitest";
import { homeFor, isProtectedPath, redirectFor, safeNextPath, type Area, type Viewer } from "@/lib/auth/redirects";

const signedOut: Viewer = { signedIn: false };
const fresh: Viewer = { signedIn: true, ageEligibility: "unknown", onboardingStatus: "not_started" };
const midway: Viewer = { signedIn: true, ageEligibility: "eligible", onboardingStatus: "in_progress" };
const done: Viewer = { signedIn: true, ageEligibility: "eligible", onboardingStatus: "completed" };
const minor: Viewer = { signedIn: true, ageEligibility: "ineligible", onboardingStatus: "in_progress" };

describe("safeNextPath", () => {
  it("keeps same-origin relative paths", () => {
    expect(safeNextPath("/settings")).toBe("/settings");
    expect(safeNextPath("/onboarding/profile?x=1#y")).toBe("/onboarding/profile?x=1#y");
  });

  it.each([
    "https://evil.example/phish",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "settings",
    "/a\\b",
    "/ok\nSet-Cookie: x",
    "",
    "/" + "a".repeat(600),
  ])("rejects unsafe value %j", (value) => {
    expect(safeNextPath(value, "/dashboard")).toBe("/dashboard");
  });

  it("rejects non-strings", () => {
    expect(safeNextPath(null)).toBe("/dashboard");
    expect(safeNextPath(42, "/x")).toBe("/x");
  });
});

describe("isProtectedPath", () => {
  it("matches protected routes and their children only", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/onboarding/age")).toBe(true);
    expect(isProtectedPath("/settings")).toBe(true);
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/sign-in")).toBe(false);
    expect(isProtectedPath("/dashboarding")).toBe(false);
  });
});

describe("redirectFor", () => {
  it("sends signed-out visitors to sign-in with a safe next path", () => {
    expect(redirectFor(signedOut, "member", "/settings")).toBe("/sign-in?next=%2Fsettings");
    expect(redirectFor(signedOut, "onboarding")).toBe("/sign-in");
    expect(redirectFor(signedOut, "member", "https://evil.example")).toBe("/sign-in?next=%2Fdashboard");
    expect(redirectFor(signedOut, "guest")).toBeNull();
  });

  it("keeps users who have not finished onboarding out of member pages", () => {
    expect(redirectFor(fresh, "member")).toBe("/onboarding");
    expect(redirectFor(midway, "member")).toBe("/onboarding");
    expect(redirectFor(midway, "onboarding")).toBeNull();
    expect(redirectFor(midway, "onboarding-complete")).toBe("/onboarding");
  });

  it("lets onboarded members in and keeps them out of onboarding", () => {
    expect(redirectFor(done, "member")).toBeNull();
    expect(redirectFor(done, "onboarding")).toBe("/dashboard");
    expect(redirectFor(done, "onboarding-complete")).toBeNull();
    expect(redirectFor(done, "not-eligible")).toBe("/dashboard");
  });

  it("blocks ineligible users from every adult-pilot area", () => {
    expect(redirectFor(minor, "member")).toBe("/not-eligible");
    expect(redirectFor(minor, "onboarding")).toBe("/not-eligible");
    expect(redirectFor(minor, "onboarding-complete")).toBe("/not-eligible");
    expect(redirectFor(minor, "not-eligible")).toBeNull();
    // Even a (tampered) "completed" status does not unlock the dashboard.
    expect(redirectFor({ ...minor, onboardingStatus: "completed" }, "member")).toBe("/not-eligible");
  });

  it("sends signed-in users away from guest pages", () => {
    expect(redirectFor(fresh, "guest")).toBe("/onboarding");
    expect(redirectFor(done, "guest")).toBe("/dashboard");
    expect(redirectFor(minor, "guest")).toBe("/not-eligible");
  });

  it("never redirects a viewer to a page that redirects them again (no loops)", () => {
    const areaOf: Record<string, Area> = {
      "/onboarding": "onboarding",
      "/dashboard": "member",
      "/not-eligible": "not-eligible",
    };
    for (const viewer of [fresh, midway, done, minor]) {
      for (const area of ["guest", "onboarding", "onboarding-complete", "member", "not-eligible"] as Area[]) {
        const target = redirectFor(viewer, area);
        if (target) expect(redirectFor(viewer, areaOf[target])).toBeNull();
      }
      if (viewer.signedIn) expect(redirectFor(viewer, areaOf[homeFor(viewer)])).toBeNull();
    }
  });
});
