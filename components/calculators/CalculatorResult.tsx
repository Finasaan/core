"use client";

interface CalculatorResultProps {
    label: string;
    value: string;
    highlight?: boolean;
    tooltip?: string;
    size?: "normal" | "large";
}

export function CalculatorResult({ label, value, highlight = false, tooltip, size = "normal" }: CalculatorResultProps) {
    return (
        <div className={`calculator-result ${highlight ? "highlight" : ""} ${size}`}>
            <span className="calculator-result-label">
                {label}
                {tooltip && <span className="calculator-result-tooltip" title={tooltip}>ⓘ</span>}
            </span>
            <span className="calculator-result-value">{value}</span>
        </div>
    );
}

interface CalculatorResultsCardProps {
    title?: string;
    children: React.ReactNode;
    note?: string;
}

export function CalculatorResultsCard({ title, children, note }: CalculatorResultsCardProps) {
    return (
        <div className="calculator-results-card">
            {title && <h4 className="calculator-results-title">{title}</h4>}
            <div className="calculator-results-grid">{children}</div>
            {note && <p className="calculator-results-note">{note}</p>}
        </div>
    );
}
