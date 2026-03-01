"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout, ChoiceCard } from "@/components/onboarding";
import { useOnboarding } from "@/context/OnboardingContext";

type Choice = "guided" | "explore" | null;

const choices = [
    {
        id: "guided" as const,
        icon: "/guidedstart.svg",
        title: "Guided Start",
        description: "A quick walkthrough of everything Finasaan offers.",
        iconWidth: 80,
        iconHeight: 80,
    },
    {
        id: "explore" as const,
        icon: "/explore.svg",
        title: "Explore on my own",
        description: "Go straight to your dashboard.",
        iconWidth: 80,
        iconHeight: 80,
    },
];

export default function OnboardingCompletePage() {
    const [selected, setSelected] = useState<Choice>(null);
    const router = useRouter();
    const { data } = useOnboarding();

    // Get user name from context, fallback to "there" if not set
    const userName = data.displayName || "there";

    const handleContinue = () => {
        if (selected === "guided") {
            // TODO: Navigate to guided tour
            router.push("/dashboard?tour=true");
        } else if (selected === "explore") {
            router.push("/dashboard");
        }
    };

    const handleBack = () => {
        router.push("/onboarding/step-3");
    };

    return (
        <OnboardingLayout>
            <div className="step-header">
                <h1 className="onboarding-title">Welcome aboard, {userName}.</h1>
                <p className="onboarding-subtitle">
                    How would you like to get started?
                </p>
            </div>

            <div className="choice-cards">
                {choices.map((choice) => (
                    <ChoiceCard
                        key={choice.id}
                        icon={choice.icon}
                        title={choice.title}
                        description={choice.description}
                        selected={selected === choice.id}
                        onClick={() => setSelected(choice.id)}
                        iconWidth={choice.iconWidth}
                        iconHeight={choice.iconHeight}
                    />
                ))}
            </div>

            <p className="step-help-text">
                You can revisit the guided tour anytime from settings.
            </p>

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
