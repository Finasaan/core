"use client";

interface CalculatorInputProps {
    label: string;
    value: number | string;
    onChange: (value: number) => void;
    prefix?: string;
    suffix?: string;
    helper?: string;
    min?: number;
    max?: number;
    step?: number;
    id?: string;
}

export function CalculatorInput({
    label, value, onChange, prefix, suffix, helper, min = 0, max, step = 1, id,
}: CalculatorInputProps) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === "") {
            onChange(0);
        } else {
            const num = parseFloat(val);
            if (!isNaN(num)) onChange(num);
        }
    };

    return (
        <div className="calculator-input-group">
            <label htmlFor={inputId} className="calculator-input-label">{label}</label>
            <div className="calculator-input-wrapper">
                {prefix && <span className="calculator-input-prefix">{prefix}</span>}
                <input
                    type="number"
                    id={inputId}
                    value={value === 0 ? "" : value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                    className="calculator-input"
                    placeholder="0"
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                />
                {suffix && <span className="calculator-input-suffix">{suffix}</span>}
            </div>
            {helper && <span id={`${inputId}-helper`} className="calculator-input-helper">{helper}</span>}
        </div>
    );
}
