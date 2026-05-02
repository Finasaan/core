import { AlertBanner } from "@/components/budget/AlertBanner";
import { BudgetAlert } from "@/lib/budget/types";

interface AlertsListProps {
  alerts: BudgetAlert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        All on track for this month.
      </div>
    );
  }

  const sorted = [...alerts].sort((a, b) => {
    if (a.severity === b.severity) return 0;
    return a.severity === "danger" ? -1 : 1;
  });

  return (
    <div className="space-y-3">
      {sorted.map((alert, index) => (
        <AlertBanner key={`${alert.type}-${alert.category_slug || "global"}-${index}`} alert={alert} />
      ))}
    </div>
  );
}
