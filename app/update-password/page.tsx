"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout, FormInput } from "@/components/auth";
import "@/app/dashboard/settings/settings.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tokenChecked, setTokenChecked] = useState(false);
    const [tokenError, setTokenError] = useState<string | null>(null);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Supabase recovery links land here as either:
    //   /update-password#access_token=...&refresh_token=...&type=recovery
    // or, on PKCE-style projects:
    //   /update-password?code=...
    // We support the implicit hash flow (most common for resetPasswordForEmail).
    useEffect(() => {
        if (typeof window === "undefined") return;

        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.slice(1));
            const token = params.get("access_token");
            const type = params.get("type");
            const errDesc = params.get("error_description") || params.get("error");

            if (errDesc) {
                setTokenError(decodeURIComponent(errDesc.replace(/\+/g, " ")));
            } else if (token && type === "recovery") {
                setAccessToken(token);
                // Strip the hash so the token isn't sitting in the address bar
                window.history.replaceState(null, "", window.location.pathname);
            } else if (token) {
                // Some Supabase configs omit type — accept any access_token here too
                setAccessToken(token);
                window.history.replaceState(null, "", window.location.pathname);
            } else {
                setTokenError("This reset link is missing required information.");
            }
        } else {
            setTokenError(
                "This page should be opened from the password reset link in your email."
            );
        }

        setTokenChecked(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!accessToken) {
            setError("Reset token is missing.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken, newPassword }),
            });
            const data = (await res.json()) as { success: boolean; error?: string };
            if (!res.ok || !data.success) {
                setError(data.error ?? "Failed to update password.");
                return;
            }
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2200);
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
                    Set a new password
                </h1>
                <p className="auth-form-subtitle">
                    Choose a strong password you don't reuse on other sites.
                </p>
            </header>

            {!tokenChecked ? (
                <div className="auth-form-fields">
                    <p className="auth-form-subtitle">Verifying reset link…</p>
                </div>
            ) : tokenError ? (
                <div className="auth-form-fields">
                    <div className="auth-error-message" role="alert">
                        {tokenError}
                    </div>
                    <Link
                        href="/forgot-password"
                        className="auth-primary-button"
                        style={{ textDecoration: "none" }}
                    >
                        Request a new link
                    </Link>
                </div>
            ) : success ? (
                <div className="auth-form-fields">
                    <div className="settings-message is-success" role="status">
                        Password updated. Redirecting you to sign in…
                    </div>
                </div>
            ) : (
                <form className="auth-form-fields" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error-message" role="alert">
                            {error}
                        </div>
                    )}

                    <FormInput
                        label="New password"
                        type="password"
                        name="new_password"
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                    />

                    <FormInput
                        label="Confirm new password"
                        type="password"
                        name="confirm_password"
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className="auth-primary-button"
                        disabled={loading || !newPassword || !confirmPassword}
                    >
                        {loading ? "Updating…" : "Update password"}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
}
