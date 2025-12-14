import { Metadata } from "next";
import Link from "next/link";
import {
    AuthLayout,
    FormInput,
} from "@/components/auth";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Set a new password for your Finasaan account.",
};

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            headerPrompt="Don't have an account?"
            headerLinkText="Sign Up"
            headerLinkHref="/signup"
        >
            <header className="auth-form-header">
                <h1 className="auth-form-title auth-form-title-dark">Reset Password</h1>
                <p className="auth-form-subtitle">
                    Update your finasaan account&apos;s security with a stronger password.
                </p>
            </header>

            <form className="auth-form-fields">
                <FormInput
                    label="New Password"
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    autoComplete="new-password"
                    required
                />

                <FormInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter Password"
                    autoComplete="new-password"
                    required
                />

                <button type="submit" className="auth-primary-button">
                    Reset Password
                </button>
            </form>

            <p className="auth-terms-text">
                By continuing, you agree to our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
            </p>
        </AuthLayout>
    );
}
