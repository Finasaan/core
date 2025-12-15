"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    AuthLayout,
} from "@/components/auth";

export default function SignupVerifyPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);

    // Get email from sessionStorage on mount
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("signup_email");
        if (!storedEmail) {
            // No email found, redirect to signup
            router.push("/signup");
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    if (!email) {
        return (
            <AuthLayout
                headerPrompt="Already have an account?"
                headerLinkText="Login"
                headerLinkHref="/login"
            >
                <div className="auth-loading">Loading...</div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            headerPrompt="Already have an account?"
            headerLinkText="Login"
            headerLinkHref="/login"
        >
            <header className="auth-form-header">
                <h1 className="auth-form-title auth-form-title-dark">Check Your Email</h1>
                <p className="auth-form-subtitle">
                    We&apos;ve sent a verification link to <strong>{email}</strong>.
                    Click the link in your email to verify your account and continue.
                </p>
            </header>

            <div className="auth-form-fields">
                <div className="auth-email-sent-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#159F63" />
                    </svg>
                </div>

                <p className="auth-verify-note">
                    Didn&apos;t receive the email? Check your spam folder or try signing up again.
                </p>

                <Link href="/signup" className="auth-primary-button" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Back to Sign Up
                </Link>
            </div>

            <p className="auth-terms-text">
                By continuing, you agree to our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
            </p>
        </AuthLayout>
    );
}
