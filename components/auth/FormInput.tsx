import { InputHTMLAttributes, forwardRef } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, id, className, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className={`auth-input-group ${className || ""}`}>
                <label htmlFor={inputId} className="auth-input-label">
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className="auth-input-field"
                    {...props}
                />
                {error && (
                    <span className="auth-input-error" role="alert">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";
