"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MonthlyHistoryPoint } from "@/lib/budget/types";
import { formatPKR, getMonthYearLabel } from "@/lib/budget/utils";

interface MonthlyTrendChartProps {
  history: MonthlyHistoryPoint[];
}

export function MonthlyTrendChart({ history }: MonthlyTrendChartProps) {
  const chartData = history.map((point) => ({
    ...point,
    label: getMonthYearLabel(point.month, point.year),
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
          <Tooltip
            formatter={(value: any) => formatPKR(Number(value) || 0)}
            labelFormatter={(label) => String(label)}
          />
          <Line type="monotone" dataKey="total_income" stroke="#16A34A" strokeWidth={2} />
          <Line type="monotone" dataKey="total_expenses" stroke="#DC2626" strokeWidth={2} />
          <Line type="monotone" dataKey="savings" stroke="#2563EB" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
