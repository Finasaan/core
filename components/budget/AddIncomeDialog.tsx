"use client";

import { useState } from "react";
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
import { createIncome } from "@/lib/budget/api";
import { BudgetIncomeSource } from "@/lib/budget/types";

interface AddIncomeDialogProps {
  defaultMonth: number;
  defaultYear: number;
  onSuccess: (income: BudgetIncomeSource) => void;
  open?: boolean;
  onClose?: () => void;
}

export function AddIncomeDialog({
  defaultMonth,
  defaultYear,
  onSuccess,
  open = false,
  onClose,
}: AddIncomeDialogProps) {
  const [sourceName, setSourceName] = useState("");
  const [amount, setAmount] = useState("");
  const [incomeType, setIncomeType] = useState<"salary" | "freelance" | "other">("salary");
  const [recurrence, setRecurrence] = useState<"recurring" | "one-time">("recurring");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      const created = await createIncome({
        source_name: sourceName.trim(),
        amount: parsedAmount,
        income_type: incomeType,
        recurrence,
        month: defaultMonth,
        year: defaultYear,
        notes: notes.trim() || undefined,
      });
      onSuccess(created);
      setSourceName("");
      setAmount("");
      setNotes("");
      onClose?.();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to create income source.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Income Source</DialogTitle>
          <DialogDescription>Add a source for the selected month.</DialogDescription>
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
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
