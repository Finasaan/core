export type QueryMetric = "total" | "average" | "count" | "list";

export interface ParsedQueryFilter {
  user_id: string;
  type: "income" | "expense";
  date_from?: string;
  date_to?: string;
  month?: number;
  year?: number;
  category_id?: string;
  category_slug?: string;
  description_contains?: string;
  amount_min?: number;
  amount_max?: number;
  metric: QueryMetric;
  date_range_label: string;
}

export interface TransactionListItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_name: string;
  category_confidence?: number | null;
}

export interface QueryAggregation {
  metric: QueryMetric;
  value: number | null;
  currency: string;
  category_name: string | null;
  date_range_label: string;
  transaction_count: number;
  transactions: TransactionListItem[];
  category_totals?: Array<{ category_name: string; amount: number }>;
}

export interface NLQueryRequest {
  query: string;
  frontend_context?: {
    last_category?: string | null;
    last_date_range?: string | null;
    last_metric?: QueryMetric | null;
  };
}

export interface NLQueryResponse {
  original_query: string;
  parsed_filter: ParsedQueryFilter;
  aggregation: QueryAggregation;
  explanation: string;
  fallback: boolean;
}

export type InsightType = "increase" | "decrease" | "dominance" | "new_spending";

export interface SpendingInsight {
  type: InsightType;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  current_amount: number;
  previous_amount: number | null;
  pct_change: number | null;
  share_of_total: number;
  explanation: string;
}

export interface InsightsResponse {
  month: number;
  year: number;
  insights: SpendingInsight[];
  generated_at: string;
}

export type SuggestionReason = "consistent_overspend" | "severe_overspend" | "opportunity_to_save";

export interface BudgetSuggestion {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  current_budget: number;
  avg_spend_3m: number;
  suggested_budget: number;
  reason: SuggestionReason;
  explanation: string;
}

export interface SuggestionsResponse {
  month: number;
  year: number;
  suggestions: BudgetSuggestion[];
}
