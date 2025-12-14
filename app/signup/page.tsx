import { Metadata } from "next";
import Link from "next/link";
import {
    AuthLayout,
    FormInput,
    SocialLoginButton,
    AuthDivider,
} from "@/components/auth";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your Finasaan account and start your financial literacy journey.",
};

export default function SignupPage() {
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

            <form className="auth-form-fields">
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    autoComplete="email"
                    required
                />

                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Create Password"
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
                    Continue
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
