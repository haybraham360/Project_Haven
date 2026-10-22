/** Shared class strings so every Haven screen uses the same visual language. */

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-haven-violet/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100";

export const primaryButton = `inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-haven-purple to-haven-coral px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-haven-purple/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const secondaryButton = `inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white/60 px-7 py-3 text-base font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const textLink = `rounded font-semibold text-haven-purple underline underline-offset-4 hover:text-ink ${focusRing}`;

export const card = "rounded-[28px] bg-white/90 shadow-[0_20px_50px_-20px_rgba(120,80,40,0.25)] ring-1 ring-black/5";

export const inputBase = `w-full rounded-2xl border-2 border-cream-200 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 transition focus:border-haven-violet focus:outline-none focus:ring-4 focus:ring-haven-violet/20 aria-[invalid=true]:border-haven-coral`;
