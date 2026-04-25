"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTransaction } from "@/lib/budget/api";
import { BudgetCategory, BudgetTransaction } from "@/lib/budget/types";

interface EditTransactionDialogProps {
  tx: BudgetTransaction;
  categories: BudgetCategory[];
  onSuccess: (tx: BudgetTransaction) => void;
  onClose: () => void;
}

export function EditTransactionDialog({
  tx,
  categories,
  onSuccess,
  onClose,
}: EditTransactionDialogProps) {
  const [type, setType] = useState<"income" | "expense">(tx.type);
  const [categoryId, setCategoryId] = useState(tx.category_id);
  const [amount, setAmount] = useState(String(tx.amount));
  const [date, setDate] = useState(tx.date);
  const [description, setDescription] = useState(tx.description);
  const [notes, setNotes] = useState(tx.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setType(tx.type);
    setCategoryId(tx.category_id);
    setAmount(String(tx.amount));
    setDate(tx.date);
    setDescription(tx.description);
    setNotes(tx.notes || "");
  }, [tx]);

  const filteredCategories = useMemo(() => {
    if (type === "income") return categories;
    return categories;
  }, [categories, type]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!categoryId || !description.trim() || !date || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please fill all required fields with valid values.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateTransaction(tx.id, {
        category_id: categoryId,
        amount: parsedAmount,
        type,
        date,
        description: description.trim(),
        notes: notes.trim() || undefined,
      });
      onSuccess(updated);
      onClose();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to update transaction.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Update the selected transaction details.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <Select value={type} onValueChange={(value) => setType(value as "income" | "expense")}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon || "•"} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />

          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
