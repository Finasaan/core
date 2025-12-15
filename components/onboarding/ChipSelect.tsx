"use client";

import { useState } from "react";

interface ChipOption {
    value: string;
    label: string;
}

interface ChipSelectProps {
    options: ChipOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function ChipSelect({ options, selected, onChange }: ChipSelectProps) {
    const toggleChip = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="chip-container">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`chip ${selected.includes(option.value) ? "chip-selected" : ""}`}
                    onClick={() => toggleChip(option.value)}
                    aria-pressed={selected.includes(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
