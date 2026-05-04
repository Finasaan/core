import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  url?: string;
};

const BrowserFrame = ({
  children,
  className,
  contentClassName,
  url = "app.finasaan.com",
}: BrowserFrameProps) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] ring-1 ring-zinc-200",
        className,
      )}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex h-6 max-w-xs flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-3 text-[10px] font-medium text-zinc-500 ring-1 ring-zinc-200">
          <span className="h-1 w-1 rounded-full bg-zinc-300" />
          {url}
        </div>
        <span className="h-2.5 w-2.5 shrink-0" aria-hidden />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative aspect-[16/10] w-full bg-white",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default BrowserFrame;
