import { formatPKR } from "@/lib/budget/utils";
import { cn } from "@/lib/utils";

interface AmountDisplayProps {
  amount: number;
  type?: "income" | "expense" | "savings" | "neutral";
  size?: "sm" | "md" | "lg";
}

export function AmountDisplay({
  amount,
  type = "neutral",
  size = "md",
}: AmountDisplayProps) {
  const colorClass =
    type === "income"
      ? "text-green-600"
      : type === "expense"
        ? "text-red-600"
        : type === "savings"
          ? amount >= 0
            ? "text-green-600"
            : "text-red-600"
          : "text-slate-900";

  const sizeClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";

  return <span className={cn("font-semibold", colorClass, sizeClass)}>{formatPKR(amount)}</span>;
}
