"use client";

import { useEffect, useState } from "react";
import { CategoryBadge } from "@/components/budget/CategoryBadge";
import { BudgetProgressBar } from "@/components/budget/BudgetProgressBar";
import { Input } from "@/components/ui/input";
import { BudgetCategory } from "@/lib/budget/types";
import { formatPKR } from "@/lib/budget/utils";

interface CategoryBudgetRowProps {
  category: BudgetCategory;
  plannedAmount: number;
  actualAmount: number;
  onChange: (categoryId: string, amount: number) => void;
}

export function CategoryBudgetRow({
  category,
  plannedAmount,
  actualAmount,
  onChange,
}: CategoryBudgetRowProps) {
  const [draftAmount, setDraftAmount] = useState(String(plannedAmount));

  useEffect(() => {
    setDraftAmount(String(plannedAmount));
  }, [plannedAmount]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const parsed = Number(draftAmount);
      if (Number.isFinite(parsed) && parsed >= 0 && parsed !== plannedAmount) {
        onChange(category.id, parsed);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [draftAmount, plannedAmount, category.id, onChange]);

  return (
    <tr className="border-t align-top">
      <td className="p-3">
        <CategoryBadge category={category} size="sm" />
      </td>
      <td className="p-3">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={draftAmount}
          onChange={(event) => setDraftAmount(event.target.value)}
        />
      </td>
      <td className="p-3 text-sm text-slate-700">{formatPKR(actualAmount)}</td>
      <td className="p-3">
        <BudgetProgressBar
          actual={actualAmount}
          planned={Number(draftAmount) || 0}
          categoryName={category.name}
          color={category.color || undefined}
        />
      </td>
    </tr>
  );
}
