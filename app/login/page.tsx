import { Metadata } from "next";
import Link from "next/link";
import {
    AuthLayout,
    FormInput,
    SocialLoginButton,
    AuthDivider,
} from "@/components/auth";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your Finasaan account and continue your financial literacy journey.",
};

export default function LoginPage() {
    return (
        <AuthLayout
            headerPrompt="Don't have an account?"
            headerLinkText="Sign Up"
            headerLinkHref="/signup"
        >
            <header className="auth-form-header">
                <h1 className="auth-form-title">Welcome <span className="auth-form-title-dark">Back</span></h1>
                <p className="auth-form-subtitle">
                    Resume your financial literacy journey at finasaan.
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
                    />
                </div>

                <button type="submit" className="auth-primary-button">
                    Login
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
