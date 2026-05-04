import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Level = {
  badge: string;
  title: string;
  description: string;
  illustration: string;
};

const levels: Level[] = [
  {
    badge: "Level 01",
    title: "Beginner",
    description:
      "Start with the fundamentals — what money is, how to save, and how to read your first financial statement.",
    illustration: "/beginner.svg",
  },
  {
    badge: "Level 02",
    title: "Intermediate",
    description:
      "Build confidence with budgeting, mutual funds, and tax basics — applied to real Pakistani scenarios.",
    illustration: "/intermed.svg",
  },
  {
    badge: "Level 03",
    title: "Advanced",
    description:
      "Master investment strategies, portfolio allocation, and long-term wealth planning with AI-guided depth.",
    illustration: "/advanced.svg",
  },
];

const LevelsSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0D1F17] px-6 py-28 sm:px-8 lg:px-16">
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-[420px] w-[420px] rounded-full opacity-[0.10] blur-[140px]"
        style={{ background: "#159F63" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#159F63]" />
              Personalized learning
            </span>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Wherever you start, we meet you there.
            </h2>
          </div>
          <Link
            href="/signup"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#159F63] transition-colors hover:text-white"
          >
            Start your journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {levels.map((level) => (
            <div
              key={level.title}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#122B1E] p-7 ring-1 ring-white/[0.06] transition-all duration-300 hover:ring-white/[0.12]"
            >
              <div className="flex aspect-[5/3] w-full items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.04]">
                <Image
                  src={level.illustration}
                  alt={level.title}
                  width={260}
                  height={160}
                  className="h-full w-full object-contain p-6 opacity-90"
                />
              </div>

              <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#159F63]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#159F63]">
                {level.badge}
              </span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
                {level.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {level.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LevelsSection;
