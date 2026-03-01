"use client";

interface OnboardingLayoutProps {
    children: React.ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
    return (
        <div className="onboarding-layout">
            {/* Background glow */}
            <div className="onboarding-bg-glow" aria-hidden="true" />

            {/* Header — JSX text logo */}
            <header className="onboarding-header">
                <span className="onboarding-logo-text">
                    <span className="onboarding-brand-fin">fin</span><span className="onboarding-brand-asaan">asaan</span>
                </span>
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
