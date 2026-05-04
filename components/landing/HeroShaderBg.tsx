"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

const BRAND_PALETTE = [
  "#e6f7f0",
  "#dcfce7",
  "#86efac",
  "#159F63",
  "#fef3c7",
  "#fafafa",
];

const HeroShaderBg = () => {
  const [size, setSize] = useState({ width: 1600, height: 900 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-zinc-50">
      {mounted && (
        <MeshGradient
          width={size.width}
          height={size.height}
          colors={BRAND_PALETTE}
          distortion={0.85}
          swirl={0.55}
          grainMixer={0}
          grainOverlay={0}
          speed={0.32}
          offsetX={0.06}
        />
      )}
      {/* Soft veil to keep typography crisp */}
      <div className="absolute inset-0 bg-zinc-50/45" />
      {/* Bottom fade so the section hands off cleanly to TrustBar */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-zinc-50" />
    </div>
  );
};

export default HeroShaderBg;
