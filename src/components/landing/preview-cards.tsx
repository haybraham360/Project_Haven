import { MoodFace } from "@/components/mood-face";

/*
 * Marketing previews of member features. Everything here is synthetic
 * example data (spec rule 19) and is labelled as such on screen.
 */

function ExampleBadge({ children = "Example" }: { children?: string }) {
  return (
    <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
      {children}
    </span>
  );
}

const cardBase =
  "rounded-[28px] bg-white/90 p-5 shadow-[0_20px_50px_-20px_rgba(120,80,40,0.25)] ring-1 ring-black/5 backdrop-blur";

const WEEK = [
  { day: "Sat", mood: "Okay", height: "h-16", color: "bg-mood-yellow/80" },
  { day: "Sun", mood: "Low energy", height: "h-9", color: "bg-mood-gold/80" },
  { day: "Mon", mood: "Hopeful", height: "h-16", color: "bg-mood-green" },
  { day: "Tue", mood: "Calm", height: "h-24", color: "bg-mood-blue", active: true },
  { day: "Wed", mood: "Content", height: "h-[72px]", color: "bg-mood-orange" },
  { day: "Thu", mood: "Okay", height: "h-12", color: "bg-mood-yellow/80" },
];

export function MoodTrendsCard({ className = "" }: { className?: string }) {
  return (
    <figure className={`${cardBase} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <figcaption className="text-lg font-bold">Your check-ins</figcaption>
          <p className="text-sm text-ink-muted">Notice patterns, at your own pace.</p>
        </div>
        <ExampleBadge />
      </div>
      <div
        className="mt-10 flex items-end justify-between gap-2"
        role="img"
        aria-label="Example chart of six days of optional check-ins. Tuesday is highlighted as calm."
      >
        {WEEK.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-28 w-full items-end">
              {d.active && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white">
                  {d.mood}
                </span>
              )}
              <div className={`w-full rounded-xl ${d.height} ${d.color}`} />
            </div>
            <span className="text-xs text-ink-muted">{d.day}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

const MOODS = [
  { label: "Happy", shape: "star", expression: "happy" },
  { label: "Okay", shape: "circle", expression: "neutral" },
  { label: "Low", shape: "blob", expression: "sad" },
  { label: "Calm", shape: "square", expression: "calm" },
] as const;

export function MoodLogCard({ className = "" }: { className?: string }) {
  return (
    <div className={`${cardBase} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-bold">Daily check-in</p>
        <ExampleBadge>Optional</ExampleBadge>
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-2">
        {MOODS.map((m) => (
          <li key={m.label} className="flex flex-col items-center gap-2">
            <MoodFace shape={m.shape} expression={m.expression} className="size-12 sm:size-14" />
            <span className="text-sm font-medium">{m.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink-muted">Skip anything. Nothing here is a diagnosis.</p>
    </div>
  );
}

export function RemindersCard({ className = "" }: { className?: string }) {
  return (
    <div className={`${cardBase} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-bold">Gentle reminders</p>
        <ExampleBadge />
      </div>
      <ul className="mt-4 space-y-4">
        <li className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mood-yellow" aria-hidden="true">
            <MoodFace shape="star" expression="happy" className="size-9" />
          </span>
          <div>
            <p className="font-semibold">Session reminder</p>
            <p className="text-sm text-ink-muted">Thursday · 6:00 PM your time</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mood-blue" aria-hidden="true">
            <MoodFace shape="square" expression="calm" className="size-9" />
          </span>
          <div>
            <p className="font-semibold">Breathing exercise</p>
            <p className="text-sm text-ink-muted">5 minutes · whenever you like</p>
          </div>
        </li>
      </ul>
      <p className="mt-4 text-xs text-ink-muted">Wellbeing reminders are off unless you turn them on.</p>
    </div>
  );
}

export function DemoProviderCard({ className = "" }: { className?: string }) {
  return (
    <div className={`${cardBase} ${className}`}>
      <div className="flex items-center gap-4">
        <span
          className="grid size-14 shrink-0 place-items-center rounded-full bg-linear-to-br from-haven-violet to-haven-coral-soft text-lg font-bold text-white"
          aria-hidden="true"
        >
          AR
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold">Alex Rivera</p>
            <ExampleBadge>Demo profile</ExampleBadge>
          </div>
          <p className="text-sm text-ink-muted">Volunteer counsellor · English, Spanish</p>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-sm">
        <span className="font-semibold">Next free session:</span> shown only when a
        volunteer has genuinely opened a slot.
      </p>
      <p className="mt-3 text-xs text-ink-muted">
        Not a real provider. Verified profiles will clearly show credentials and service areas.
      </p>
    </div>
  );
}
