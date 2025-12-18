"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CalculatorShell, CalculatorInput, CalculatorResult, CalculatorResultsCard } from "@/components/calculators";
import { calculateCapitalGainsTax, calculateDividendTax, calculatePensionCredit } from "@/lib/calculators/tax";
import { formatPKR, formatPercent } from "@/lib/calculators/config";

type TaxTab = "cgt" | "dividend" | "pension";

export default function TaxationCalculatorPage() {
    const [activeTab, setActiveTab] = useState<TaxTab>("cgt");

    return (
        <>
            <header className="dashboard-header">
                <Link href="/dashboard/calculators" className="stock-back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back to Calculators
                </Link>
                <h1 className="dashboard-greeting" style={{ marginTop: 16 }}>Tax Calculators</h1>
                <p className="dashboard-date">Pakistan Tax Estimators</p>
            </header>

            {/* Tab Navigation */}
            <div className="calculator-tabs">
                <button
                    className={`calculator-tab ${activeTab === "cgt" ? "active" : ""}`}
                    onClick={() => setActiveTab("cgt")}
                >
                    Capital Gains
                </button>
                <button
                    className={`calculator-tab ${activeTab === "dividend" ? "active" : ""}`}
                    onClick={() => setActiveTab("dividend")}
                >
                    Dividend Tax
                </button>
                <button
                    className={`calculator-tab ${activeTab === "pension" ? "active" : ""}`}
                    onClick={() => setActiveTab("pension")}
                >
                    Pension Credit
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "cgt" && <CapitalGainsCalculator />}
            {activeTab === "dividend" && <DividendCalculator />}
            {activeTab === "pension" && <PensionCreditCalculator />}
        </>
    );
}

// Capital Gains Tax Calculator
function CapitalGainsCalculator() {
    const [purchaseValue, setPurchaseValue] = useState(100000);
    const [saleValue, setSaleValue] = useState(150000);
    const [holdingYears, setHoldingYears] = useState(1);
    const [isFiler, setIsFiler] = useState(true);

    const result = useMemo(() => {
        return calculateCapitalGainsTax({
            purchaseValue,
            saleValue,
            holdingPeriodYears: holdingYears,
            isFiler,
        });
    }, [purchaseValue, saleValue, holdingYears, isFiler]);

    return (
        <CalculatorShell
            title="Capital Gains Tax"
            description="Estimate tax on stock and equity fund sales"
        >
            <div className="calculator-inputs">
                <CalculatorInput
                    label="Purchase Value"
                    value={purchaseValue}
                    onChange={setPurchaseValue}
                    prefix="PKR"
                    step={10000}
                />
                <CalculatorInput
                    label="Sale Value"
                    value={saleValue}
                    onChange={setSaleValue}
                    prefix="PKR"
                    step={10000}
                />
                <CalculatorInput
                    label="Holding Period"
                    value={holdingYears}
                    onChange={setHoldingYears}
                    suffix="years"
                    step={0.5}
                    min={0}
                    max={10}
                />
                <div className="calculator-input-group">
                    <label className="calculator-input-label">Tax Filer Status</label>
                    <div className="calculator-pills">
                        <button
                            className={`calculator-pill ${isFiler ? "active" : ""}`}
                            onClick={() => setIsFiler(true)}
                        >
                            Filer
                        </button>
                        <button
                            className={`calculator-pill ${!isFiler ? "active" : ""}`}
                            onClick={() => setIsFiler(false)}
                        >
                            Non-Filer
                        </button>
                    </div>
                </div>
            </div>

            <CalculatorResultsCard
                title="Tax Estimate"
                note="Estimate based on current Pakistan tax rules — may vary with actual filings."
            >
                <CalculatorResult label="Capital Gain" value={formatPKR(result.gain)} />
                <CalculatorResult
                    label="Tax Rate"
                    value={result.isExempt ? "Exempt" : formatPercent(result.taxRate)}
                    tooltip={result.holdingCategory}
                />
                <CalculatorResult label="Estimated Tax" value={formatPKR(result.taxAmount)} highlight />
                <CalculatorResult label="Net Proceeds" value={formatPKR(result.netProceeds)} highlight size="large" />
            </CalculatorResultsCard>

            <p className="calculator-explanation">{result.explanation}</p>
        </CalculatorShell>
    );
}

// Dividend Tax Calculator
function DividendCalculator() {
    const [dividendAmount, setDividendAmount] = useState(50000);
    const [isFiler, setIsFiler] = useState(true);

    const result = useMemo(() => {
        return calculateDividendTax({ dividendAmount, isFiler });
    }, [dividendAmount, isFiler]);

    return (
        <CalculatorShell
            title="Dividend Withholding Tax"
            description="Calculate tax withheld on dividend income"
        >
            <div className="calculator-inputs">
                <CalculatorInput
                    label="Dividend Amount"
                    value={dividendAmount}
                    onChange={setDividendAmount}
                    prefix="PKR"
                    step={5000}
                />
                <div className="calculator-input-group">
                    <label className="calculator-input-label">Tax Filer Status</label>
                    <div className="calculator-pills">
                        <button
                            className={`calculator-pill ${isFiler ? "active" : ""}`}
                            onClick={() => setIsFiler(true)}
                        >
                            Filer
                        </button>
                        <button
                            className={`calculator-pill ${!isFiler ? "active" : ""}`}
                            onClick={() => setIsFiler(false)}
                        >
                            Non-Filer
                        </button>
                    </div>
                </div>
            </div>

            <CalculatorResultsCard
                title="Tax Breakdown"
                note="Dividend tax is withheld at source by the paying company."
            >
                <CalculatorResult label="Gross Dividend" value={formatPKR(result.grossDividend)} />
                <CalculatorResult label="Tax Rate" value={formatPercent(result.taxRate)} />
                <CalculatorResult label="Tax Withheld" value={formatPKR(result.taxWithheld)} highlight />
                <CalculatorResult label="Net Received" value={formatPKR(result.netReceived)} highlight size="large" />
            </CalculatorResultsCard>

            <p className="calculator-explanation">{result.explanation}</p>
        </CalculatorShell>
    );
}

// Pension Credit Calculator
function PensionCreditCalculator() {
    const [contribution, setContribution] = useState(100000);
    const [taxableIncome, setTaxableIncome] = useState(1200000);

    const result = useMemo(() => {
        return calculatePensionCredit({ contributionAmount: contribution, taxableIncome });
    }, [contribution, taxableIncome]);

    return (
        <CalculatorShell
            title="Pension Tax Credit"
            description="Estimate tax benefits from voluntary pension contributions"
        >
            <div className="calculator-inputs">
                <CalculatorInput
                    label="Annual Contribution"
                    value={contribution}
                    onChange={setContribution}
                    prefix="PKR"
                    step={10000}
                    helper="Your voluntary pension contribution"
                />
                <CalculatorInput
                    label="Annual Taxable Income"
                    value={taxableIncome}
                    onChange={setTaxableIncome}
                    prefix="PKR"
                    step={50000}
                    helper="Used to calculate credit cap"
                />
            </div>

            <CalculatorResultsCard
                title="Credit Estimate"
                note="Credit is subject to applicable tax slabs and may vary with final assessment."
            >
                <CalculatorResult label="Contribution" value={formatPKR(result.contribution)} />
                <CalculatorResult
                    label="Eligible Amount"
                    value={formatPKR(result.eligibleAmount)}
                    tooltip="Maximum 30% of taxable income"
                />
                <CalculatorResult label="Estimated Tax Credit" value={formatPKR(result.taxCredit)} highlight />
                <CalculatorResult
                    label="Effective Cost"
                    value={formatPKR(result.effectiveCost)}
                    highlight
                    size="large"
                    tooltip="Actual cost after tax benefit"
                />
            </CalculatorResultsCard>

            <p className="calculator-explanation">{result.explanation}</p>
        </CalculatorShell>
    );
}
