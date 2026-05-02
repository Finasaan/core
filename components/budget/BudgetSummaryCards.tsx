import { AmountDisplay } from "@/components/budget/AmountDisplay";
import { BudgetDashboardData } from "@/lib/budget/types";
import { savingsRateColor } from "@/lib/budget/utils";

interface BudgetSummaryCardsProps {
  data: BudgetDashboardData;
}

export function BudgetSummaryCards({ data }: BudgetSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-slate-500">Total Income</p>
        <AmountDisplay amount={data.total_income} type="income" size="lg" />
        <p className="mt-1 text-xs text-slate-500">For selected month</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-slate-500">Total Expenses</p>
        <AmountDisplay amount={data.total_expenses} type="expense" size="lg" />
        <p className="mt-1 text-xs text-slate-500">For selected month</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-slate-500">Savings</p>
        <AmountDisplay amount={data.savings} type="savings" size="lg" />
        <p className="mt-1 text-xs text-slate-500">Income minus expenses</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-slate-500">Savings Rate</p>
        <p className={`text-2xl font-semibold ${savingsRateColor(data.savings_rate)}`}>
          {data.savings_rate.toFixed(1)}%
        </p>
        <p className="mt-1 text-xs text-slate-500">Savings as % of income</p>
      </div>
    </div>
  );
}
