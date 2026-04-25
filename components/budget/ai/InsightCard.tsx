"use client";

import React from "react";
import { TrendingUp, TrendingDown, PieChart, Sparkles } from "lucide-react";
import { SpendingInsight } from "@/lib/budget/ai.types";
import "./budget-ai.css";

interface InsightCardProps {
  insight: SpendingInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const isIncrease = insight.type === "increase";
  const isDecrease = insight.type === "decrease";
  const isDominance = insight.type === "dominance";
  const isNew = insight.type === "new_spending";

  const getIcon = () => {
    if (isIncrease) return <TrendingUp size={20} className="text-red-500" />;
    if (isDecrease) return <TrendingDown size={20} className="text-green-500" />;
    if (isDominance) return <PieChart size={20} className="text-blue-500" />;
    return <Sparkles size={20} className="text-green-600" />;
  };

  return (
    <div className="insight-card">
      <div className="insight-card-header">
        <div className="insight-category-icon" style={{ backgroundColor: `${insight.category_color}20`, color: insight.category_color }}>
          {insight.category_icon || "💰"}
        </div>
        <div className="insight-title-group">
          <span className="insight-category-name">{insight.category_name}</span>
          <div className="insight-badge-row">
             <div className={`insight-type-badge ${insight.type}`}>
               {getIcon()}
               <span>{insight.type.replace("_", " ")}</span>
             </div>
             {insight.pct_change !== null && (
               <span className={`insight-pct ${insight.pct_change > 0 ? 'up' : 'down'}`}>
                 {insight.pct_change > 0 ? '+' : ''}{insight.pct_change}%
               </span>
             )}
          </div>
        </div>
      </div>
      
      <p className="insight-explanation">{insight.explanation}</p>
      
      <div className="insight-footer">
        <div className="insight-stat">
          <span className="stat-label">This Month</span>
          <span className="stat-value">PKR {insight.current_amount.toLocaleString()}</span>
        </div>
        {insight.previous_amount !== null && (
          <div className="insight-stat">
            <span className="stat-label">Last Month</span>
            <span className="stat-value">PKR {insight.previous_amount.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
