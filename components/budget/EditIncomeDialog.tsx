"use client";

import { useEffect, useState } from "react";
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
import { updateIncome } from "@/lib/budget/api";
import { BudgetIncomeSource } from "@/lib/budget/types";

interface EditIncomeDialogProps {
  income: BudgetIncomeSource;
  onSuccess: (income: BudgetIncomeSource) => void;
  onClose: () => void;
}

export function EditIncomeDialog({ income, onSuccess, onClose }: EditIncomeDialogProps) {
  const [sourceName, setSourceName] = useState(income.source_name);
  const [amount, setAmount] = useState(String(income.amount));
  const [incomeType, setIncomeType] = useState<"salary" | "freelance" | "other">(income.income_type);
  const [recurrence, setRecurrence] = useState<"recurring" | "one-time">(income.recurrence);
  const [notes, setNotes] = useState(income.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSourceName(income.source_name);
    setAmount(String(income.amount));
    setIncomeType(income.income_type);
    setRecurrence(income.recurrence);
    setNotes(income.notes || "");
  }, [income]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!sourceName.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Provide a valid source name and amount.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateIncome(income.id, {
        source_name: sourceName.trim(),
        amount: parsedAmount,
        income_type: incomeType,
        recurrence,
        notes: notes.trim() || undefined,
      });
      onSuccess(updated);
      onClose();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to update income source.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Income Source</DialogTitle>
          <DialogDescription>Update this income source.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            placeholder="Source name"
            value={sourceName}
            onChange={(event) => setSourceName(event.target.value)}
          />

          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              value={incomeType}
              onValueChange={(value) => setIncomeType(value as "salary" | "freelance" | "other")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Income type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={recurrence}
              onValueChange={(value) => setRecurrence(value as "recurring" | "one-time")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Monthly Recurring</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
