"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import "@/app/auth.css";

interface AuthLayoutProps {
    children: ReactNode;
    headerPrompt?: string;
    headerLinkText?: string;
    headerLinkHref?: string;
    headerVariant?: "default" | "back";
}

export function AuthLayout({
    children,
    headerPrompt = "Don't have an account?",
    headerLinkText = "Sign Up",
    headerLinkHref = "/signup",
    headerVariant = "default",
}: AuthLayoutProps) {
    return (
        <div className="auth-page">
            {/* Top bar */}
            <header className="auth-header">
                {/* Logo — links to home */}
                <Link href="/" className="auth-logo-link" aria-label="Go to Finasaan home">
                    <Image
                        src="/logo.png"
                        alt="Finasaan"
                        width={130}
                        height={40}
                        priority
                    />
                </Link>

                {/* Right side — sign in / sign up prompt */}
                {headerVariant === "default" ? (
                    <div className="auth-header-right">
                        <span className="auth-header-prompt">{headerPrompt}</span>
                        <Link href={headerLinkHref} className="auth-header-link">
                            {headerLinkText}
                        </Link>
                    </div>
                ) : (
                    <Link href={headerLinkHref} className="auth-back-link">
                        <span className="auth-back-text">{headerLinkText}</span>
                    </Link>
                )}
            </header>

            {/* Centered form */}
            <main className="auth-main">
                <div className="auth-card">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="auth-footer">
                <span className="auth-footer-copyright">© {new Date().getFullYear()} finasaan</span>
                <Link href="/contact" className="auth-footer-link">Contact Us</Link>
            </footer>
        </div>
    );
}
