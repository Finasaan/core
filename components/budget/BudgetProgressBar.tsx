import { formatPKR } from "@/lib/budget/utils";

interface BudgetProgressBarProps {
  actual: number;
  planned: number;
  categoryName: string;
  color?: string;
}

export function BudgetProgressBar({
  actual,
  planned,
  categoryName,
  color,
}: BudgetProgressBarProps) {
  const percentage = planned > 0 ? (actual / planned) * 100 : 0;
  const fill = Math.min(percentage, 100);
  const isOverBudget = planned > 0 && actual > planned;

  return (
    <div className="space-y-1">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${fill}%`,
            backgroundColor: isOverBudget ? "#EF4444" : color || "#159F63",
          }}
          aria-label={`${categoryName} budget progress`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{formatPKR(actual)}</span>
        <span>{planned > 0 ? `${percentage.toFixed(0)}%` : "No plan"}</span>
        <span>{planned > 0 ? formatPKR(planned) : "-"}</span>
      </div>
      {isOverBudget && <p className="text-xs text-red-600">Over budget</p>}
    </div>
  );
}
