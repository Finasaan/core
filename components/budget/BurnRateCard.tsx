import { formatPKR } from "@/lib/budget/utils";

interface BurnRateCardProps {
  burnRate: number;
  dailyAllowance: number | null;
  daysRemaining: number;
}

export function BurnRateCard({
  burnRate,
  dailyAllowance,
  daysRemaining,
}: BurnRateCardProps) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <h3 className="text-base font-semibold">Burn Rate</h3>
      <p className="mt-2 text-sm text-slate-500">Daily Avg Spend</p>
      <p className="text-xl font-semibold text-red-600">{formatPKR(burnRate)}</p>

      {dailyAllowance !== null && (
        <p className="mt-3 text-sm text-slate-600">
          You can spend <span className="font-semibold">{formatPKR(dailyAllowance)}</span> per day to stay on track.
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">{daysRemaining} day(s) remaining in this month.</p>
    </div>
  );
}
