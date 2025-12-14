"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout, ChoiceCard } from "@/components/onboarding";

type Choice = "guided" | "explore" | null;

const choices = [
    {
        id: "guided" as const,
        icon: "/guidedstart.svg",
        title: "Guided Start",
        description: "Take a quick tour to understand how Finasaan works",
        iconWidth: 254,
        iconHeight: 172,
    },
    {
        id: "explore" as const,
        icon: "/explore.svg",
        title: "Explore on my own",
        description: "Jump straight to your personalized dashboard",
        iconWidth: 135,
        iconHeight: 172,
    },
];

export default function OnboardingCompletePage() {
    const [selected, setSelected] = useState<Choice>(null);
    const router = useRouter();

    // TODO: Get user name from context/state
    const userName = "User";

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
                <h1 className="onboarding-title">You're all set, {userName}.</h1>
                <p className="onboarding-subtitle">
                    Your personalized learning journey is ready. Choose what you'd like to do next.
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
                You can always take the guided start tour from your account settings.
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
