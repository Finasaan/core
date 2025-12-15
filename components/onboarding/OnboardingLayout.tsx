"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

interface OnboardingLayoutProps {
    children: React.ReactNode;
    showSkip?: boolean;
}

export function OnboardingLayout({ children, showSkip = false }: OnboardingLayoutProps) {
    const router = useRouter();
    const { submitProfile, isSubmitting } = useOnboarding();

    const handleSkip = async () => {
        // Submit whatever data we have so far
        await submitProfile();
        // Navigate to complete page
        router.push("/onboarding/complete");
    };

    return (
        <div className="onboarding-layout">
            {/* Grid Background */}
            <div className="onboarding-grid-bg">
                {/* Grid Lines */}
                <div className="onboarding-grid-lines" />

                {/* Decorative Blobs */}
                <div className="onboarding-blob onboarding-blob-1" />
                <div className="onboarding-blob onboarding-blob-2" />
                <div className="onboarding-blob onboarding-blob-3" />
                <div className="onboarding-blob onboarding-blob-4" />

                {/* Grid Accent Blocks */}
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

            {/* Header */}
            <header className="onboarding-header">
                <Image
                    src="/loginlogo.png"
                    alt="Finasaan"
                    width={140}
                    height={40}
                    priority
                />
                {showSkip && (
                    <button
                        onClick={handleSkip}
                        disabled={isSubmitting}
                        className="onboarding-skip-link"
                    >
                        {isSubmitting ? "Saving..." : "Skip for now"}
                    </button>
                )}
            </header>

            {/* Main Content */}
            <main className="onboarding-main">
                <div className="onboarding-content">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="onboarding-footer">
                <p className="onboarding-copyright">© 2025 finasaan</p>
                <Link href="/contact" className="onboarding-contact-link">
                    Contact Us
                </Link>
            </footer>
        </div>
    );
}
