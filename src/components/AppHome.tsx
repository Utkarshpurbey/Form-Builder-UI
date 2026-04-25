import type { ReactNode } from "react";

type AppView =
  | "home"
  | "pageDef"
  | "pageDefBuilder"
  | "templates"
  | "reference";

interface AppHomeProps {
  onNavigate: (view: Exclude<AppView, "home">) => void;
}

function IconCode({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22 12l-4.75 5.25M6.75 17.25 2 12l4.75-5.25" />
    </svg>
  );
}

function IconLayout({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M9.75 9.75V20.25" />
    </svg>
  );
}

function IconSpark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  );
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6.75 3.75c-1.052 0-2.062.18-3 .512v15.128A9.257 9.257 0 0 1 6.75 18c1.719 0 3.348.415 4.5 1.08M12 6.042A8.967 8.967 0 0 1 17.25 3.75c1.052 0 2.062.18 3 .512v15.128a9.257 9.257 0 0 0-3-.512c-1.719 0-3.348.415-4.5 1.08M12 6.042v15.128" />
    </svg>
  );
}

const productCards: {
  title: string;
  description: string;
  view: Exclude<AppView, "home">;
  cta: string;
  icon: ReactNode;
}[] = [
  {
    title: "Live form preview",
    description:
      "Preview the exact end-user experience, test validations, and confirm submissions before sharing with customers or teams.",
    view: "pageDef",
    cta: "Open live preview",
    icon: <IconCode className="size-6" />,
  },
  {
    title: "Visual builder",
    description:
      "Build forms visually with full control over labels, validation, and behavior. No coding required for day-to-day product teams.",
    view: "pageDefBuilder",
    cta: "Start building",
    icon: <IconLayout className="size-6" />,
  },
  {
    title: "Templates",
    description:
      "Job applications, support intakes, lead capture—start from production-shaped examples and adapt in minutes, not days.",
    view: "templates",
    cta: "Browse library",
    icon: <IconSpark className="size-6" />,
  },
  {
    title: "Component reference",
    description:
      "Props, types, and live demos for every control—so your team ships consistent forms without guesswork.",
    view: "reference",
    cta: "View docs",
    icon: <IconBook className="size-6" />,
  },
];

const pillars = [
  {
    title: "Business-friendly",
    body: "Designed for operators, founders, and product teams to ship forms quickly without waiting on engineering for every update.",
  },
  {
    title: "Fully customizable",
    body: "Customize field behavior, validation rules, layout patterns, and templates so every workflow matches your brand.",
  },
  {
    title: "Built to extend",
    body: "Scale from startup speed to enterprise complexity while keeping the form experience simple for end users.",
  },
];

export function AppHome({ onNavigate }: AppHomeProps) {
  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,rgba(99,102,241,0.35),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:pb-28 sm:pt-16 lg:pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Full-customizable forms for modern teams
          </div>
          <h1 className="mt-8 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Build the form platform that helps you{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-white to-cyan-200 bg-clip-text text-transparent">
              move beyond basic form tools
            </span>{" "}
            with confidence.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Launch high-converting, fully customizable forms in minutes. Built for serious product teams that need more
            than basic survey tools.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onNavigate("pageDefBuilder")}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-500/25 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start in visual builder
            </button>
            <button
              type="button"
              onClick={() => onNavigate("templates")}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Explore templates
            </button>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
            {[
              ["Rich", "Field types & validation"],
              ["Custom", "Brand and workflow control"],
              ["Reliable", "Built for business use"],
              ["Live", "What you preview is what users get"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{k}</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Designed for teams shipping
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {["Product", "People Ops", "Customer success", "RevOps", "Clinical intake", "Internal tools"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600"
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why teams pick this workflow</h2>
            <p className="mt-4 text-slate-600">
              Move beyond basic form tools and ship branded, conversion-focused form experiences your company can rely on.
            </p>
          </div>
          <ul className="mt-14 grid gap-8 sm:grid-cols-3">
            {pillars.map((p) => (
              <li
                key={p.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm ring-1 ring-slate-900/5"
              >
                <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Product surface */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Everything in one workspace</h2>
              <p className="mt-2 max-w-xl text-slate-600">
                Build, preview, and launch from one place. Advanced teams can still use schema editing when needed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("pageDef")}
              className="shrink-0 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 sm:self-auto"
            >
              Try live preview
            </button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {productCards.map((card) => (
              <article
                key={card.view}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-8 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                  {card.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{card.description}</p>
                <button
                  type="button"
                  onClick={() => onNavigate(card.view)}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition group-hover:gap-2"
                >
                  {card.cta}
                  <span aria-hidden>→</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">From idea to working form</h2>
          <ol className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-3">
            {[
              { step: "01", title: "Design", desc: "Start from templates or build forms visually." },
              { step: "02", title: "Preview", desc: "Test validations, labels, and user flow before launch." },
              { step: "03", title: "Launch", desc: "Ship forms that look professional and support real business workflows." },
            ].map((item) => (
              <li key={item.step} className="relative text-center sm:text-left">
                <span className="text-5xl font-black tabular-nums text-indigo-100">{item.step}</span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-indigo-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <blockquote className="text-xl font-medium leading-relaxed text-indigo-100 sm:text-2xl">
            "We upgraded from basic forms to a branded, customizable workflow the whole company can use."
          </blockquote>
          <footer className="mt-6 text-sm font-medium text-indigo-300">
            — Product & engineering teams shipping internal tools
          </footer>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Ready to upgrade your team’s form experience?</h2>
            <p className="mt-2 text-slate-600">Start visually today and keep advanced controls available as your company grows.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate("pageDefBuilder")}
              className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
            >
              Open visual builder
            </button>
            <button
              type="button"
              onClick={() => onNavigate("pageDef")}
              className="h-11 rounded-xl border border-slate-200 px-6 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Live preview
            </button>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-lg px-4 text-center text-xs text-slate-500">
          Tip: templates open instantly and can be fully customized in the builder. Press{" "}
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">
            Esc
          </kbd>{" "}
          to close the preview modal.
        </p>
      </section>
    </div>
  );
}
