"use client";

import { Button } from "@/components/ui/button";

const PROMPTS = [
  {
    label: "PSX Stocks",
    text: "What are the top performing stocks on the KSE-100 today?",
  },
  {
    label: "Mutual Funds",
    text: "Compare the best performing equity mutual funds in Pakistan",
  },
  {
    label: "Insurance",
    text: "Explain life insurance options available in Pakistan",
  },
  {
    label: "Portfolio",
    text: "Analyze my portfolio and suggest rebalancing strategies",
  },
];

interface WelcomeScreenProps {
  onPrompt: (text: string) => void;
}

export function WelcomeScreen({ onPrompt }: WelcomeScreenProps) {
  return (
    <div className="chat-welcome">
      <p className="chat-welcome__logo">Finasaan · AI Terminal</p>

      <div>
        <h1 className="chat-welcome__title">
          Your <span>financial intelligence</span> layer
        </h1>
        <p className="chat-welcome__subtitle">
          Ask about PSX stocks, mutual funds, and insurance — powered by live
          market data and your uploaded documents.
        </p>
      </div>

      <div className="chat-welcome__prompts">
        {PROMPTS.map((p) => (
          <button
            key={p.label}
            className="chat-welcome__prompt"
            onClick={() => onPrompt(p.text)}
          >
            <div className="chat-welcome__prompt-label">{p.label}</div>
            {p.text}
          </button>
        ))}
      </div>
    </div>
  );
}
