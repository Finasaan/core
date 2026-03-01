"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { ArrowRight } from "lucide-react";

const stats = [
  "PSX-Listed Stocks",
  "Mutual Funds",
  "Tax Calculators",
];

const HeroSection = () => {
  const [text] = useTypewriter({
    words: [
      "Financial Freedom",
      "Smart Budgeting",
      "Investment Basics",
      "Wealth Planning",
      "Money Mastery",
    ],
    loop: false,
    typeSpeed: 55,
    deleteSpeed: 40,
    delaySpeed: 1400,
  });

  return (
    <section
      className="relative flex w-full flex-col items-center justify-center px-6 pt-36 pb-28 text-center sm:pt-44 lg:pt-52 overflow-hidden min-h-[92vh]"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 10% 0%, #e6f7f0 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, #f0faf5 0%, transparent 55%), #fafafa",
      }}
    >

      {/* Background blobs — purely decorative, pointer-events-none */}
      {/* Green blob — top left, drifts slowly */}
      <div
        className="pointer-events-none absolute -top-32 -left-40 -z-10 h-[640px] w-[640px] rounded-full opacity-[0.22] blur-[130px] animate-blob-drift"
        style={{ background: "#159F63" }}
      />
      {/* Warm amber blob — bottom right, offset drift phase */}
      <div
        className="pointer-events-none absolute -bottom-20 -right-32 -z-10 h-[420px] w-[420px] rounded-full opacity-[0.09] blur-[100px] animate-blob-drift-delayed"
        style={{ background: "#F59E0B" }}
      />
      {/* Subtle second green orb — center right, very faint */}
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 -z-10 h-[280px] w-[280px] rounded-full opacity-[0.09] blur-[80px] animate-blob-drift"
        style={{ background: "#159F63", animationDelay: "-3s" }}
      />

      {/* Eyebrow pill */}
      <div className="animate-fade-in delay-0 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/60 backdrop-blur-md px-4 py-1.5 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#159F63] animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Financial Education Reimagined
        </span>
      </div>

      {/* Headline — two separate lines so typewriter never wraps */}
      <div className="mt-8 flex flex-col items-center">
        <h1 className="animate-fade-up delay-100 text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] leading-[1.08]">
          AI-Assisted
        </h1>
        {/* Typewriter line — fixed height prevents layout shift */}
        <div className="animate-fade-up delay-200 mt-1 flex min-h-[1.15em] items-center justify-center text-4xl font-extrabold tracking-tight sm:text-6xl md:text-[5rem] lg:text-[6rem] leading-[1.08]">
          <span className="bg-gradient-to-r from-[#159F63] to-[#0A6C41] bg-clip-text text-transparent whitespace-nowrap">
            {text}
          </span>
          <Cursor cursorColor="#159F63" cursorBlinking cursorStyle="|" />
        </div>
      </div>

      {/* Subtitle */}
      <p className="animate-fade-up delay-300 mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg font-medium">
        Your intelligent companion for mastering personal finance in Pakistan.
        Invest wisely, budget smarter, and build your future — in plain language,
        tailored to you.
      </p>

      {/* CTAs */}
      <div className="animate-fade-up delay-400 mt-10 flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
        <Button
          size="lg"
          className="group w-full sm:w-auto rounded-full bg-[#159F63] px-8 py-6 text-[15px] font-semibold text-white shadow-xl shadow-[#159F63]/25 hover:bg-[#128a54] hover:scale-[1.03] hover:shadow-[#159F63]/40 transition-all duration-300"
          asChild
        >
          <Link href="/signup">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:w-auto rounded-full px-8 py-6 text-[15px] font-semibold text-zinc-700 border-zinc-200 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-zinc-300 hover:text-zinc-900 shadow-sm transition-all duration-300 hover:scale-[1.02]"
          asChild
        >
          <Link href="/demo">View Demo</Link>
        </Button>
      </div>

      {/* Feature pills */}
      <div className="animate-fade-in delay-600 mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {stats.map((s, i) => (
          <span key={s} className="flex items-center gap-4">
            <span className="text-xs font-semibold text-zinc-400 tracking-wide">{s}</span>
            {i < stats.length - 1 && (
              <span className="text-zinc-300 text-xs select-none">·</span>
            )}
          </span>
        ))}
      </div>

    </section>
  );
};

export default HeroSection;
