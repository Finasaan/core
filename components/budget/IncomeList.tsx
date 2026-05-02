import { Skeleton } from "@/components/ui/skeleton";
import { IncomeItem } from "@/components/budget/IncomeItem";
import { AmountDisplay } from "@/components/budget/AmountDisplay";
import { BudgetIncomeSource } from "@/lib/budget/types";

interface IncomeListProps {
  income: BudgetIncomeSource[];
  loading: boolean;
  onEdit: (income: BudgetIncomeSource) => void;
  onDelete: (id: string) => void;
}

export function IncomeList({ income, loading, onEdit, onDelete }: IncomeListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-slate-500">Total Income</p>
        <AmountDisplay amount={totalIncome} type="income" size="lg" />
      </div>

      {income.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">
          No income sources for this month.
        </div>
      ) : (
        income.map((entry) => (
          <IncomeItem key={entry.id} income={entry} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
