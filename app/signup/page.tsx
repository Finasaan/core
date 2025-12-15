"use client";

// Skip static generation - requires runtime env vars for Supabase
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    AuthLayout,
    FormInput,
    SocialLoginButton,
    AuthDivider,
} from "@/components/auth";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Redirect URL after email verification
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                return;
            }

            // Store email in sessionStorage for the verify page
            sessionStorage.setItem("signup_email", email);

            // Redirect to verify page
            router.push("/signup/verify");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            headerPrompt="Already have an account?"
            headerLinkText="Login"
            headerLinkHref="/login"
        >
            <header className="auth-form-header">
                <h1 className="auth-form-title auth-form-title-dark">
                    Welcome to fin<span className="auth-form-title-primary">asaan</span>
                </h1>
                <p className="auth-form-subtitle">
                    Start your financial literacy journey at finasaan.
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

                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Create Password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />

                <FormInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter Password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />

                <button
                    type="submit"
                    className="auth-primary-button"
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Continue"}
                </button>
            </form>

            <p className="auth-terms-text">
                By continuing, you agree to our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
            </p>

            <AuthDivider />

            <SocialLoginButton provider="google" />
        </AuthLayout>
    );
}
