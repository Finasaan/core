"use client";

import { useRouter } from "next/navigation";
import { GoogleIcon } from "./GoogleIcon";
import { createClient } from "@/lib/supabase/client";

interface SocialLoginButtonProps {
    provider: "google";
}

export function SocialLoginButton({ provider }: SocialLoginButtonProps) {
    const router = useRouter();
    const supabase = createClient();

    const getProviderInfo = () => {
        switch (provider) {
            case "google":
                return {
                    icon: <GoogleIcon />,
                    text: "Continue with Google",
                };
            default:
                return {
                    icon: null,
                    text: "Continue",
                };
        }
    };

    const handleOAuthSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error("OAuth error:", error.message);
        }
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
