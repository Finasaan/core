"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HomeNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 transition-all duration-500 sm:h-20 sm:px-6 md:px-12",
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-zinc-200/60 shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0">
        <Image
          src="/logodark.svg"
          alt="Finasaan"
          width={140}
          height={36}
          priority
          className="h-7 w-auto object-contain transition-opacity duration-200 hover:opacity-75 sm:h-9"
        />
      </Link>

      {/* Auth */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        <Link
          href="/login"
          className={cn(
            "relative hidden sm:inline-block text-sm font-medium transition-colors duration-200",
            "after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:rounded-full after:transition-all after:duration-300",
            scrolled
              ? "text-zinc-600 hover:text-zinc-900 after:bg-zinc-900"
              : "text-zinc-700 hover:text-zinc-900 after:bg-zinc-900",
            "hover:after:w-full"
          )}
        >
          Sign In
        </Link>
        <Button
          className={cn(
            "rounded-full px-4 h-9 font-semibold text-xs transition-all duration-300 sm:px-6 sm:h-10 sm:text-sm",
            "bg-zinc-900 text-white hover:bg-[#159F63] hover:shadow-lg hover:shadow-[#159F63]/20 hover:scale-[1.03]"
          )}
          asChild
        >
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </header>
  );
};

export default HomeNav;
