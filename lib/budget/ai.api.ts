const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const BASE = "/api/budget/ai";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = (await response.json()) as {
    success: boolean;
    data?: T;
    error?: string;
  };

  if (!result.success) {
    throw new Error(result.error || "API request failed");
  }

  return result.data as T;
}

import type { 
  NLQueryRequest, NLQueryResponse, 
  InsightsResponse, SuggestionsResponse 
} from "./ai.types";

export const budgetAiApi = {
  // Natural Language Query
  query: async (query: string, frontend_context?: NLQueryRequest["frontend_context"]): Promise<NLQueryResponse> => {
    return apiFetch<NLQueryResponse>(`${BASE}/query`, {
      method: "POST",
      body: JSON.stringify({ query, frontend_context }),
    });
  },

  // Get Insights
  getInsights: async (month: number, year: number): Promise<InsightsResponse> => {
    return apiFetch<InsightsResponse>(`${BASE}/insights?month=${month}&year=${year}`);
  },

  // Get Suggestions
  getSuggestions: async (month: number, year: number): Promise<SuggestionsResponse> => {
    return apiFetch<SuggestionsResponse>(`${BASE}/suggestions?month=${month}&year=${year}`);
  },
};
