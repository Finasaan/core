"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2Icon, CheckIcon, XIcon } from "lucide-react";

const TOOL_LABELS: Record<string, string> = {
  searchKnowledge: "SEARCHING KNOWLEDGE BASE",
  searchConversationDocument: "SCANNING DOCUMENT",
  getMarketSummary: "FETCHING MARKET SUMMARY",
  searchCompanies: "SEARCHING COMPANIES",
  getStockDetail: "LOADING STOCK DATA",
  getTopStocks: "FETCHING TOP STOCKS",
  searchMutualFunds: "SEARCHING MUTUAL FUNDS",
  getFundDetail: "LOADING FUND DATA",
  getTopFunds: "FETCHING TOP FUNDS",
  getUserPortfolio: "LOADING PORTFOLIO",
  getUserWatchlist: "LOADING WATCHLIST",
};

function getResultSummary(toolName: string, result: unknown): string {
  if (!result || typeof result !== "object") return "done";
  const r = result as Record<string, unknown>;
  if (r.error) return `error: ${r.error}`;

  if (toolName === "searchKnowledge" || toolName === "searchConversationDocument") {
    const items = r.results as unknown[] | undefined;
    return items?.length
      ? `${items.length} result${items.length !== 1 ? "s" : ""}`
      : "no results";
  }
  if (toolName === "getMarketSummary") {
    const kse = (r as { kse100?: { change_pct?: number } }).kse100;
    if (kse?.change_pct !== undefined) {
      const pct = kse.change_pct;
      return `KSE-100 ${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
    }
    return "loaded";
  }
  if (toolName === "searchCompanies" || toolName === "searchMutualFunds") {
    const items = r.results as unknown[] | undefined;
    return items?.length ? `${items.length} result${items.length !== 1 ? "s" : ""}` : "no results";
  }
  return "done";
}

interface ToolCallBlockProps {
  toolName: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-streaming";
  result?: unknown;
}

export function ToolCallBlock({ toolName, state, result }: ToolCallBlockProps) {
  const label = TOOL_LABELS[toolName] ?? toolName.toUpperCase().replace(/_/g, " ");
  const isRunning = state === "input-streaming" || state === "input-available" || state === "output-streaming";
  const isDone = state === "output-available";
  const hasError =
    isDone && result && typeof result === "object" && (result as Record<string, unknown>).error;

  return (
    <div className={`tool-call ${isRunning ? "tool-call--running" : hasError ? "tool-call--error" : "tool-call--done"}`}>
      {isRunning ? (
        <Loader2Icon size={11} className="flex-shrink-0 animate-spin" />
      ) : hasError ? (
        <XIcon size={11} className="flex-shrink-0" />
      ) : (
        <CheckIcon size={11} className="flex-shrink-0" />
      )}
      <span className="tool-call__text">
        {label}
        {isDone && !isRunning && (
          <span className="ml-2 opacity-60">— {getResultSummary(toolName, result)}</span>
        )}
        {isRunning && <span className="opacity-60">...</span>}
      </span>
    </div>
  );
}
