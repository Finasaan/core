"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { budgetAiApi } from "@/lib/budget/ai.api";
import { 
  NLQueryResponse, SpendingInsight, BudgetSuggestion 
} from "@/lib/budget/ai.types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: NLQueryResponse;
}

interface BudgetAIContextType {
  // Panel State
  isPanelOpen: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;

  // Chat/Query State
  messages: ChatMessage[];
  isQuerying: boolean;
  sendMessage: (query: string) => Promise<void>;
  clearChat: () => void;

  // Insights State
  insights: SpendingInsight[];
  isInsightsLoading: boolean;
  fetchInsights: (month: number, year: number) => Promise<void>;

  // Suggestions State
  suggestions: BudgetSuggestion[];
  isSuggestionsLoading: boolean;
  fetchSuggestions: (month: number, year: number) => Promise<void>;
}

const BudgetAIContext = createContext<BudgetAIContextType | undefined>(undefined);

export function BudgetAIProvider({ children }: { children: React.ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const togglePanel = () => setIsPanelOpen(prev => !prev);
  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  const clearChat = () => setMessages([]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || isQuerying) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsQuerying(true);

    try {
      // Collect context from previous response if any
      const lastAiMsg = [...messages].reverse().find(m => m.role === "assistant");
      const frontend_context = lastAiMsg?.data?.parsed_filter ? {
        last_category: lastAiMsg.data.parsed_filter.category_slug,
        last_date_range: lastAiMsg.data.parsed_filter.date_range_label,
        last_metric: lastAiMsg.data.parsed_filter.metric,
      } : undefined;

      const result = await budgetAiApi.query(query, frontend_context);
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: result.explanation,
        timestamp: new Date(),
        data: result,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsQuerying(false);
    }
  };

  const fetchInsights = async (month: number, year: number) => {
    setIsInsightsLoading(true);
    try {
      const res = await budgetAiApi.getInsights(month, year);
      setInsights(res.insights);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const fetchSuggestions = async (month: number, year: number) => {
    setIsSuggestionsLoading(true);
    try {
      const res = await budgetAiApi.getSuggestions(month, year);
      setSuggestions(res.suggestions);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  return (
    <BudgetAIContext.Provider
      value={{
        isPanelOpen,
        togglePanel,
        openPanel,
        closePanel,
        messages,
        isQuerying,
        sendMessage,
        clearChat,
        insights,
        isInsightsLoading,
        fetchInsights,
        suggestions,
        isSuggestionsLoading,
        fetchSuggestions,
      }}
    >
      {children}
    </BudgetAIContext.Provider>
  );
}

export function useBudgetAI() {
  const context = useContext(BudgetAIContext);
  if (context === undefined) {
    throw new Error("useBudgetAI must be used within a BudgetAIProvider");
  }
  return context;
}
