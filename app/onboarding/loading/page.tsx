"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { OnboardingLayout } from "@/components/onboarding";

const facts = [
    "Only 21% of Pakistani adults have access to financial services. With finasaan, you can learn to make the most of what's available to you.",
    "Just 13% of Pakistan's population has a formal bank account. finasaan helps you understand banking and build your financial foundation.",
    "Less than 0.1% of Pakistanis participate in the stock market. Learn how to invest and stay ahead of the curve with finasaan.",
    "Only 8-10% of the population has insurance coverage. finasaan teaches you how to protect yourself and your family financially.",
];

export default function OnboardingLoadingPage() {
    const [currentFact, setCurrentFact] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            // Start fade out
            setIsFading(true);

            // After fade out, change fact and fade in
            setTimeout(() => {
                setCurrentFact((prev) => (prev + 1) % facts.length);
                setIsFading(false);
            }, 500);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

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
                <p className={`loading-fact-text ${isFading ? "fact-fading" : ""}`}>
                    {facts[currentFact]}
                </p>
            </div>
        </OnboardingLayout>
    );
}
