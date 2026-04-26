"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MonthYearSelector,
  BudgetSummaryCards,
  CategoryPieChart,
  MonthlyTrendChart,
  AlertsList,
  DailyAllowanceCard,
  TransactionList,
  AddTransactionDialog,
  EditTransactionDialog,
} from "@/components/budget";
import {
  deleteTransaction,
  fetchCategories,
  fetchDashboard,
  fetchHistory,
  fetchTransactions,
} from "@/lib/budget/api";
import type {
  BudgetCategory,
  BudgetDashboardData,
  BudgetTransaction,
  MonthlyHistoryPoint,
} from "@/lib/budget/types";

export default function BudgetDashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [dashboard, setDashboard] = useState<BudgetDashboardData | null>(null);
  const [history, setHistory] = useState<MonthlyHistoryPoint[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<BudgetTransaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<BudgetTransaction | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashData, histData, txData] = await Promise.all([
        fetchDashboard(month, year),
        fetchHistory(6),
        fetchTransactions({ month, year, limit: 5, offset: 0 }),
      ]);
      setDashboard(dashData);
      setHistory(histData);
      setRecentTransactions(txData.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load budget dashboard.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  const loadCategories = useCallback(async () => {
    try {
      const catData = await fetchCategories();
      setCategories(catData);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTransaction(id);
        await loadData();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete transaction.";
        setError(message);
      }
    },
    [loadData]
  );

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
            onChange={(m, y) => {
              setMonth(m);
              setYear(y);
            }}
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

      {loading ? (
        <Skeleton className="h-28 w-full" />
      ) : (
        dashboard && <DailyAllowanceCard data={dashboard} />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <Link href="/dashboard/budget/transactions">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={recentTransactions}
            loading={loading}
            onEdit={setEditingTx}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        categories={categories}
        defaultMonth={month}
        defaultYear={year}
        onSuccess={handleAddTxSuccess}
      />

      {editingTx ? (
        <EditTransactionDialog
          tx={editingTx}
          categories={categories}
          onClose={() => setEditingTx(null)}
          onSuccess={() => {
            setEditingTx(null);
            loadData();
          }}
        />
      ) : null}
    </div>
  );
}
