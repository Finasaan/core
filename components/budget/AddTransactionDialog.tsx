"use client";

import { useMemo, useState } from "react";
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
import { createTransaction } from "@/lib/budget/api";
import { BudgetCategory, BudgetTransaction } from "@/lib/budget/types";

interface AddTransactionDialogProps {
  categories: BudgetCategory[];
  defaultMonth: number;
  defaultYear: number;
  onSuccess: (tx: BudgetTransaction) => void;
  open?: boolean;
  onClose?: () => void;
}

export function AddTransactionDialog({
  categories,
  defaultMonth,
  defaultYear,
  onSuccess,
  open = false,
  onClose,
}: AddTransactionDialogProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    `${defaultYear}-${String(defaultMonth).padStart(2, "0")}-01`
  );
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = useMemo(() => {
    if (type === "income") {
      return categories;
    }
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
      const tx = await createTransaction({
        category_id: categoryId,
        amount: parsedAmount,
        type,
        date,
        description: description.trim(),
        notes: notes.trim() || undefined,
      });
      onSuccess(tx);
      setCategoryId("");
      setAmount("");
      setDescription("");
      setNotes("");
      onClose?.();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to create transaction.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Create an income or expense entry.</DialogDescription>
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
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
