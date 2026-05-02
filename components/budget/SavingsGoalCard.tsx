"use client";

import { Button } from "@/components/ui/button";
import { SavingsGoal } from "@/lib/budget/types";
import { formatPKR } from "@/lib/budget/utils";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

export function SavingsGoalCard({ goal, onEdit, onDelete }: SavingsGoalCardProps) {
  const progress = goal.target_amount > 0
    ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
    : 0;

  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{goal.goal_name}</h3>
          {goal.target_date ? (
            <p className="text-xs text-slate-500">Target: {new Date(goal.target_date).toLocaleDateString("en-PK")}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(goal)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(goal.id)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
        <span>{formatPKR(goal.current_amount)}</span>
        <span>{progress.toFixed(1)}%</span>
        <span>{formatPKR(goal.target_amount)}</span>
      </div>
    </div>
  );
}
