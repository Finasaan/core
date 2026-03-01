"use client";

import Image from "next/image";

interface OnboardingLayoutProps {
    children: React.ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
    return (
        <div className="onboarding-layout">
            {/* Grid Background */}
            <div className="onboarding-grid-bg">
                <div className="onboarding-grid-lines" />
                <div className="onboarding-blob onboarding-blob-1" />
                <div className="onboarding-blob onboarding-blob-2" />
                <div className="onboarding-blob onboarding-blob-3" />
                <div className="onboarding-blob onboarding-blob-4" />
                <div className="onboarding-grid-blocks">
                    <div className="onboarding-grid-block onboarding-grid-block-1" />
                    <div className="onboarding-grid-block onboarding-grid-block-2" />
                    <div className="onboarding-grid-block onboarding-grid-block-3" />
                    <div className="onboarding-grid-block onboarding-grid-block-4" />
                    <div className="onboarding-grid-block onboarding-grid-block-5" />
                    <div className="onboarding-grid-block onboarding-grid-block-6" />
                    <div className="onboarding-grid-block onboarding-grid-block-7" />
                    <div className="onboarding-grid-block onboarding-grid-block-8" />
                </div>
            </div>

            {/* Header — logo only, no skip */}
            <header className="onboarding-header">
                <Image
                    src="/loginlogo.png"
                    alt="Finasaan"
                    width={140}
                    height={40}
                    priority
                />
            </header>

            {/* Main Content */}
            <main className="onboarding-main">
                <div className="onboarding-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
