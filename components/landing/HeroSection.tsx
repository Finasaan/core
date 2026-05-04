import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoopingPointerHighlight from "./LoopingPointerHighlight";
import HeroShaderBg from "./HeroShaderBg";
import HeroDashboardMockup from "./HeroDashboardMockup";

const HeroSection = () => {
  return (
    <section className="relative isolate w-full overflow-hidden">
      <HeroShaderBg />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 pt-36 pb-20 text-center sm:px-8 lg:gap-16 lg:px-16 lg:pt-44 lg:pb-28">
        {/* Eyebrow */}
        <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#159F63]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Built for Pakistan
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-100 -mt-6 max-w-5xl text-balance text-5xl font-bold tracking-[-0.03em] text-zinc-900 sm:text-6xl lg:text-[5.25rem] lg:leading-[1.02]">
          <LoopingPointerHighlight
            intervalMs={5000}
            containerClassName="inline-block align-baseline"
            rectangleClassName="border-2 border-[#159F63]/70 rounded-md"
            pointerClassName="text-[#159F63]"
          >
            <span className="relative z-10 px-1">Understand</span>
          </LoopingPointerHighlight>{" "}
          your money. Change your{" "}
          <span className="bg-gradient-to-br from-[#159F63] to-[#0A6C41] bg-clip-text text-transparent">
            future
          </span>
          .
        </h1>

        <p className="animate-fade-up delay-200 -mt-4 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg">
          Finasaan breaks down Pakistan&apos;s complex financial world — from
          stocks to taxes — using real-time data and AI-powered guidance. Learn,
          track, and grow your money with confidence.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-300 -mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            className="group h-12 rounded-full bg-[#159F63] px-7 text-[15px] font-semibold text-white shadow-xl shadow-[#159F63]/25 transition-all duration-300 hover:scale-[1.02] hover:bg-[#128a54] hover:shadow-[#159F63]/40"
            asChild
          >
            <Link href="/signup">
              Get started
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-zinc-200 bg-white/70 px-7 text-[15px] font-semibold text-zinc-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 hover:bg-white"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </div>

        {/* Mockup */}
        <div className="animate-fade-up delay-500 relative w-full">
          <div
            className="pointer-events-none absolute inset-x-12 -top-8 -z-10 h-32 rounded-full opacity-40 blur-3xl"
            style={{ background: "#159F63" }}
          />
          <HeroDashboardMockup />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
