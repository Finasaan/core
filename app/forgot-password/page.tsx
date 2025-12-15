import { Metadata } from "next";
import Link from "next/link";
import {
    AuthLayout,
    FormInput,
} from "@/components/auth";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your Finasaan account password by entering your email address.",
};

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            headerVariant="back"
            headerLinkText="Back to Login"
            headerLinkHref="/login"
        >
            <header className="auth-form-header">
                <h1 className="auth-form-title auth-form-title-dark">Forgot Password?</h1>
                <p className="auth-form-subtitle">
                    Enter the email associated with your finasaan account to receive a OTP to reset your password.
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

                <button type="submit" className="auth-primary-button">
                    Continue
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
