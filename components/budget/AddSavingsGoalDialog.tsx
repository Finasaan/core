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
import { createSavingsGoal } from "@/lib/budget/api";
import { SavingsGoal } from "@/lib/budget/types";

interface AddSavingsGoalDialogProps {
  onSuccess: (goal: SavingsGoal) => void;
  open?: boolean;
  onClose?: () => void;
}

export function AddSavingsGoalDialog({
  onSuccess,
  open = false,
  onClose,
}: AddSavingsGoalDialogProps) {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedTarget = Number(targetAmount);
    const parsedCurrent = Number(currentAmount || "0");

    if (!goalName.trim() || !Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setError("Provide a valid goal name and target amount.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createSavingsGoal({
        goal_name: goalName.trim(),
        target_amount: parsedTarget,
        current_amount: Number.isFinite(parsedCurrent) ? parsedCurrent : 0,
        target_date: targetDate || undefined,
      });
      onSuccess(created);
      setGoalName("");
      setTargetAmount("");
      setCurrentAmount("0");
      setTargetDate("");
      onClose?.();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to create savings goal.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Savings Goal</DialogTitle>
          <DialogDescription>Create a new savings target.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            placeholder="Goal name"
            value={goalName}
            onChange={(event) => setGoalName(event.target.value)}
          />

          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Target amount"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
          />

          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Current amount"
            value={currentAmount}
            onChange={(event) => setCurrentAmount(event.target.value)}
          />

          <Input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
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
