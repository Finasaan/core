import { CategoryBudgetRow } from "@/components/budget/CategoryBudgetRow";
import { BudgetPlan, BudgetCategory, CategoryBreakdown } from "@/lib/budget/types";
import { formatPKR } from "@/lib/budget/utils";

interface BudgetPlannerTableProps {
  categories: BudgetCategory[];
  plans: BudgetPlan[];
  breakdown: CategoryBreakdown[];
  month: number;
  year: number;
  onPlanChange: (categoryId: string | null, amount: number) => void;
}

export function BudgetPlannerTable({
  categories,
  plans,
  breakdown,
  month: _month,
  year: _year,
  onPlanChange,
}: BudgetPlannerTableProps) {
  const breakdownMap = new Map(breakdown.map((item) => [item.category.id, item.actual]));
  const planMap = new Map(
    plans
      .filter((plan) => plan.category_id)
      .map((plan) => [plan.category_id as string, plan.planned_amount])
  );

  const totalCap = plans.find((plan) => plan.category_id === null)?.planned_amount || 0;
  const totalPlanned = Array.from(planMap.values()).reduce((sum, value) => sum + value, 0);
  const totalSpent = Array.from(breakdownMap.values()).reduce((sum, value) => sum + value, 0);

  return (
    <div className="rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-slate-600">
            <th className="p-3 font-medium">Category</th>
            <th className="p-3 font-medium">Budget (PKR)</th>
            <th className="p-3 font-medium">Spent</th>
            <th className="p-3 font-medium">Progress</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t bg-slate-50">
            <td className="p-3 font-medium text-slate-800">Total Monthly Cap</td>
            <td className="p-3">
              <input
                className="w-full rounded-md border px-3 py-2"
                type="number"
                min="0"
                step="0.01"
                value={totalCap}
                onChange={(event) => onPlanChange(null, Number(event.target.value) || 0)}
              />
            </td>
            <td className="p-3">{formatPKR(totalSpent)}</td>
            <td className="p-3">
              {totalCap > 0 ? `${((totalSpent / totalCap) * 100).toFixed(0)}%` : "No cap"}
            </td>
          </tr>

          {categories.map((category) => (
            <CategoryBudgetRow
              key={category.id}
              category={category}
              plannedAmount={planMap.get(category.id) || 0}
              actualAmount={breakdownMap.get(category.id) || 0}
              onChange={(categoryId, amount) => onPlanChange(categoryId, amount)}
            />
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t bg-slate-50 font-medium">
            <td className="p-3">Totals</td>
            <td className="p-3">{formatPKR(totalPlanned)}</td>
            <td className="p-3">{formatPKR(totalSpent)}</td>
            <td className="p-3">
              {totalPlanned > 0 ? `${((totalSpent / totalPlanned) * 100).toFixed(0)}%` : "-"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
