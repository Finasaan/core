"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/budget/CategoryBadge";
import { AmountDisplay } from "@/components/budget/AmountDisplay";
import { BudgetTransaction } from "@/lib/budget/types";

interface TransactionItemProps {
  tx: BudgetTransaction;
  onEdit: (tx: BudgetTransaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ tx, onEdit, onDelete }: TransactionItemProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1.2fr_1fr_0.8fr_auto] md:items-center">
      <div className="space-y-1">
        {tx.category ? <CategoryBadge category={tx.category} size="sm" /> : null}
        <p className="text-sm font-medium text-slate-900">{tx.description}</p>
      </div>

      <p className="text-sm text-slate-500">{new Date(tx.date).toLocaleDateString("en-PK")}</p>

      <AmountDisplay amount={tx.amount} type={tx.type} size="md" />

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(tx)}>
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(tx.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
