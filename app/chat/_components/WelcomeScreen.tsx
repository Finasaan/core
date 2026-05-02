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
  interests?: string[];
}

export function WelcomeScreen({ onPrompt, interests = [] }: WelcomeScreenProps) {
  // Personalized prompts based on interests
  const personalizedPrompts = [
    ...PROMPTS,
    ...(interests.includes("technology") ? [{ label: "Tech Sector", text: "How is the technology sector performing on PSX right now?" }] : []),
    ...(interests.includes("banking") ? [{ label: "Banking", text: "Show me the top dividend paying banks on PSX" }] : []),
    ...(interests.includes("energy") ? [{ label: "Energy", text: "What's the outlook for oil and gas stocks in Pakistan?" }] : []),
  ].slice(0, 5); // Keep it clean

  return (
    <div className="chat-welcome">
      <p className="chat-welcome__logo">Finasaan · AI Terminal</p>

      <div>
        <h1 className="chat-welcome__title">
          Your <span>financial intelligence</span> layer
        </h1>
        <p className="chat-welcome__subtitle">
          {interests.length > 0 
            ? `Tailored to your interests in ${interests.join(", ")} — ask anything.`
            : "Ask about PSX stocks, mutual funds, and insurance — powered by live market data."}
        </p>
      </div>

      <div className="chat-welcome__prompts">
        {personalizedPrompts.map((p) => (
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
