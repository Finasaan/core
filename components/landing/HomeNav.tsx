"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Topics", href: "#topics" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

const HomeNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between px-6 transition-all duration-500 md:px-12",
        scrolled
          ? "border-b border-zinc-200/60 bg-white/85 shadow-[0_1px_20px_rgba(0,0,0,0.05)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <Link href="/" className="flex shrink-0 items-center">
        <Image
          src="/logodark.svg"
          alt="Finasaan"
          width={424}
          height={161}
          priority
          className="h-6 w-auto object-contain transition-opacity duration-200 hover:opacity-75"
        />
      </Link>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/login"
          className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:inline-block"
        >
          Sign in
        </Link>
        <Button
          className="h-10 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#159F63] hover:shadow-lg hover:shadow-[#159F63]/20"
          asChild
        >
          <Link href="/signup">Get started</Link>
        </Button>
      </div>
    </header>
  );
};

export default HomeNav;
