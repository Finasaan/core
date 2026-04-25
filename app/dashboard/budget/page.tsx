"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MonthYearSelector,
  BudgetSummaryCards,
  CategoryPieChart,
  MonthlyTrendChart,
  AlertsList,
  BurnRateCard,
  TransactionList,
  AddTransactionDialog,
} from "@/components/budget";
import { InsightCard } from "@/components/budget/ai";
import { useBudgetAI } from "@/context/BudgetAIContext";
import { fetchDashboard, fetchHistory, fetchTransactions, fetchCategories } from "@/lib/budget/api";
import type { 
  BudgetDashboardData, 
  MonthlyHistoryPoint, 
  BudgetTransaction, 
  BudgetCategory 
} from "@/lib/budget/types";

export default function BudgetDashboardPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dashboard, setDashboard] = useState<BudgetDashboardData | null>(null);
  const [history, setHistory] = useState<MonthlyHistoryPoint[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<BudgetTransaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  const { insights, isInsightsLoading, fetchInsights } = useBudgetAI();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashData, histData, txData, catData] = await Promise.all([
        fetchDashboard(month, year),
        fetchHistory(6),
        fetchTransactions({ month, year, limit: 5 }),
        fetchCategories(),
        fetchInsights(month, year),
      ]);
      setDashboard(dashData);
      setHistory(histData);
      setRecentTransactions(txData.data);
      setCategories(catData);
    } catch (err) {
      console.error("Failed to fetch budget data:", err);
      setError("Failed to load budget data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const handleAddTxSuccess = () => {
    setIsAddTxOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Dashboard</h1>
          <p className="text-muted-foreground">Track your income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthYearSelector 
            month={month} 
            year={year} 
            onChange={(m, y) => { setMonth(m); setYear(y); }} 
          />
          <Button onClick={() => setIsAddTxOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <AlertsList alerts={dashboard?.alerts ?? []} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        dashboard && <BudgetSummaryCards data={dashboard} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <CategoryPieChart breakdown={dashboard?.category_breakdown ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <MonthlyTrendChart history={history} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            dashboard && (
              <>
                <BurnRateCard
                  burnRate={dashboard.burn_rate}
                  dailyAllowance={dashboard.daily_allowance}
                  daysRemaining={dashboard.days_remaining}
                />
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Daily Guidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700">
                      PKR remaining: <span className="font-semibold">{dashboard.total_income - dashboard.total_expenses > 0 ? (dashboard.total_income - dashboard.total_expenses).toLocaleString() : 0}</span>
                      {" "}for {dashboard.days_remaining} day(s).
                    </p>
                  </CardContent>
                </Card>
              </>
            )
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {insights.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">Smart Insights</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-2 scrollbar-none">
                {insights.map((insight, idx) => (
                  <div key={idx} className="min-w-[300px] flex-1">
                    <InsightCard insight={insight} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/dashboard/budget/transactions">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <TransactionList 
                  transactions={recentTransactions} 
                  loading={false}
                  onEdit={() => {}} 
                  onDelete={() => {}} 
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddTransactionDialog 
        open={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        categories={categories}
        defaultMonth={month}
        defaultYear={year}
        onSuccess={handleAddTxSuccess}
      />
    </div>
  );
}
