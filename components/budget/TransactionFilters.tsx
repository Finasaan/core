"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetCategory } from "@/lib/budget/types";

interface TransactionFiltersProps {
  month: number;
  year: number;
  categoryId: string;
  type: string;
  categories: BudgetCategory[];
  onFilter: (filters: { categoryId: string; type: string; description: string }) => void;
}

export function TransactionFilters({
  month: _month,
  year: _year,
  categoryId,
  type,
  categories,
  onFilter,
}: TransactionFiltersProps) {
  const [description, setDescription] = useState("");

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-4 lg:grid-cols-3">
      <Select
        value={categoryId || "all"}
        onValueChange={(value) =>
          onFilter({
            categoryId: value === "all" ? "" : value,
            type,
            description,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.icon || "•"} {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={type || "all"}
        onValueChange={(value) =>
          onFilter({
            categoryId,
            type: value === "all" ? "" : value,
            description,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Input
        value={description}
        onChange={(event) => {
          const next = event.target.value;
          setDescription(next);
          onFilter({ categoryId, type, description: next });
        }}
        placeholder="Search description..."
      />
    </div>
  );
}
