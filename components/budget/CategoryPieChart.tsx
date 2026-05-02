"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CHART_COLORS } from "@/lib/budget/constants";
import { CategoryBreakdown } from "@/lib/budget/types";
import { formatPKR } from "@/lib/budget/utils";

interface CategoryPieChartProps {
  breakdown: CategoryBreakdown[];
}

export function CategoryPieChart({ breakdown }: CategoryPieChartProps) {
  const chartData = breakdown.filter((item) => item.actual > 0);

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h3 className="text-base font-semibold">Category Spend</h3>
        <p className="mt-4 text-sm text-slate-500">No expenses recorded</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="actual"
            nameKey="category.name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ payload, percent }: any) => 
              `${payload.category.name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.category.id}
                fill={entry.category.color || CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, _name: any, entry: any) => [
              formatPKR(Number(value) || 0),
              entry.payload.category.name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
