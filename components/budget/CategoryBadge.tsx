import { BudgetCategory } from "@/lib/budget/types";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: BudgetCategory;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const color = category.color || "#CBD5E1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slate-200",
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      )}
      style={{ backgroundColor: `${color}1A` }}
    >
      <span>{category.icon || "•"}</span>
      <span className="font-medium text-slate-800">{category.name}</span>
    </span>
  );
}
