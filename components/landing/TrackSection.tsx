"use client";

import { useMemo, useState } from "react";

type Instrument = {
  label: string;
  rate: number;
  color: string;
};

const instruments: Instrument[] = [
  { label: "Gold", rate: 0.12, color: "#EF4444" },
  { label: "KSE-100 Index", rate: 0.07, color: "#A78BFA" },
  { label: "Meezan Gold Fund", rate: 0.238, color: "#159F63" },
  { label: "Meezan Islamic Income", rate: 0.116, color: "#EC4899" },
];

const horizons: { label: string; years: number }[] = [
  { label: "1Y", years: 1 },
  { label: "3Y", years: 3 },
  { label: "5Y", years: 5 },
];

const MIN = 1000;
const MAX = 1000000;
const STEP = 1000;

const formatPKR = (n: number) =>
  `PKR ${Math.round(n).toLocaleString("en-US")}`;

const TrackSection = () => {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(1);

  const projections = useMemo(
    () =>
      instruments.map((i) => ({
        ...i,
        projected: amount * Math.pow(1 + i.rate, years),
      })),
    [amount, years],
  );

  const maxProjected = Math.max(...projections.map((p) => p.projected));
  const fillPercent = ((amount - MIN) / (MAX - MIN)) * 100;

  return (
    <section className="relative w-full overflow-hidden bg-[#0D1F17] px-6 py-28 sm:px-8 lg:px-16">
      <div
        className="pointer-events-none absolute -top-32 right-1/4 h-[480px] w-[480px] rounded-full opacity-[0.10] blur-[140px]"
        style={{ background: "#159F63" }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
            Find out what
            <br />
            your money can do.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">
            Drag the slider to see how smart choices today can grow your
            savings tomorrow — powered by real data, tailored for Pakistan.
          </p>
        </div>

        <div className="lg:col-span-7">
          {/* Interactive starting amount card */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Starting amount
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
                  {formatPKR(amount)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1 rounded-full bg-zinc-100 p-1">
                {horizons.map((h) => {
                  const active = years === h.years;
                  return (
                    <button
                      key={h.label}
                      type="button"
                      onClick={() => setYears(h.years)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                        active
                          ? "bg-[#159F63] text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                      aria-pressed={active}
                    >
                      {h.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-5">
              <div
                className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#159F63]"
                style={{ width: `${fillPercent}%` }}
                aria-hidden
              />
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                aria-label="Starting amount in PKR"
                className="
                  relative h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200
                  focus:outline-none
                  [&::-webkit-slider-thumb]:relative
                  [&::-webkit-slider-thumb]:z-10
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:ring-2
                  [&::-webkit-slider-thumb]:ring-[#159F63]
                  [&::-webkit-slider-thumb]:shadow-[0_2px_10px_-2px_rgba(21,159,99,0.5)]
                  [&::-webkit-slider-thumb]:cursor-grab
                  [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:h-5
                  [&::-moz-range-thumb]:w-5
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-2
                  [&::-moz-range-thumb]:border-[#159F63]
                  [&::-moz-range-thumb]:cursor-grab
                  [&::-moz-range-thumb]:shadow-[0_2px_10px_-2px_rgba(21,159,99,0.5)]
                "
              />
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              <span>{formatPKR(MIN)}</span>
              <span>
                Saved for{" "}
                <span className="font-bold text-zinc-900">
                  {years} {years === 1 ? "year" : "years"}
                </span>
              </span>
              <span>{formatPKR(MAX)}</span>
            </div>
          </div>

          {/* Live projection bars */}
          <div className="mt-10 space-y-7">
            {projections.map((row) => {
              const widthPercent = (row.projected / maxProjected) * 100;
              const gainPercent = ((row.projected - amount) / amount) * 100;
              return (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-zinc-300">
                      {row.label}
                      <span className="ml-2 text-xs font-semibold text-zinc-500">
                        +{gainPercent.toFixed(1)}%
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums text-white">
                      {formatPKR(row.projected)}
                    </span>
                  </div>
                  <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{
                        width: `${widthPercent}%`,
                        background: row.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-[11px] leading-relaxed text-zinc-500">
            Indicative annualised returns based on historical Pakistan market
            data. Past performance is not a guarantee of future results.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrackSection;
