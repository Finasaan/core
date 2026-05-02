"use client";

import React from "react";
import { Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";
import { BudgetSuggestion } from "@/lib/budget/ai.types";
import "./budget-ai.css";

interface SuggestionCardProps {
  suggestion: BudgetSuggestion;
  onApply?: (suggestion: BudgetSuggestion) => void;
}

export function SuggestionCard({ suggestion, onApply }: SuggestionCardProps) {
  const diff = suggestion.suggested_budget - suggestion.current_budget;
  const isIncrease = diff > 0;

  return (
    <div className="suggestion-card">
      <div className="suggestion-ribbon"> Recommendation </div>
      <div className="suggestion-card-content">
        <div className="suggestion-main-row">
          <div className="suggestion-icon-box">
             <Lightbulb size={24} className="text-green-600" />
          </div>
          <div className="suggestion-header-text">
            <h4>{suggestion.category_name}</h4>
            <div className="suggestion-reason-badge">
              {suggestion.reason.replace("_", " ")}
            </div>
          </div>
        </div>

        <p className="suggestion-explanation">{suggestion.explanation}</p>

        <div className="suggestion-compare">
          <div className="compare-item">
            <span>Current</span>
            <span className="val original">PKR {suggestion.current_budget.toLocaleString()}</span>
          </div>
          <ArrowRight size={16} className="compare-arrow" />
          <div className="compare-item">
            <span>Suggested</span>
            <span className="val suggested">PKR {suggestion.suggested_budget.toLocaleString()}</span>
          </div>
        </div>

        <button 
          className="suggestion-apply-btn"
          onClick={() => onApply?.(suggestion)}
        >
          <CheckCircle2 size={18} />
          <span>Apply Suggestion</span>
        </button>
      </div>
    </div>
  );
}
