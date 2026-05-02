import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/budget/CategoryBadge";
import { BudgetCategory } from "@/lib/budget/types";

interface CategoryManagerProps {
  categories: BudgetCategory[];
  onCategoryAdded: (category: BudgetCategory) => void;
  onCategoryDeleted: (id: string) => void;
}

export function CategoryManager({
  categories,
  onCategoryAdded: _onCategoryAdded,
  onCategoryDeleted,
}: CategoryManagerProps) {
  const systemCategories = categories.filter((category) => category.is_system);
  const customCategories = categories.filter((category) => !category.is_system);

  return (
    <div className="space-y-4 rounded-lg border bg-white p-5">
      <div>
        <h3 className="text-base font-semibold">Category Manager</h3>
        <p className="text-sm text-slate-500">System categories are read-only.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Custom</p>
        {customCategories.length === 0 ? (
          <p className="text-sm text-slate-500">No custom categories yet.</p>
        ) : (
          customCategories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-md border p-2">
              <CategoryBadge category={category} size="sm" />
              <Button size="sm" variant="destructive" onClick={() => onCategoryDeleted(category.id)}>
                Delete
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">System</p>
        <div className="flex flex-wrap gap-2">
          {systemCategories.map((category) => (
            <CategoryBadge key={category.id} category={category} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
