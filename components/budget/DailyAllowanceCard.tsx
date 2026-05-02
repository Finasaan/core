import { BudgetDashboardData } from "@/lib/budget/types";
import { formatPKR } from "@/lib/budget/utils";
import { BurnRateCard } from "@/components/budget/BurnRateCard";

interface DailyAllowanceCardProps {
  data: BudgetDashboardData;
}

export function DailyAllowanceCard({ data }: DailyAllowanceCardProps) {
  const remaining = data.total_income - data.total_expenses;
  const allowance =
    data.days_remaining > 0 ? remaining / data.days_remaining : data.daily_allowance;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <BurnRateCard
        burnRate={data.burn_rate}
        dailyAllowance={data.daily_allowance}
        daysRemaining={data.days_remaining}
      />

      <div className="rounded-lg border bg-white p-5">
        <h3 className="text-base font-semibold">Daily Budget Guidance</h3>
        {allowance !== null ? (
          <p className="mt-3 text-sm text-slate-700">
            PKR remaining: <span className="font-semibold">{formatPKR(remaining)}</span>
            {" "}for {data.days_remaining} day(s), around
            {" "}<span className="font-semibold">{formatPKR(allowance)}</span> per day.
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No daily allowance can be calculated for the selected month.
          </p>
        )}
      </div>
    </div>
  );
}
