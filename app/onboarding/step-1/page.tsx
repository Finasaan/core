"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout, SelectionCard } from "@/components/onboarding";
import { useOnboarding } from "@/context/OnboardingContext";

type KnowledgeLevel = "beginner" | "intermediate" | "advanced" | null;

const knowledgeLevels = [
    {
        id: "beginner" as const,
        icon: "/beginner.svg",
        title: "Beginner",
        description: "I'm new to investing and want to learn the basics to get started.",
    },
    {
        id: "intermediate" as const,
        icon: "/intermed.svg",
        title: "Intermediate",
        description: "I understand basic concepts and want to deepen my knowledge.",
    },
    {
        id: "advanced" as const,
        icon: "/advanced.svg",
        title: "Advanced",
        description: "I actively invest and want to optimize my portfolio.",
    },
];

export default function OnboardingStep1Page() {
    const [selected, setSelected] = useState<KnowledgeLevel>(null);
    const router = useRouter();
    const { setFinancialKnowledge } = useOnboarding();

    const handleContinue = () => {
        if (selected) {
            // Save selection to context
            setFinancialKnowledge(selected);
            // Navigate directly to step-2
            router.push("/onboarding/step-2");
        }
    };

    const handleBack = () => {
        router.push("/onboarding");
    };

    return (
        <OnboardingLayout>
            <div className="step-header">
                <h1 className="onboarding-title">
                    What's your financial knowledge level?
                </h1>
                <p className="onboarding-subtitle">
                    We'll tailor your experience to match. You can always update this later.
                </p>
            </div>

            <div className="step-cards">
                {knowledgeLevels.map((level) => (
                    <SelectionCard
                        key={level.id}
                        icon={level.icon}
                        title={level.title}
                        description={level.description}
                        selected={selected === level.id}
                        onClick={() => setSelected(level.id)}
                    />
                ))}
            </div>

            <div className="step-buttons">
                <button
                    type="button"
                    className="step-button step-button-back"
                    onClick={handleBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className={`step-button step-button-continue ${selected ? "step-button-active" : ""}`}
                    onClick={handleContinue}
                    disabled={!selected}
                >
                    Continue
                </button>
            </div>
        </OnboardingLayout>
    );
}
