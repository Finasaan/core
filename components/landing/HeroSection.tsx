"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTypewriter, Cursor } from "react-simple-typewriter";

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
    <section className="flex w-full flex-col items-center space-y-6 px-6 pt-16 pb-24 text-center sm:space-y-8 sm:pt-24 lg:pt-32">
      {/* Eyebrow label */}
      <div className="inline-flex items-center rounded-full border border-[#159F63]/30 bg-[#159F63]/8 px-4 py-1.5 text-sm font-medium text-[#159F63]">
        AI-Powered Financial Education
      </div>

      {/* Main headline */}
      <h1 className="max-w-4xl bg-gradient-to-r from-[#159F63] to-[#0f7548] bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl md:text-7xl">
        AI-Assisted{" "}
        <br className="sm:hidden" />
        <span>{text}</span>
        <Cursor cursorColor="#159F63" cursorBlinking />
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-base font-light leading-relaxed text-gray-500 sm:text-lg md:text-xl">
        Finasaan is your AI-guided companion for mastering personal finance in
        Pakistan. Build confidence with money, learn to invest wisely, and take
        control of your financial future — all tailored to you.
      </p>

      {/* CTA */}
      <Link href="/signup">
        <Button
          size="lg"
          className="mt-2 rounded-full bg-[#159F63] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-[#159F63]/25 hover:bg-[#128a54] transition-colors"
        >
          Get Started — It&apos;s Free
        </Button>
      </Link>
    </section>
  );
};

export default HeroSection;
