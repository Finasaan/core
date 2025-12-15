import Link from "next/link";
import { ReactNode } from "react";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { ProfileIcon } from "./ProfileIcon";
import { ArrowLeftIcon } from "./ArrowLeftIcon";
import "@/app/auth.css";

interface AuthLayoutProps {
    children: ReactNode;
    heroTagline?: string;
    heroTestimonial?: string;
    headerPrompt?: string;
    headerLinkText?: string;
    headerLinkHref?: string;
    /** Variant: 'default' shows prompt + link on right, 'back' shows back arrow + link on left of form */
    headerVariant?: "default" | "back";
}

export function AuthLayout({
    children,
    heroTagline,
    heroTestimonial,
    headerPrompt = "Don't have an account?",
    headerLinkText = "Sign Up",
    headerLinkHref = "/signup",
    headerVariant = "default",
}: AuthLayoutProps) {
    return (
        <div className="auth-page">
            <header className="auth-header">
                {headerVariant === "default" ? (
                    <div className="auth-header-right">
                        <span className="auth-header-prompt">{headerPrompt}</span>
                        <Link href={headerLinkHref} className="auth-header-link">
                            <ProfileIcon className="auth-profile-icon" />
                            <span className="auth-header-link-text">{headerLinkText}</span>
                        </Link>
                    </div>
                ) : (
                    <Link href={headerLinkHref} className="auth-back-link">
                        <ArrowLeftIcon className="auth-back-icon" />
                        <span className="auth-back-text">{headerLinkText}</span>
                    </Link>
                )}
            </header>

            <main className="auth-container">
                <AuthHeroPanel tagline={heroTagline} testimonial={heroTestimonial} />

                <section className="auth-form-panel">
                    <div className="auth-form-container">
                        {children}
                    </div>
                </section>
            </main>

            <footer className="auth-footer">
                <span className="auth-footer-copyright">© 2025 finasaan</span>
                <Link href="/contact" className="auth-footer-link">
                    Contact Us
                </Link>
            </footer>
        </div>
    );
}

