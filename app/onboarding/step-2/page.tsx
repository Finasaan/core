"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOnboarding } from "@/context/OnboardingContext";

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
    const { setOccupation } = useOnboarding();

    const handleContinue = () => {
        if (selected) {
            setOccupation(selected);
            router.push("/onboarding/step-3");
        }
    };

    const handleBack = () => {
        router.push("/onboarding/step-1");
    };

    return (
        <OnboardingLayout>
            <div className="step-header">
                <h1 className="onboarding-title">What best describes you?</h1>
                <p className="onboarding-subtitle">
                    This helps us tailor your financial learning experience. Don't worry you can change this later in the settings.
                </p>
            </div>

            <div className="onboarding-select-wrapper">
                <Select value={selected ?? ""} onValueChange={(v) => setSelected(v)}>
                    <SelectTrigger className="w-full h-[52px] bg-white/5 border-white/15 text-white font-[Satoshi,Inter,sans-serif] text-base focus:border-[#159F63] focus:ring-[#159F63]/20">
                        <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0D2E23] border-white/10 text-white">
                        {professionOptions.map((opt) => (
                            <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="text-white/80 focus:bg-white/8 focus:text-white data-[state=checked]:text-[#159F63]"
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
