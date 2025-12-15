"use client";

import { useState, useRef, useEffect } from "react";

interface OnboardingSelectProps {
    options: { value: string; label: string }[];
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function OnboardingSelect({
    options,
    value,
    onChange,
    placeholder = "Please Select",
}: OnboardingSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="onboarding-select" ref={selectRef}>
            <button
                type="button"
                className={`onboarding-select-trigger ${isOpen ? "onboarding-select-open" : ""} ${value ? "onboarding-select-filled" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={value ? "onboarding-select-value" : "onboarding-select-placeholder"}>
                    {selectedOption?.label || placeholder}
                </span>
                <svg
                    className={`onboarding-select-arrow ${isOpen ? "onboarding-select-arrow-up" : ""}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M19.92 8.95L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.08 8.95"
                        stroke="#121212"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="onboarding-select-dropdown" role="listbox">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`onboarding-select-option ${value === option.value ? "onboarding-select-option-selected" : ""}`}
                            onClick={() => handleSelect(option.value)}
                            role="option"
                            aria-selected={value === option.value}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
