"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatPKR } from "@/lib/calculators/config";
import type { SalaryProjectionPoint } from "@/lib/calculators/salary-tax";

interface Props {
  data: SalaryProjectionPoint[];
}

// Compact PKR label for chart axes
function compactPKR(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

// Recharts calls the content prop with untyped props — define a minimal shape
interface TooltipEntry {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const net  = payload.find((p) => p.name === "Net Take-Home");
  const tax  = payload.find((p) => p.name === "Annual Tax");
  const rate = payload.find((p) => p.name === "Effective Rate %");
  return (
    <div className="salary-chart-tooltip">
      <p className="salary-chart-tooltip-year">Year {label}</p>
      {net  && <p style={{ color: "#159F63", margin: "4px 0" }}>Net Take-Home: {formatPKR(net.value)}</p>}
      {tax  && <p style={{ color: "#94A3B8", margin: "4px 0" }}>Annual Tax: {formatPKR(tax.value)}</p>}
      {rate && <p style={{ color: "#DC2626", margin: "4px 0" }}>Effective Rate: {rate.value}%</p>}
    </div>
  );
}

export function SalaryTaxProjectionChart({ data }: Props) {
  if (!data.length) return null;

  return (
    <div className="calculator-chart" style={{ marginTop: 24 }}>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 4, right: 32, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tick={{ fontFamily: "Satoshi, sans-serif", fontSize: 12, fill: "#708090" }}
            label={{
              value: "Year",
              position: "insideBottom",
              offset: -2,
              fontFamily: "Satoshi, sans-serif",
              fontSize: 12,
              fill: "#708090",
            }}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={compactPKR}
            tickLine={false}
            axisLine={false}
            tick={{ fontFamily: "Satoshi, sans-serif", fontSize: 12, fill: "#708090" }}
            width={64}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
            axisLine={false}
            tick={{ fontFamily: "Satoshi, sans-serif", fontSize: 12, fill: "#708090" }}
            domain={[0, 40]}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: "Satoshi, sans-serif", fontSize: 13, paddingTop: 8 }}
          />
          {/* Stacked bars: net (bottom, green) + tax (top, grey) */}
          <Bar
            yAxisId="left"
            dataKey="netTakeHome"
            name="Net Take-Home"
            stackId="salary"
            fill="#159F63"
            radius={[0, 0, 2, 2]}
          />
          <Bar
            yAxisId="left"
            dataKey="annualTax"
            name="Annual Tax"
            stackId="salary"
            fill="#94A3B8"
            radius={[4, 4, 0, 0]}
          />
          {/* Line: effective tax rate % — right axis */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="effectiveRatePct"
            name="Effective Rate %"
            stroke="#DC2626"
            strokeWidth={2}
            dot={{ r: 3, fill: "#DC2626", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="calculator-chart-note">
        Pension and zakat scale proportionally with salary. Tax recalculated per FY 2025-26 slabs at each year.
      </p>
    </div>
  );
}
