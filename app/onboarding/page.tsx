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
                <h1 className="onboarding-title">Welcome to finasaan,</h1>
                <p className="onboarding-subtitle">
                    We will ask you a few questions to personalize your experience.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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

            <p className="onboarding-tagline">
                Start your financial literacy journey at finasaan.
            </p>
        </OnboardingLayout>
    );
}
