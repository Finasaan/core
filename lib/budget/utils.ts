export function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMonthName(month: number): string {
  const date = new Date(Date.UTC(2000, Math.max(0, month - 1), 1));
  return date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
}

export function getMonthYearLabel(month: number, year: number): string {
  return `${getMonthName(month)} ${year}`;
}

export function getDaysInMonth(month: number, year: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isCurrentMonth(month: number, year: number): boolean {
  const now = new Date();
  return now.getUTCMonth() + 1 === month && now.getUTCFullYear() === year;
}

export function daysRemainingInMonth(month: number, year: number): number {
  const now = new Date();
  const todayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0));

  if (monthEnd < todayUtc) {
    return 0;
  }

  if (monthStart > todayUtc) {
    return getDaysInMonth(month, year);
  }

  return Math.max(0, monthEnd.getUTCDate() - todayUtc.getUTCDate() + 1);
}

export function getPreviousMonth(
  month: number,
  year: number
): { month: number; year: number } {
  if (month === 1) {
    return { month: 12, year: year - 1 };
  }
  return { month: month - 1, year };
}

export function getNextMonth(
  month: number,
  year: number
): { month: number; year: number } {
  if (month === 12) {
    return { month: 1, year: year + 1 };
  }
  return { month: month + 1, year };
}

export function savingsRateColor(rate: number): string {
  if (rate < 0) {
    return "text-red-600";
  }
  if (rate < 10) {
    return "text-orange-500";
  }
  if (rate < 20) {
    return "text-yellow-500";
  }
  return "text-green-600";
}
