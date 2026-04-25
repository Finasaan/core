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
import { createCategory } from "@/lib/budget/api";
import { BudgetCategory } from "@/lib/budget/types";

interface AddCategoryDialogProps {
  onSuccess: (category: BudgetCategory) => void;
  open?: boolean;
  onClose?: () => void;
}

export function AddCategoryDialog({
  onSuccess,
  open = false,
  onClose,
}: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🧾");
  const [color, setColor] = useState("#4ECDC4");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createCategory({
        name: name.trim(),
        icon: icon.trim() || undefined,
        color,
      });
      onSuccess(created);
      setName("");
      onClose?.();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to create category.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Category</DialogTitle>
          <DialogDescription>Create a personal spending category.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            placeholder="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Input
            placeholder="Emoji icon"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
          />

          <div>
            <label className="mb-1 block text-sm text-slate-600">Color</label>
            <Input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="h-10 w-full"
            />
          </div>

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
