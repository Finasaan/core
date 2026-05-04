import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Topic = {
  tag: string;
  title: string;
  description: string;
  gradient: string;
  accent: string;
  imagery: ReactNode;
};

const InvestingImagery = () => (
  <svg
    viewBox="0 0 320 280"
    className="absolute -bottom-2 -right-4 h-[55%] w-[70%] opacity-[0.22] mix-blend-screen"
    preserveAspectRatio="xMaxYMax meet"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="investLine" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
        <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Faint horizontal grid */}
    {[60, 110, 160, 210].map((y) => (
      <line
        key={y}
        x1="20"
        y1={y}
        x2="300"
        y2={y}
        stroke="#22c55e"
        strokeOpacity="0.18"
        strokeDasharray="2 6"
      />
    ))}
    {/* Candlesticks */}
    {[
      { x: 40, hi: 200, lo: 100, oc: [180, 130], up: false },
      { x: 75, hi: 185, lo: 90, oc: [120, 165], up: true },
      { x: 110, hi: 170, lo: 70, oc: [140, 95], up: true },
      { x: 145, hi: 160, lo: 80, oc: [150, 110], up: false },
      { x: 180, hi: 130, lo: 60, oc: [80, 115], up: false },
      { x: 215, hi: 110, lo: 50, oc: [60, 95], up: true },
      { x: 250, hi: 90, lo: 40, oc: [50, 70], up: true },
    ].map((c) => {
      const top = Math.min(c.oc[0], c.oc[1]);
      const bodyHeight = Math.abs(c.oc[1] - c.oc[0]) || 4;
      const fill = c.up ? "#22c55e" : "#ef4444";
      return (
        <g key={c.x}>
          <line
            x1={c.x + 8}
            y1={c.hi}
            x2={c.x + 8}
            y2={c.lo}
            stroke={fill}
            strokeWidth="1.5"
          />
          <rect
            x={c.x}
            y={top}
            width="16"
            height={bodyHeight}
            fill={fill}
            rx="1.5"
          />
        </g>
      );
    })}
    {/* Trend line */}
    <path
      d="M40 165 L 75 145 L 110 120 L 145 130 L 180 95 L 215 75 L 250 55 L 285 35"
      fill="none"
      stroke="url(#investLine)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="285" cy="35" r="3.5" fill="#22c55e" />
    <circle cx="285" cy="35" r="8" fill="#22c55e" fillOpacity="0.25" />
  </svg>
);

const InsuranceImagery = () => (
  <svg
    viewBox="0 0 320 280"
    className="absolute -bottom-6 -right-6 h-[60%] w-[68%] opacity-[0.28] mix-blend-screen"
    preserveAspectRatio="xMaxYMax meet"
    aria-hidden="true"
  >
    {/* Concentric protection rings */}
    {[40, 70, 100, 130].map((r, i) => (
      <circle
        key={r}
        cx="220"
        cy="200"
        r={r}
        fill="none"
        stroke="#fbbf24"
        strokeOpacity={0.5 - i * 0.08}
        strokeWidth={i === 0 ? 1.5 : 1}
        strokeDasharray={i === 0 ? "0" : "3 5"}
      />
    ))}
    {/* Shield silhouette */}
    <path
      d="M220 130 L260 145 L260 195 C260 220 244 235 220 245 C196 235 180 220 180 195 L180 145 Z"
      fill="#fbbf24"
      fillOpacity="0.16"
      stroke="#fbbf24"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Check mark inside shield */}
    <path
      d="M203 195 L215 207 L240 178"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sparkle dots */}
    <circle cx="120" cy="170" r="2" fill="#fbbf24" fillOpacity="0.7" />
    <circle cx="95" cy="220" r="1.5" fill="#fbbf24" fillOpacity="0.5" />
    <circle cx="155" cy="245" r="1.5" fill="#fbbf24" fillOpacity="0.5" />
  </svg>
);

const TaxImagery = () => (
  <svg
    viewBox="0 0 320 280"
    className="absolute -bottom-4 -right-2 h-[58%] w-[60%] opacity-[0.22] mix-blend-screen"
    preserveAspectRatio="xMaxYMax meet"
    aria-hidden="true"
  >
    {/* Document body */}
    <rect
      x="160"
      y="80"
      width="130"
      height="180"
      rx="6"
      fill="#5eead4"
      fillOpacity="0.08"
      stroke="#5eead4"
      strokeOpacity="0.7"
      strokeWidth="1.5"
    />
    {/* Folded corner */}
    <path
      d="M270 80 L290 100 L270 100 Z"
      fill="#5eead4"
      fillOpacity="0.22"
      stroke="#5eead4"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Header bar */}
    <rect
      x="172"
      y="98"
      width="60"
      height="6"
      rx="2"
      fill="#5eead4"
      fillOpacity="0.6"
    />
    {/* Text rows */}
    {[120, 138, 156, 174, 192, 210].map((y, i) => (
      <rect
        key={y}
        x="172"
        y={y}
        width={i % 2 === 0 ? 100 : 78}
        height="3"
        rx="1.5"
        fill="#5eead4"
        fillOpacity="0.35"
      />
    ))}
    {/* Stamp circle */}
    <circle
      cx="260"
      cy="225"
      r="22"
      fill="none"
      stroke="#5eead4"
      strokeOpacity="0.7"
      strokeWidth="1.5"
    />
    <circle
      cx="260"
      cy="225"
      r="16"
      fill="none"
      stroke="#5eead4"
      strokeOpacity="0.45"
      strokeWidth="1"
      strokeDasharray="2 3"
    />
    <path
      d="M250 225 L257 232 L270 218"
      fill="none"
      stroke="#5eead4"
      strokeOpacity="0.85"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Floating coins / decimal dots */}
    <circle cx="100" cy="190" r="4" fill="#5eead4" fillOpacity="0.4" />
    <circle cx="80" cy="225" r="3" fill="#5eead4" fillOpacity="0.3" />
    <circle cx="125" cy="240" r="3" fill="#5eead4" fillOpacity="0.3" />
  </svg>
);

const topics: Topic[] = [
  {
    tag: "Investing",
    title: "Investing & Funds",
    description:
      "Learn how to grow your wealth through stocks, mutual funds, and ETFs — simplified for beginners.",
    gradient: "linear-gradient(135deg, #0c0c0f 0%, #1f2937 50%, #0d3a23 100%)",
    accent: "#22c55e",
    imagery: <InvestingImagery />,
  },
  {
    tag: "Insurance",
    title: "Insurance Plans",
    description:
      "Understand health, life, and car insurance in Pakistan, and choose what's best for you, smartly.",
    gradient: "linear-gradient(135deg, #2a1503 0%, #92400e 45%, #f59e0b 100%)",
    accent: "#fbbf24",
    imagery: <InsuranceImagery />,
  },
  {
    tag: "Taxation",
    title: "Tax Filing",
    description:
      "Master the basics of income tax, returns, and deductions — all explained in plain language, no jargon.",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #134e4a 100%)",
    accent: "#5eead4",
    imagery: <TaxImagery />,
  },
];

const LearnSection = () => {
  return (
    <section id="topics" className="w-full bg-zinc-50 px-6 py-28 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#159F63]" />
            Topics
          </span>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.75rem]">
            Learn. Understand. Invest.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {topics.map((t) => (
            <Link
              key={t.title}
              href="/signup"
              className="group relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-3xl ring-1 ring-zinc-200 transition-transform duration-500 hover:-translate-y-1"
              style={{ background: t.gradient }}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-50 mix-blend-soft-light"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${t.accent}40 0%, transparent 60%)`,
                }}
              />

              {t.imagery}

              <span className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white opacity-0 ring-1 ring-white/20 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                <ArrowRight className="h-4 w-4" />
              </span>

              <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-7">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/15 backdrop-blur">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: t.accent }}
                  />
                  {t.tag}
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {t.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  {t.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnSection;
