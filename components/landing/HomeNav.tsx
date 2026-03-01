"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HomeNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollUp, setIsScrollUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navHeight = 120;
      const scrollDifference = currentScrollY - lastScrollY;
      const isScrollingUp = scrollDifference < 0;
      const isScrollingDown = scrollDifference > 0;
      const isInStickyZone = currentScrollY > navHeight;

      if (Math.abs(scrollDifference) > 0) {
        if (isScrollingUp && !isScrollUp) setIsScrollUp(true);
        else if (isScrollingDown && isScrollUp) setIsScrollUp(false);
      }

      if (isInStickyZone) {
        if (!isVisible) setIsVisible(true);
      } else if (isVisible) {
        setIsVisible(false);
        setIsScrollUp(false);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttled = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttled, { passive: true });
    return () => window.removeEventListener("scroll", throttled);
  }, [lastScrollY, isScrollUp, isVisible]);

  const navContent = (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center h-full">
        <Image
          src="/logo.png"
          alt="Finasaan"
          width={152}
          height={32}
          priority
          style={{ objectFit: "contain", width: "auto", height: "2rem" }}
        />
      </Link>

      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-[#159F63] text-[#159F63] hover:bg-[#159F63]/10 hover:text-[#159F63] font-medium px-5"
          asChild
        >
          <Link href="/login">Sign In</Link>
        </Button>
        <Button
          size="sm"
          className="bg-[#159F63] hover:bg-[#128a54] text-white font-medium px-5"
          asChild
        >
          <Link href="/signup">Register</Link>
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Static navbar — always at top before scroll */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between bg-white border-b border-gray-100 px-[7.5%] lg:px-[10%]">
        {navContent}
      </div>

      {/* Sticky navbar — slides in on scroll-up */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm px-[7.5%] lg:px-[10%]",
          "transition-transform duration-300 ease-out",
          isVisible && isScrollUp ? "translate-y-0" : "-translate-y-full"
        )}
      >
        {navContent}
      </div>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default HomeNav;
