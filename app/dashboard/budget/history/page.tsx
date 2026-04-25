"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthlyTrendChart } from "@/components/budget";
import { fetchHistory } from "@/lib/budget/api";
import type { MonthlyHistoryPoint } from "@/lib/budget/types";
import { formatPKR, getMonthYearLabel, savingsRateColor } from "@/lib/budget/utils";

export default function HistoryPage() {
  const [history, setHistory] = useState<MonthlyHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const histData = await fetchHistory(12); // Load last 12 months for history page
        setHistory(histData);
      } catch (err) {
        setError("Failed to load history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Monthly History</h1>
        <p className="text-muted-foreground">Historical view of your finances</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income, Expenses & Savings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <MonthlyTrendChart history={history} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="p-3 font-medium">Month</th>
                    <th className="p-3 font-medium text-right">Income</th>
                    <th className="p-3 font-medium text-right">Expenses</th>
                    <th className="p-3 font-medium text-right">Savings</th>
                    <th className="p-3 font-medium text-right">Savings Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="border-b">
                        <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                        <td className="p-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                        <td className="p-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                        <td className="p-3 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                      </tr>
                    ))
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-slate-500">
                        No historical data available.
                      </td>
                    </tr>
                  ) : (
                    [...history].reverse().map((point) => (
                      <tr key={`${point.year}-${point.month}`} className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">
                          {getMonthYearLabel(point.month, point.year)}
                        </td>
                        <td className="p-3 text-right font-mono text-green-600">
                          {formatPKR(point.total_income)}
                        </td>
                        <td className="p-3 text-right font-mono text-red-600">
                          {formatPKR(point.total_expenses)}
                        </td>
                        <td className={`p-3 text-right font-mono ${point.savings >= 0 ? 'text-blue-600' : 'text-red-900 font-bold'}`}>
                          {formatPKR(point.savings)}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${savingsRateColor(point.savings_rate)}`}>
                            {point.savings_rate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
