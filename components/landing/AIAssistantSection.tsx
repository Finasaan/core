import Link from "next/link";
import { Sparkles } from "lucide-react";
import AIChatMockup from "./AIChatMockup";

const AIAssistantSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0F2318] px-6 py-28 sm:px-8 lg:px-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[160px]"
        style={{ background: "#159F63" }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[#159F63]" />
          AI Assistant
        </span>

        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
          Ask Finasaan.
          <br />
          Get answers in plain language.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">
          From &ldquo;Where should I invest?&rdquo; to &ldquo;How do I file
          zakat?&rdquo; — get instant, personalised guidance from our smart
          assistant, trained on Pakistan&apos;s financial landscape.
        </p>

        <Link
          href="/signup"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-transform duration-300 hover:scale-[1.03]"
        >
          Try it now
        </Link>

        {/* Browser mockup */}
        <div className="relative mt-16 w-full max-w-5xl">
          <div
            className="pointer-events-none absolute inset-x-16 top-8 -z-10 h-[70%] rounded-full opacity-40 blur-3xl"
            style={{ background: "#159F63" }}
          />
          <AIChatMockup />
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;
