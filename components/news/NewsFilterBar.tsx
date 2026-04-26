"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { NewsFilters, NewsSentiment } from "@/lib/news";

interface Props {
  filters: NewsFilters;
  onFilterChange: (filters: NewsFilters) => void;
}

const SECTORS = [
  "Banking", "Cement", "Chemical", "Energy", "Fertilizer", 
  "Food & Beverages", "Insurance", "Oil & Gas", "Pharmaceuticals", 
  "Steel", "Technology", "Telecom", "Textile", "Real Estate", "Automobile"
];

export function NewsFilterBar({ filters, onFilterChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter by ticker (e.g. HBL)"
          className="pl-9 h-9 text-xs"
          value={filters.ticker || ""}
          onChange={(e) => onFilterChange({ ...filters, ticker: e.target.value })}
        />
      </div>

      <Select 
        value={filters.sentiment || "all"} 
        onValueChange={(val) => onFilterChange({ ...filters, sentiment: val === "all" ? undefined : val as NewsSentiment })}
      >
        <SelectTrigger className="w-full sm:w-40 h-9 text-xs">
          <SelectValue placeholder="Sentiment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sentiments</SelectItem>
          <SelectItem value="positive">Positive</SelectItem>
          <SelectItem value="negative">Negative</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.sector || "all"} 
        onValueChange={(val) => onFilterChange({ ...filters, sector: val === "all" ? undefined : val })}
      >
        <SelectTrigger className="w-full sm:w-48 h-9 text-xs">
          <SelectValue placeholder="Sector" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sectors</SelectItem>
          {SECTORS.map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
