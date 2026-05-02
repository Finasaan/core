"use client";

import { Button } from "@/components/ui/button";
import { AmountDisplay } from "@/components/budget/AmountDisplay";
import { INCOME_TYPE_LABELS, RECURRENCE_LABELS } from "@/lib/budget/constants";
import { BudgetIncomeSource } from "@/lib/budget/types";

interface IncomeItemProps {
  income: BudgetIncomeSource;
  onEdit: (income: BudgetIncomeSource) => void;
  onDelete: (id: string) => void;
}

export function IncomeItem({ income, onEdit, onDelete }: IncomeItemProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:items-center">
      <div>
        <p className="font-medium text-slate-900">{income.source_name}</p>
      </div>
      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
        {INCOME_TYPE_LABELS[income.income_type]}
      </span>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
        {RECURRENCE_LABELS[income.recurrence]}
      </span>
      <AmountDisplay amount={income.amount} type="income" size="sm" />
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(income)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(income.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
