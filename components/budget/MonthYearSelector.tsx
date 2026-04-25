"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMonthName } from "@/lib/budget/utils";

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export function MonthYearSelector({ month, year, onChange }: MonthYearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={String(month)}
        onValueChange={(value) => onChange(Number(value), year)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, index) => {
            const monthValue = index + 1;
            return (
              <SelectItem key={monthValue} value={String(monthValue)}>
                {getMonthName(monthValue)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select
        value={String(year)}
        onValueChange={(value) => onChange(month, Number(value))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((yearValue) => (
            <SelectItem key={yearValue} value={String(yearValue)}>
              {yearValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
