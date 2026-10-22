import Link from "next/link";
import { MoodFace } from "@/components/mood-face";
import { SafetyBar } from "@/components/safety-bar";
import { focusRing } from "@/components/ui";
import { HeroIllustration } from "@/components/landing/hero-illustration";
import {
  DemoProviderCard,
  MoodLogCard,
  MoodTrendsCard,
  RemindersCard,
} from "@/components/landing/preview-cards";

const NAV = [
  { href: "#support", label: "Support" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#volunteer", label: "Volunteer" },
];

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <SafetyBar />
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <SupportTypes />
        <HowItWorks />
        <Commitments />
        <Volunteer />
        <Safety />
      </main>

      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <a href="#main" className={`flex items-center gap-2 rounded-full text-lg font-extrabold ${focusRing}`}>
        <MoodFace shape="star" expression="happy" className="size-8" />
        Haven
      </a>
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-8 text-sm font-medium text-ink-muted">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={`rounded hover:text-ink ${focusRing}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/sign-in" className={`rounded text-sm font-semibold hover:text-haven-purple ${focusRing}`}>
          Sign in
        </Link>
        <a
          href="#safety"
          className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition hover:bg-ink hover:text-white ${focusRing}`}
        >
          Safety info
        </a>
      </div>
    </header>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
      <div className="absolute inset-x-0 top-0 h-180 bg-linear-to-b from-cream-50 via-cream-100 to-cream-100" />
      <MoodFace shape="star" expression="calm" className="absolute left-[6%] top-10 size-20 opacity-25 motion-safe:animate-float-slow" />
      <svg viewBox="0 0 100 100" className="absolute left-[14%] top-75 size-24 opacity-40">
        <path
          d="M50 0l9 27 27-12-12 27 26 8-26 8 12 27-27-12-9 27-9-27-27 12 12-27-26-8 26-8-12-27 27 12z"
          fill="#f1dc8a"
        />
      </svg>
      <svg viewBox="0 0 100 100" className="absolute right-[8%] top-37.5 size-24 opacity-45 motion-safe:animate-float-slow">
        <path
          d="M50 0l9 27 27-12-12 27 26 8-26 8 12 27-27-12-9 27-9-27-27 12 12-27-26-8 26-8-12-27 27 12z"
          fill="#f1dc8a"
        />
      </svg>
      <div className="absolute left-[4%] top-80 h-16 w-12 rounded-full bg-mood-green/40" />
      <div className="absolute right-[18%] top-75 h-16 w-12 rounded-full bg-mood-green/35" />
    </div>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative pb-20">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl px-4 pt-6 text-center sm:px-6 lg:px-8 lg:pt-10">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium shadow-sm ring-1 ring-black/5">
          <span className="size-2 rounded-full bg-mood-green" aria-hidden="true" />
          Free to use · Adult pilot in development
        </p>

        <h1
          id="hero-title"
          className="mx-auto mt-8 max-w-5xl text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.25rem]"
        >
          A Safe Place to <span className="text-haven-gradient">Talk</span>
          <MoodFace
            shape="star"
            expression="happy"
            className="mx-2 inline-block size-[0.85em] translate-y-[-0.08em] align-middle"
          />
          Find
          <MoodFace
            shape="square"
            expression="calm"
            className="mx-2 inline-block size-[0.8em] translate-y-[-0.05em] align-middle"
          />
          Support
          <MoodFace
            shape="blob"
            expression="sad"
            className="mx-2 inline-block size-[0.8em] translate-y-[-0.05em] align-middle"
          />
          <span className="text-haven-gradient">&amp; Breathe</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
          Free sessions with verified volunteer professionals, moderated peer support,
          and practical self-help. Take your next step, without having to pay for the
          basics.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#how-it-works"
            className={`w-full rounded-full bg-linear-to-r from-haven-purple to-haven-coral px-8 py-4 text-base font-semibold text-white shadow-lg shadow-haven-purple/25 transition hover:brightness-110 sm:w-auto ${focusRing}`}
          >
            See how Haven works
          </a>
          <a
            href="#support"
            className={`w-full rounded-full border-2 border-ink bg-white/60 px-8 py-3.5 text-base font-semibold transition hover:bg-white sm:w-auto ${focusRing}`}
          >
            Explore support options
          </a>
        </div>
      </div>

      {/* Preview cards orbit the illustration on large screens and stack on small ones. */}
      <div className="relative mx-auto mt-16 grid max-w-7xl gap-6 px-4 sm:px-6 lg:mt-8 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-center lg:gap-8 lg:px-8">
        <div className="order-2 space-y-6 lg:order-1 lg:pt-10">
          <MoodTrendsCard className="lg:-rotate-2" />
          <DemoProviderCard className="lg:rotate-1" />
        </div>
        <HeroIllustration className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none" />
        <div className="order-3 space-y-6 lg:pt-2">
          <MoodLogCard className="lg:rotate-2" />
          <RemindersCard className="lg:-rotate-1" />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ id, eyebrow, title, intro }: { id: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-haven-purple">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-muted">{intro}</p>}
    </div>
  );
}

const SUPPORT = [
  {
    title: "Volunteer professionals",
    face: { shape: "square", expression: "calm" },
    tint: "bg-mood-blue/35",
    body: "Qualified professionals donate a limited number of free sessions. Every profile shows credentials, languages, and where they can practise.",
    note: "Availability depends on volunteer capacity. We show it honestly.",
  },
  {
    title: "Moderated peer support",
    face: { shape: "blob", expression: "happy" },
    tint: "bg-mood-green/35",
    body: "Topic-based groups with trained, non-clinical listeners. You choose a display name, and you can report, block, or leave at any time.",
    note: "Peer support is empathy and signposting, not clinical care.",
  },
  {
    title: "Practical self-help",
    face: { shape: "star", expression: "happy" },
    tint: "bg-mood-yellow/45",
    body: "Optional daily check-ins, private reflections, and reviewed resources built around small, manageable steps. No streaks, no scores.",
    note: "Your check-ins are visible only to you.",
  },
] as const;

function SupportTypes() {
  return (
    <section id="support" aria-labelledby="support-title" className="scroll-mt-8 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="support-title"
          eyebrow="Three kinds of support"
          title="Human connection first, clearly labelled"
          intro="Different kinds of help suit different moments. We always tell you which one you are using."
        />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {SUPPORT.map((s) => (
            <li key={s.title} className={`flex flex-col rounded-[28px] p-7 ${s.tint}`}>
              <MoodFace shape={s.face.shape} expression={s.face.expression} className="size-14" />
              <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{s.body}</p>
              <p className="mt-auto pt-6 text-sm font-semibold">{s.note}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl rounded-2xl bg-cream-100 px-6 py-4 text-center text-sm text-ink-muted">
          <span className="font-semibold text-ink">About AI:</span> Haven does not use AI to
          support members. If optional AI tools are ever added, they will be clearly labelled
          and never replace people.
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  { title: "Create a private account", body: "We ask only for what we need, like your country and language, so we can show support you can actually use." },
  { title: "Check in, if you want to", body: "Note how you feel, or skip it entirely. Everything optional stays optional." },
  { title: "Choose your next step", body: "Read a resource, join a moderated group, or book a free session when a volunteer has time available." },
  { title: "Stay in control", body: "Edit or delete your entries, manage your consent, and close your account whenever you choose." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-8 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="how-title" eyebrow="How it works" title="Small steps, at your pace" />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-black/5">
              <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-haven-purple to-haven-coral font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const COMMITMENTS = [
  "Essential member features are free.",
  "We never sell personal data or use it for advertising.",
  "Your private reflections stay private.",
  "We are honest about wait times and availability.",
  "No streaks, guilt, or pressure to come back.",
  "Haven does not diagnose or prescribe.",
];

function Commitments() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="scroll-mt-8 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[36px] bg-ink px-6 py-14 text-white sm:px-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-mood-yellow">Our commitments</p>
            <h2 id="privacy-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Privacy by default. Honesty always.
            </h2>
            <p className="mt-5 leading-relaxed text-white/75">
              We collect as little as we can, keep your private information separate, and
              explain clearly what we can and cannot offer.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {COMMITMENTS.map((c) => (
              <li key={c} className="flex gap-3 rounded-2xl bg-white/8 p-4 text-sm leading-relaxed ring-1 ring-white/10">
                <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-mood-green" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Volunteer() {
  return (
    <section id="volunteer" aria-labelledby="volunteer-title" className="scroll-mt-8 pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-haven-purple">For professionals</p>
          <h2 id="volunteer-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Give an hour. Help someone take their next step.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-muted">
            Qualified professionals can volunteer a limited amount of time for free sessions,
            within their permitted scope and service areas. Every applicant goes through
            verification before appearing in the directory, and you can pause at any time.
          </p>
        </div>
        <div className="rounded-[28px] bg-mood-blue/30 p-7">
          <p className="font-bold">Volunteer applications</p>
          <p className="mt-2 text-ink-muted">
            Applications will open ahead of the adult pilot. Launch locations have not been
            confirmed yet.
          </p>
        </div>
      </div>
    </section>
  );
}

function Safety() {
  return (
    <section id="safety" aria-labelledby="safety-title" className="scroll-mt-8 bg-white py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <MoodFace shape="circle" expression="calm" className="mx-auto size-14" />
        <h2 id="safety-title" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          If you need help right now
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          Haven is not an emergency or crisis service, and our team does not monitor
          activity around the clock. If you or someone else is in immediate danger, contact
          your local emergency number or go to the nearest emergency department. Reaching
          out to someone you trust can also help.
        </p>
        {/* TODO(launch): replace with reviewed, location-specific crisis resources once launch jurisdictions are chosen (spec §16). */}
        <p className="mt-6 rounded-2xl bg-cream-100 px-6 py-4 text-sm text-ink-muted">
          Crisis lines for your location will be listed here before launch.
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-cream-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          <span className="font-semibold text-ink">Project Haven</span> (working name). Preview
          build: all profiles and data shown are examples.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={`rounded hover:text-ink ${focusRing}`}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#safety" className={`rounded hover:text-ink ${focusRing}`}>
                Safety
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
