"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AddCategoryDialog,
  MonthYearSelector,
  BudgetPlannerTable,
  CategoryManager,
  IncomeList,
  AddIncomeDialog,
  EditIncomeDialog,
} from "@/components/budget";
import {
  deleteCategory,
  deleteIncome,
  fetchBudgetPlans,
  fetchCategories,
  fetchDashboard,
  fetchIncome,
  upsertBudgetPlan,
} from "@/lib/budget/api";
import type {
  BudgetCategory,
  CategoryBreakdown,
  BudgetIncomeSource,
  BudgetPlan,
} from "@/lib/budget/types";

export default function PlannerPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [plans, setPlans] = useState<BudgetPlan[]>([]);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [income, setIncome] = useState<BudgetIncomeSource[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<BudgetIncomeSource | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, planData, dashData, incomeData] = await Promise.all([
        fetchCategories(),
        fetchBudgetPlans(month, year),
        fetchDashboard(month, year),
        fetchIncome(month, year),
      ]);
      setCategories(cats);
      setPlans(planData);
      setBreakdown(dashData.category_breakdown);
      setIncome(incomeData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load planner data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlanChange = async (categoryId: string | null, amount: number) => {
    const previousPlans = plans;

    const tempPlan: BudgetPlan = {
      id: `temp-${categoryId ?? "total"}`,
      category_id: categoryId,
      planned_amount: amount,
      month,
      year,
    };

    try {
      // Optimistic update
      setPlans((prev) => {
        const existing = prev.find((p) => p.category_id === categoryId);
        if (existing) {
          return prev.map((p) =>
            p.category_id === categoryId ? { ...p, planned_amount: amount } : p
          );
        }
        return [...prev, tempPlan];
      });

      await upsertBudgetPlan({
        category_id: categoryId,
        planned_amount: amount,
        month,
        year,
      });
    } catch {
      setPlans(previousPlans);
      setError("Failed to update budget plan.");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id);
      await loadData();
    } catch {
      setError("Failed to delete income.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      setPlans((prev) => prev.filter((plan) => plan.category_id !== id));
      await loadData();
    } catch {
      setError("Failed to delete category. It may be in use by transactions.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
          <p className="text-muted-foreground">Set your targets and manage income</p>
        </div>
        <MonthYearSelector 
          month={month} 
          year={year} 
          onChange={(m, y) => { setMonth(m); setYear(y); }} 
        />
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <BudgetPlannerTable 
                  categories={categories}
                  plans={plans}
                  breakdown={breakdown}
                  month={month}
                  year={year}
                  onPlanChange={handlePlanChange}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Categories</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="mr-1 h-4 w-4" /> Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <CategoryManager
                categories={categories}
                onCategoryAdded={() => {
                  void loadData();
                }}
                onCategoryDeleted={handleDeleteCategory}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Incomes</CardTitle>
              <Button size="sm" onClick={() => setIsAddIncomeOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent>
              <IncomeList 
                income={income}
                loading={loading}
                onEdit={setEditingIncome}
                onDelete={handleDeleteIncome}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSuccess={() => {
          setIsAddCategoryOpen(false);
          loadData();
        }}
      />

      <AddIncomeDialog 
        open={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        defaultMonth={month}
        defaultYear={year}
        onSuccess={() => {
          setIsAddIncomeOpen(false);
          loadData();
        }}
      />

      {editingIncome && (
        <EditIncomeDialog 
          income={editingIncome}
          onSuccess={() => {
            setEditingIncome(null);
            loadData();
          }}
          onClose={() => setEditingIncome(null)}
        />
      )}
    </div>
  );
}
