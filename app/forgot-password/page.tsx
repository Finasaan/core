"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout, FormInput } from "@/components/auth";
import "@/app/dashboard/settings/settings.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    redirectTo: `${window.location.origin}/update-password`,
                }),
            });
            const data = (await res.json()) as { success: boolean; error?: string };
            if (!res.ok || !data.success) {
                setError(data.error ?? "Failed to send reset email.");
                return;
            }
            setSubmitted(true);
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            headerVariant="back"
            headerLinkText="Back to Login"
            headerLinkHref="/login"
        >
            <header className="auth-form-header">
                <h1 className="auth-form-title auth-form-title-dark">
                    Forgot Password?
                </h1>
                <p className="auth-form-subtitle">
                    Enter the email associated with your finasaan account and we'll send
                    you a link to reset your password.
                </p>
            </header>

            {submitted ? (
                <div className="auth-form-fields">
                    <div className="settings-message is-success" role="status">
                        If an account exists for <strong>{email}</strong>, a password
                        reset link is on its way. Check your inbox (and spam folder).
                    </div>
                    <Link
                        href="/login"
                        className="auth-primary-button"
                        style={{ textDecoration: "none" }}
                    >
                        Back to Sign In
                    </Link>
                </div>
            ) : (
                <form className="auth-form-fields" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error-message" role="alert">
                            {error}
                        </div>
                    )}

                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter Email Address"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className="auth-primary-button"
                        disabled={loading || !email}
                    >
                        {loading ? "Sending…" : "Send reset link"}
                    </button>
                </form>
            )}

            <p className="auth-terms-text">
                By continuing, you agree to our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
            </p>
        </AuthLayout>
    );
}
