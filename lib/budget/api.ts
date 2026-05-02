import type {
  BudgetCategory,
  BudgetDashboardData,
  BudgetIncomeSource,
  BudgetPlan,
  BudgetTransaction,
  CreateIncomePayload,
  CreateTransactionPayload,
  MonthlyHistoryPoint,
  SavingsGoal,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const BASE = "/api/budget";

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

export async function fetchDashboard(
  month: number,
  year: number
): Promise<BudgetDashboardData> {
  return apiFetch<BudgetDashboardData>(`${BASE}/dashboard?month=${month}&year=${year}`);
}

export async function fetchHistory(months: number = 6): Promise<MonthlyHistoryPoint[]> {
  return apiFetch<MonthlyHistoryPoint[]>(`${BASE}/history?months=${months}`);
}

export async function fetchCategories(): Promise<BudgetCategory[]> {
  return apiFetch<BudgetCategory[]>(`${BASE}/categories`);
}

export async function createCategory(payload: {
  name: string;
  icon?: string;
  color?: string;
}): Promise<BudgetCategory> {
  return apiFetch<BudgetCategory>(`${BASE}/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch(`${BASE}/categories/${id}`, { method: "DELETE" });
}

export async function fetchIncome(
  month: number,
  year: number
): Promise<BudgetIncomeSource[]> {
  return apiFetch<BudgetIncomeSource[]>(`${BASE}/income?month=${month}&year=${year}`);
}

export async function createIncome(
  payload: CreateIncomePayload
): Promise<BudgetIncomeSource> {
  return apiFetch<BudgetIncomeSource>(`${BASE}/income`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateIncome(
  id: string,
  payload: Partial<CreateIncomePayload>
): Promise<BudgetIncomeSource> {
  return apiFetch<BudgetIncomeSource>(`${BASE}/income/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteIncome(id: string): Promise<void> {
  await apiFetch(`${BASE}/income/${id}`, { method: "DELETE" });
}

export async function fetchTransactions(params: {
  month?: number;
  year?: number;
  category_id?: string;
  type?: string;
  description_contains?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: BudgetTransaction[]; total: number }> {
  const search = new URLSearchParams();
  if (params.month !== undefined) search.set("month", String(params.month));
  if (params.year !== undefined) search.set("year", String(params.year));
  if (params.category_id) search.set("category_id", params.category_id);
  if (params.type) search.set("type", params.type);
  if (params.description_contains) {
    search.set("description_contains", params.description_contains);
  }
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.offset !== undefined) search.set("offset", String(params.offset));

  return apiFetch<{ data: BudgetTransaction[]; total: number }>(
    `${BASE}/transactions?${search.toString()}`
  );
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<BudgetTransaction> {
  return apiFetch<BudgetTransaction>(`${BASE}/transactions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTransaction(
  id: string,
  payload: Partial<CreateTransactionPayload>
): Promise<BudgetTransaction> {
  return apiFetch<BudgetTransaction>(`${BASE}/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiFetch(`${BASE}/transactions/${id}`, { method: "DELETE" });
}

export async function classifyTransactionDescription(description: string): Promise<{ category_slug: string; confidence: number }> {
  return apiFetch<{ category_slug: string; confidence: number }>(`${BASE}/classify?description=${encodeURIComponent(description)}`);
}

export async function fetchBudgetPlans(
  month: number,
  year: number
): Promise<BudgetPlan[]> {
  return apiFetch<BudgetPlan[]>(`${BASE}/plans?month=${month}&year=${year}`);
}

export async function upsertBudgetPlan(payload: {
  category_id: string | null;
  planned_amount: number;
  month: number;
  year: number;
}): Promise<BudgetPlan> {
  return apiFetch<BudgetPlan>(`${BASE}/plans`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchSavingsGoals(): Promise<SavingsGoal[]> {
  return apiFetch<SavingsGoal[]>(`${BASE}/savings/goals`);
}

export async function createSavingsGoal(payload: {
  goal_name: string;
  target_amount: number;
  current_amount?: number;
  target_date?: string;
}): Promise<SavingsGoal> {
  return apiFetch<SavingsGoal>(`${BASE}/savings/goals`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateSavingsGoal(
  id: string,
  payload: Partial<{
    goal_name: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
  }>
): Promise<SavingsGoal> {
  return apiFetch<SavingsGoal>(`${BASE}/savings/goals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteSavingsGoal(id: string): Promise<void> {
  await apiFetch(`${BASE}/savings/goals/${id}`, { method: "DELETE" });
}
