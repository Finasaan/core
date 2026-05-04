import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
};

const PhoneFrame = ({ children, className, screenClassName }: PhoneFrameProps) => {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[9/19] w-full max-w-[320px] rounded-[2.75rem] bg-zinc-950 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] ring-1 ring-zinc-800/80",
        className,
      )}
    >
      {/* Side rail highlights */}
      <span className="pointer-events-none absolute -left-[1px] top-24 h-12 w-[2px] rounded-r-full bg-zinc-700/60" />
      <span className="pointer-events-none absolute -left-[1px] top-44 h-20 w-[2px] rounded-r-full bg-zinc-700/60" />
      <span className="pointer-events-none absolute -right-[1px] top-32 h-16 w-[2px] rounded-l-full bg-zinc-700/60" />

      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[2.25rem]",
          screenClassName,
        )}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 flex h-6 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-zinc-950/95">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-zinc-800" />
          <span className="h-2 w-10 rounded-full bg-zinc-900" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;
