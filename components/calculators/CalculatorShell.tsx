"use client";

import { ReactNode } from "react";

interface CalculatorShellProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export function CalculatorShell({ title, description, children }: CalculatorShellProps) {
    return (
        <div className="calculator-shell">
            <div className="calculator-header">
                <h2 className="calculator-title">{title}</h2>
                {description && <p className="calculator-description">{description}</p>}
            </div>
            <div className="calculator-content">
                {children}
            </div>
        </div>
    );
}
