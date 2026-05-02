"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SavingsGoalCard,
  AddSavingsGoalDialog,
  EditSavingsGoalDialog,
} from "@/components/budget";
import { fetchSavingsGoals, deleteSavingsGoal } from "@/lib/budget/api";
import type { SavingsGoal } from "@/lib/budget/types";

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const data = await fetchSavingsGoals();
      setGoals(data);
    } catch (err) {
      setError("Failed to load savings goals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteSavingsGoal(id);
      loadGoals();
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground">Track your progress towards big targets</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <>
          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-xl bg-slate-50 text-slate-500">
              <p className="text-lg font-medium">No savings goals yet</p>
              <p className="text-sm">Add your first goal to start tracking progress.</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsAddOpen(true)}>
                Add First Goal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <SavingsGoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onEdit={setEditingGoal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      <AddSavingsGoalDialog 
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          loadGoals();
        }}
      />

      {editingGoal && (
        <EditSavingsGoalDialog 
          goal={editingGoal}
          onSuccess={() => {
            setEditingGoal(null);
            loadGoals();
          }}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </div>
  );
}
