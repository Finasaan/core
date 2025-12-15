import { GoogleIcon } from "./GoogleIcon";

interface SocialLoginButtonProps {
    provider: "google";
    onClick?: () => void;
}

export function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
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

    const { icon, text } = getProviderInfo();

    return (
        <button
            type="button"
            className="auth-social-button"
            onClick={onClick}
            aria-label={text}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}
