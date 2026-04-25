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
import { updateSavingsGoal } from "@/lib/budget/api";
import { SavingsGoal } from "@/lib/budget/types";

interface EditSavingsGoalDialogProps {
  goal: SavingsGoal;
  onSuccess: (goal: SavingsGoal) => void;
  onClose: () => void;
}

export function EditSavingsGoalDialog({
  goal,
  onSuccess,
  onClose,
}: EditSavingsGoalDialogProps) {
  const [goalName, setGoalName] = useState(goal.goal_name);
  const [targetAmount, setTargetAmount] = useState(String(goal.target_amount));
  const [currentAmount, setCurrentAmount] = useState(String(goal.current_amount));
  const [targetDate, setTargetDate] = useState(goal.target_date || "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setGoalName(goal.goal_name);
    setTargetAmount(String(goal.target_amount));
    setCurrentAmount(String(goal.current_amount));
    setTargetDate(goal.target_date || "");
  }, [goal]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedTarget = Number(targetAmount);
    const parsedCurrent = Number(currentAmount);

    if (!goalName.trim() || !Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setError("Provide a valid goal name and target amount.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateSavingsGoal(goal.id, {
        goal_name: goalName.trim(),
        target_amount: parsedTarget,
        current_amount: parsedCurrent,
        target_date: targetDate || undefined,
      });
      onSuccess(updated);
      onClose();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to update savings goal.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Savings Goal</DialogTitle>
          <DialogDescription>Update the details of your savings target.</DialogDescription>
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
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
