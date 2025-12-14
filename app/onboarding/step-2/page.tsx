"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout, OnboardingSelect } from "@/components/onboarding";

const professionOptions = [
    { value: "student", label: "Student" },
    { value: "working_professional", label: "Working Professional" },
    { value: "self_employed", label: "Self Employed" },
    { value: "freelancer", label: "Freelancer" },
    { value: "retired", label: "Retired" },
    { value: "other", label: "Other" },
];

export default function OnboardingStep2Page() {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();

    const handleContinue = () => {
        if (selected) {
            // TODO: Save selection to state/context
            router.push("/onboarding/loading?next=/onboarding/step-3");
        }
    };

    const handleBack = () => {
        router.push("/onboarding/step-1");
    };

    return (
        <OnboardingLayout showSkip>
            <div className="step-header">
                <h1 className="onboarding-title">What best describes you?</h1>
                <p className="onboarding-subtitle">
                    This helps us tailor your financial learning experience. Don't worry you can change this later in the settings.
                </p>
            </div>

            <OnboardingSelect
                options={professionOptions}
                value={selected}
                onChange={setSelected}
                placeholder="Please Select"
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
