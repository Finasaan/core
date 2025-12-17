"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout, ChipSelect } from "@/components/onboarding";
import { useOnboarding } from "@/context/OnboardingContext";

const topicOptions = [
    { value: "stock_market", label: "Stock Market" },
    { value: "personal_finance", label: "Personal Finance" },
    { value: "crypto", label: "Crypto" },
    { value: "saving", label: "Saving" },
    { value: "budgeting", label: "Budgeting" },
    { value: "government_support", label: "Government Support" },
    { value: "retirement", label: "Retirement" },
    { value: "real_estate", label: "Real Estate" },
];

export default function OnboardingStep3Page() {
    const [selected, setSelected] = useState<string[]>([]);
    const router = useRouter();
    const { setInterests, isSaving } = useOnboarding();

    const handleContinue = async () => {
        if (selected.length > 0 && !isSaving) {
            // Save selection to context AND persist to spine
            const success = await setInterests(selected);
            if (success) {
                // Navigate to loading page for final submission
                router.push("/onboarding/loading");
            }
        }
    };

    const handleBack = () => {
        router.push("/onboarding/step-2");
    };

    return (
        <OnboardingLayout showSkip>
            <div className="step-header">
                <h1 className="onboarding-title">What would you like to learn about?</h1>
                <p className="onboarding-subtitle">
                    Select all options that interest you (you can always change this later in the settings).
                </p>
            </div>

            <ChipSelect
                options={topicOptions}
                selected={selected}
                onChange={setSelected}
            />

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
                    className={`step-button step-button-continue ${selected.length > 0 ? "step-button-active" : ""}`}
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                >
                    Continue
                </button>
            </div>
        </OnboardingLayout>
    );
}
