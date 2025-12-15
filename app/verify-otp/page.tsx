"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    AuthLayout,
    OtpInput,
    ClockIcon,
} from "@/components/auth";

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleResend = () => {
        setTimeLeft(60);
        setCanResend(false);
        // TODO: Trigger resend OTP API call
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Verify OTP API call
        console.log("Verifying OTP:", otp);
    };

    return (
        <AuthLayout
            headerVariant="back"
            headerLinkText="Back to Login"
            headerLinkHref="/login"
        >
            <header className="auth-form-header">
                <h1 className="auth-form-title auth-form-title-dark">Verify OTP</h1>
                <p className="auth-form-subtitle">
                    We&apos;ve sent a 6-digit OTP to your registered email, enter the OTP to reset your password.
                </p>
            </header>

            <form className="auth-form-fields" onSubmit={handleSubmit}>
                <OtpInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                />

                <div className="otp-resend-section">
                    <span className="otp-resend-label">Didn&apos;t get it?</span>
                    <div className="otp-resend-row">
                        <div className="otp-timer">
                            <ClockIcon className="otp-timer-icon" />
                            <span className="otp-timer-text">{formatTime(timeLeft)}</span>
                        </div>
                        <button
                            type="button"
                            className="otp-resend-link"
                            onClick={handleResend}
                            disabled={!canResend}
                        >
                            Resend Code
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="auth-primary-button"
                    disabled={otp.length !== 6}
                >
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
