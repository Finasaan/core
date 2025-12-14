"use client";

import Image from "next/image";
import { OnboardingLayout } from "@/components/onboarding";

export default function OnboardingLoadingPage() {
    return (
        <OnboardingLayout>
            <div className="loading-container">
                <div className="loading-spinner">
                    <Image
                        src="/loading.svg"
                        alt="Loading"
                        width={96}
                        height={96}
                        className="loading-icon"
                        priority
                    />
                </div>
                <p className="loading-text">Please Wait...</p>
            </div>

            <div className="loading-fact-card">
                <p className="loading-fact-text">
                    One study suggests that there are a mere 2.2 investors for every 1000 people
                    in Pakistan, learn how to invest and stay ahead of the curve with finasaan.
                </p>
            </div>
        </OnboardingLayout>
    );
}
