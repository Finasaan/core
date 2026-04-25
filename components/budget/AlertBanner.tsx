import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ALERT_SEVERITY_COLORS } from "@/lib/budget/constants";
import { BudgetAlert } from "@/lib/budget/types";

interface AlertBannerProps {
  alert: BudgetAlert;
}

export function AlertBanner({ alert }: AlertBannerProps) {
  const icon = alert.severity === "danger" ? "🚨" : "⚠️";

  return (
    <Alert className={`border ${ALERT_SEVERITY_COLORS[alert.severity]}`}>
      <AlertTitle className="flex items-center gap-2 font-semibold">
        <span>{icon}</span>
        <span>{alert.severity === "danger" ? "Critical Alert" : "Warning"}</span>
      </AlertTitle>
      <AlertDescription>{alert.message}</AlertDescription>
    </Alert>
  );
}
