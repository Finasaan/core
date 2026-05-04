import Link from "next/link";
import { ArrowRight, EyeOff, Lock, ShieldCheck } from "lucide-react";

const pillars = [
  {
    icon: Lock,
    title: "End-to-end encryption",
    description: "Your conversations and onboarding data are encrypted in transit and at rest.",
  },
  {
    icon: EyeOff,
    title: "Never sold, ever",
    description: "We don't sell or share your data with advertisers, brokers, or third parties.",
  },
  {
    icon: ShieldCheck,
    title: "Pakistan-aware",
    description: "Built around SECP and SBP guidelines — with local context, not generic advice.",
  },
];

const SecuritySection = () => {
  return (
    <section id="security" className="w-full bg-white px-6 py-28 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#159F63]" />
            Security
          </span>
          <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.5rem]">
            Your money. Your data.
            <br />
            Your trust.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-600">
            Finasaan is built with privacy at the core. We treat your financial
            context with the same care you do — locked down, local-first, and
            never up for sale.
          </p>

          <div className="mt-10 flex flex-col divide-y divide-zinc-100 rounded-2xl ring-1 ring-zinc-100">
            {pillars.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4 px-5 py-5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#159F63]/10 text-[#159F63]">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/signup"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 transition-colors hover:text-[#159F63]"
          >
            Learn how we protect you
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Right — code-built shield visual */}
        <div className="relative flex justify-center lg:col-span-6">
          <div className="relative aspect-square w-full max-w-md">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-30 blur-3xl"
              style={{ background: "#159F63" }}
            />
            <svg
              viewBox="0 0 400 400"
              className="h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="shieldFill" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#159F63" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#159F63" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="shieldStroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#159F63" />
                  <stop offset="100%" stopColor="#0A6C41" />
                </linearGradient>
              </defs>

              {/* Concentric rings */}
              {[180, 145, 110].map((r, i) => (
                <circle
                  key={r}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke="#159F63"
                  strokeOpacity={0.08 + i * 0.04}
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              ))}

              {/* Shield body */}
              <path
                d="M200 80 L290 110 L290 210 C290 270 250 310 200 330 C150 310 110 270 110 210 L110 110 Z"
                fill="url(#shieldFill)"
                stroke="url(#shieldStroke)"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Lock glyph */}
              <rect
                x="172"
                y="190"
                width="56"
                height="44"
                rx="6"
                fill="#159F63"
              />
              <path
                d="M180 190 L180 175 C180 162 189 152 200 152 C211 152 220 162 220 175 L220 190"
                fill="none"
                stroke="#159F63"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="200" cy="210" r="4" fill="white" />
              <rect x="198" y="210" width="4" height="10" rx="1" fill="white" />
            </svg>

            {/* Floating chips */}
            <span className="absolute left-2 top-10 hidden rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-md ring-1 ring-zinc-100 sm:inline-flex">
              <span className="mr-1.5 h-1.5 w-1.5 self-center rounded-full bg-[#159F63]" />
              AES-256
            </span>
            <span className="absolute right-2 top-24 hidden rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-md ring-1 ring-zinc-100 sm:inline-flex">
              No tracking
            </span>
            <span className="absolute bottom-12 left-6 hidden rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-md ring-1 ring-zinc-100 sm:inline-flex">
              SECP-aware
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
