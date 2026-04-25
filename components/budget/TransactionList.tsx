import { TransactionItem } from "@/components/budget/TransactionItem";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetTransaction } from "@/lib/budget/types";

interface TransactionListProps {
  transactions: BudgetTransaction[];
  loading: boolean;
  onEdit: (tx: BudgetTransaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  loading,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">
        No transactions. Add your first one.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">{transactions.length} transaction(s)</p>
      <div className="max-h-[400px] overflow-y-auto pr-1">
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
