"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MonthYearSelector,
  TransactionFilters,
  TransactionList,
  AddTransactionDialog,
  EditTransactionDialog,
} from "@/components/budget";
import { 
  fetchTransactions, 
  fetchCategories, 
  deleteTransaction 
} from "@/lib/budget/api";
import type { 
  BudgetTransaction, 
  BudgetCategory 
} from "@/lib/budget/types";

const PAGE_SIZE = 20;

export default function TransactionsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<BudgetTransaction | null>(null);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetchTransactions({
        month,
        year,
        category_id: categoryId || undefined,
        type: type || undefined,
        description_contains: search || undefined,
        limit: PAGE_SIZE,
        offset: offset,
      });
      setTransactions(response.data);
      setTotal(response.total);
    } catch (err) {
      setError("Failed to load transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [month, year, categoryId, type, search, offset]);

  const handleFilterChange = (filters: { categoryId: string; type: string; description: string }) => {
    setCategoryId(filters.categoryId);
    setType(filters.type);
    setSearch(filters.description);
    setOffset(0);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      loadTransactions();
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage your detailed spending</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthYearSelector 
            month={month} 
            year={year} 
            onChange={(m, y) => { setMonth(m); setYear(y); setOffset(0); }} 
          />
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </header>

      <TransactionFilters 
        month={month}
        year={year}
        categoryId={categoryId}
        type={type}
        categories={categories}
        onFilter={handleFilterChange}
      />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <TransactionList 
          transactions={transactions}
          loading={loading}
          onEdit={setEditingTx}
          onDelete={handleDelete}
        />
        
        {total > PAGE_SIZE && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {offset + 1} to {Math.min(offset + PAGE_SIZE, total)} of {total} transactions
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={offset + PAGE_SIZE >= total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddTransactionDialog 
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        categories={categories}
        defaultMonth={month}
        defaultYear={year}
        onSuccess={() => {
          setIsAddOpen(false);
          loadTransactions();
        }}
      />

      {editingTx && (
        <EditTransactionDialog 
          tx={editingTx}
          categories={categories}
          onSuccess={() => {
            setEditingTx(null);
            loadTransactions();
          }}
          onClose={() => setEditingTx(null)}
        />
      )}
    </div>
  );
}
