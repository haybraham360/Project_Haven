import type { ReactNode } from "react";

/** Inline status message shown above auth forms (e.g. after a redirect). */
export function Notice({ tone = "info", children }: { tone?: "info" | "error"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`mb-5 rounded-2xl px-4 py-3 text-sm leading-relaxed ring-1 ${
        tone === "error" ? "bg-haven-coral-soft/25 ring-haven-coral/30" : "bg-mood-blue/25 ring-mood-blue"
      }`}
    >
      {children}
    </div>
  );
}
