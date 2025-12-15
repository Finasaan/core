"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    AuthLayout,
    FormInput,
    SocialLoginButton,
    AuthDivider,
} from "@/components/auth";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                return;
            }

            // Redirect to the originally requested page or dashboard
            const redirectTo = searchParams.get("redirect") || "/dashboard";
            router.push(redirectTo);
            router.refresh();
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="auth-form-header">
                <h1 className="auth-form-title">Welcome <span className="auth-form-title-dark">Back</span></h1>
                <p className="auth-form-subtitle">
                    Resume your financial literacy journey at finasaan.
                </p>
            </header>

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

                <div className="auth-password-wrapper">
                    <Link href="/forgot-password" className="auth-forgot-link">
                        Forgot Password?
                    </Link>
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="auth-primary-button"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>

            <p className="auth-terms-text">
                By continuing, you agree to our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
            </p>

            <AuthDivider />

            <SocialLoginButton provider="google" />
        </>
    );
}

export default function LoginPage() {
    return (
        <AuthLayout
            headerPrompt="Don't have an account?"
            headerLinkText="Sign Up"
            headerLinkHref="/signup"
        >
            <Suspense fallback={<div className="auth-loading">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </AuthLayout>
    );
}
