"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MonthYearSelector,
  BudgetPlannerTable,
  IncomeList,
  AddIncomeDialog,
  EditIncomeDialog,
} from "@/components/budget";
import { 
  fetchCategories, 
  fetchBudgetPlans, 
  fetchDashboard, 
  fetchIncome,
  upsertBudgetPlan,
  deleteIncome
} from "@/lib/budget/api";
import type { 
  BudgetCategory, 
  BudgetPlan, 
  CategoryBreakdown,
  BudgetIncomeSource
} from "@/lib/budget/types";

export default function PlannerPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [plans, setPlans] = useState<BudgetPlan[]>([]);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [income, setIncome] = useState<BudgetIncomeSource[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<BudgetIncomeSource | null>(null);

  const loadData = async () => {
    setLoading(true);
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
      setError("Failed to load planner data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const handlePlanChange = async (categoryId: string | null, amount: number) => {
    try {
      // Optimistic update
      setPlans(prev => {
        const existing = prev.find(p => p.category_id === categoryId);
        if (existing) {
          return prev.map(p => p.category_id === categoryId ? { ...p, planned_amount: amount } : p);
        } else {
          return [...prev, { id: 'temp', category_id: categoryId, planned_amount: amount, month, year }];
        }
      });
      
      await upsertBudgetPlan({
        category_id: categoryId,
        planned_amount: amount,
        month,
        year,
      });
    } catch (err) {
      console.error("Failed to update plan", err);
      loadData(); // Revert on error
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete income", err);
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
