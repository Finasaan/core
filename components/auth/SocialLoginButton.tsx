"use client";

import { GoogleIcon } from "./GoogleIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

interface SocialLoginButtonProps {
    provider: "google";
}

export function SocialLoginButton({ provider }: SocialLoginButtonProps) {
    const getProviderInfo = () => {
        switch (provider) {
            case "google":
                return { icon: <GoogleIcon />, text: "Continue with Google" };
            default:
                return { icon: null, text: "Continue" };
        }
    };

    const handleOAuthSignIn = () => {
        // Redirect the browser to spine, which generates the OAuth URL and redirects to Google.
        // The redirectTo param tells spine where Google should send the user back after auth.
        const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
        window.location.href = `${API_URL}/api/auth/oauth/google?redirectTo=${callbackUrl}`;
    };

    const { icon, text } = getProviderInfo();

    return (
        <button
            type="button"
            className="auth-social-button"
            onClick={handleOAuthSignIn}
            aria-label={text}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}
