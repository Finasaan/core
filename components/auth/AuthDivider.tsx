interface AuthDividerProps {
    text?: string;
}

export function AuthDivider({ text = "Or" }: AuthDividerProps) {
    return (
        <div className="auth-divider" role="separator">
            <hr className="auth-divider-line" />
            <span className="auth-divider-text">{text}</span>
            <hr className="auth-divider-line" />
        </div>
    );
}
