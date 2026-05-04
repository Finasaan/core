import {
  Banknote,
  Landmark,
  LineChart,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type Partner = {
  icon: LucideIcon;
  name: string;
  caption: string;
};

const partners: Partner[] = [
  { icon: LineChart, name: "PSX", caption: "Pakistan Stock Exchange" },
  { icon: TrendingUp, name: "KSE-100", caption: "Benchmark Index" },
  { icon: ShieldCheck, name: "SECP", caption: "Regulatory Aligned" },
  { icon: Landmark, name: "Meezan", caption: "Islamic Finance" },
  { icon: Banknote, name: "MCB", caption: "Commercial Banking" },
];

const stats = [
  { value: "50+", label: "Finance topics" },
  { value: "24/7", label: "AI guidance" },
  { value: "100%", label: "Encrypted & private" },
];

const TrustBar = () => {
  return (
    <section className="w-full bg-zinc-50 px-6 py-20 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-base font-medium text-zinc-600 sm:text-lg">
          Built for Pakistan. Powered by real, local data.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {partners.map(({ icon: Icon, name, caption }) => (
            <div
              key={name}
              className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 transition-all duration-300 hover:border-[#159F63]/40 hover:shadow-[0_8px_24px_-12px_rgba(21,159,99,0.18)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-[#159F63] transition-colors duration-300 group-hover:bg-[#0D1F17]">
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-900">
                  {name}
                </span>
                <span className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                  {caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-zinc-200 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-start gap-1 bg-white px-6 py-7"
            >
              <span className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                {s.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
