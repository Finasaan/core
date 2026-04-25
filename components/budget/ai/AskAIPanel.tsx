"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Trash2, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useBudgetAI } from "@/context/BudgetAIContext";
import "./budget-ai.css";

export function AskAIPanel() {
  const { 
    isPanelOpen, closePanel, messages, 
    sendMessage, isQuerying, clearChat 
  } = useBudgetAI();
  
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isQuerying]);

  if (!isPanelOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isQuerying) return;
    const currentInput = input;
    setInput("");
    await sendMessage(currentInput);
  };

  return (
    <div className="ai-panel-overlay" onClick={closePanel}>
      <div className="ai-panel" onClick={e => e.stopPropagation()}>
        <div className="ai-panel-header">
          <div className="ai-header-title">
            <Sparkles className="ai-sparkle-icon" size={20} />
            <h2>Asaan Budgeting</h2>
          </div>
          <div className="ai-header-actions">
            <button onClick={clearChat} title="Clear Chat" className="ai-action-btn">
              <Trash2 size={18} />
            </button>
            <button onClick={closePanel} className="ai-close-btn">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="ai-chat-container" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="ai-empty-state">
              <div className="ai-empty-icon">
                <MessageSquare size={48} />
              </div>
              <h3>Ask me anything</h3>
              <p>Try: "How much did I spend on groceries this month?" or "Show me expenses over 5000 in last 3 months."</p>
              
              <div className="ai-suggestions">
                <button onClick={() => sendMessage("Show me my total spend this month")}>
                  Total spend this month
                </button>
                <button onClick={() => sendMessage("What is my average monthly spending?")}>
                  Average monthly spending
                </button>
                <button onClick={() => sendMessage("List my transactions in Groceries")}>
                  Recent Groceries
                </button>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`ai-message ${m.role}`}>
                <div className="ai-message-bubble">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                  {m.data?.aggregation?.metric === "list" && m.data.aggregation.transactions.length > 0 && (
                    <div className="ai-inline-list">
                      {m.data.aggregation.transactions.map(t => (
                        <div key={t.id} className="ai-list-item">
                          <span className="ai-item-desc">{t.description}</span>
                          <span className="ai-item-amount">PKR {t.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.data?.aggregation?.category_totals && m.data.aggregation.category_totals.length > 0 && (
                    <div className="ai-category-breakdown">
                      <div className="ai-breakdown-title">Spending Breakdown</div>
                      {m.data.aggregation.category_totals.map(cat => {
                        const maxAmount = m.data?.aggregation?.category_totals?.[0]?.amount || 1;
                        const percentage = (cat.amount / maxAmount) * 100;
                        return (
                          <div key={cat.category_name} className="ai-breakdown-item">
                            <div className="ai-breakdown-info">
                              <span className="ai-breakdown-name">{cat.category_name}</span>
                              <span className="ai-breakdown-amount">PKR {cat.amount.toLocaleString()}</span>
                            </div>
                            <div className="ai-breakdown-bar-bg">
                              <div 
                                className="ai-breakdown-bar-fill" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="ai-message-time">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
          
          {isQuerying && (
            <div className="ai-message assistant">
              <div className="ai-message-bubble loading">
                <div className="ai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form className="ai-input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your query..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isQuerying}
            autoFocus
          />
          <button type="submit" disabled={!input.trim() || isQuerying}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
