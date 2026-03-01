"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OnboardingStartPage() {
    const [name, setName] = useState("");
    const router = useRouter();
    const { setDisplayName } = useOnboarding();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            // Save name to context
            setDisplayName(name.trim());
            // Proceed to step 1
            router.push("/onboarding/step-1");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <OnboardingLayout>
            <div className="onboarding-text-group">
                <h1 className="onboarding-title">
                    Welcome to <span className="onboarding-brand-fin">fin</span><span className="onboarding-brand-asaan">asaan</span>,
                </h1>
                <p className="onboarding-subtitle">
                    We will ask you a few questions to personalize your experience.
                </p>
            </div>

            <form id="onboarding-start-form" onSubmit={handleSubmit} style={{ width: "100%" }}>
                <input
                    type="text"
                    className="onboarding-input"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    required
                />
            </form>

            <button
                type="submit"
                form="onboarding-start-form"
                className={`step-button step-button-continue ${name.trim() ? "step-button-active" : ""}`}
                disabled={!name.trim()}
            >
                Get Started →
            </button>
        </OnboardingLayout>
    );
}
