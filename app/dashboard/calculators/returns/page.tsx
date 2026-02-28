"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { CalculatorShell, CalculatorInput, CalculatorResult, CalculatorResultsCard } from "@/components/calculators";
import { calculateCompound, generateGrowthData } from "@/lib/calculators/returns";
import { formatPKR, SUGGESTED_RETURNS } from "@/lib/calculators/config";

type AssetType = "stocks" | "indexFunds" | "cashFunds" | "pensionFunds";

const ASSET_TYPES: { key: AssetType; label: string; suggestedReturn: number }[] = [
    { key: "stocks", label: "Stocks", suggestedReturn: SUGGESTED_RETURNS.stocks },
    { key: "indexFunds", label: "Index Funds", suggestedReturn: SUGGESTED_RETURNS.indexFunds },
    { key: "cashFunds", label: "Cash Funds", suggestedReturn: SUGGESTED_RETURNS.cashFunds },
    { key: "pensionFunds", label: "Pension Funds", suggestedReturn: SUGGESTED_RETURNS.pensionFunds },
];

// Custom tooltip for chart
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: number }) {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip">
                <p className="tooltip-date">Year {label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="tooltip-value" style={{ color: entry.dataKey === "value" ? "#159F63" : "#9CA3AF" }}>
                        {entry.dataKey === "value" ? "Total Value" : "Contributions"}: {formatPKR(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

export default function ReturnsCalculatorPage() {
    const [assetType, setAssetType] = useState<AssetType>("stocks");
    const [principal, setPrincipal] = useState(100000);
    const [annualReturn, setAnnualReturn] = useState(12);
    const [years, setYears] = useState(10);
    const [monthlyContribution, setMonthlyContribution] = useState(5000);

    // Calculate results
    const result = useMemo(() => {
        return calculateCompound({
            principal,
            annualRate: annualReturn / 100,
            years,
            monthlyContribution,
        });
    }, [principal, annualReturn, years, monthlyContribution]);

    // Generate chart data
    const chartData = useMemo(() => {
        return generateGrowthData({
            principal,
            annualRate: annualReturn / 100,
            years,
            monthlyContribution,
        });
    }, [principal, annualReturn, years, monthlyContribution]);

    // Handle asset type change - update suggested return
    const handleAssetTypeChange = (type: AssetType) => {
        setAssetType(type);
        const asset = ASSET_TYPES.find(a => a.key === type);
        if (asset) {
            setAnnualReturn(asset.suggestedReturn * 100);
        }
    };

    return (
        <>
            <header className="dashboard-header">
                <Link href="/dashboard/calculators" className="stock-back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back to Calculators
                </Link>
                <h1 className="dashboard-greeting" style={{ marginTop: 16 }}>Investment Returns Calculator</h1>
                <p className="dashboard-date">Estimate your potential investment growth</p>
            </header>

            <CalculatorShell
                title="Compounding Calculator"
                description="See how your investment could grow with compound interest and regular contributions"
            >
                {/* Asset Type Selector */}
                <div className="calculator-section">
                    <label className="calculator-section-label">Investment Type</label>
                    <div className="calculator-pills">
                        {ASSET_TYPES.map(type => (
                            <button
                                key={type.key}
                                className={`calculator-pill ${assetType === type.key ? "active" : ""}`}
                                onClick={() => handleAssetTypeChange(type.key)}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Inputs */}
                <div className="calculator-inputs">
                    <CalculatorInput
                        label="Initial Investment"
                        value={principal}
                        onChange={setPrincipal}
                        prefix="PKR"
                        step={10000}
                    />

                    <CalculatorInput
                        label="Expected Annual Return"
                        value={annualReturn}
                        onChange={setAnnualReturn}
                        suffix="%"
                        step={0.5}
                        max={50}
                        helper="Based on historical averages"
                    />

                    <CalculatorInput
                        label="Investment Period"
                        value={years}
                        onChange={setYears}
                        suffix="years"
                        min={1}
                        max={40}
                    />

                    <CalculatorInput
                        label="Monthly Contribution"
                        value={monthlyContribution}
                        onChange={setMonthlyContribution}
                        prefix="PKR"
                        step={1000}
                        helper="Optional recurring investment"
                    />
                </div>

                {/* Growth Chart */}
                {chartData.length > 1 && (
                    <div className="calculator-chart">
                        <h4 className="calculator-results-title">Investment Growth Over Time</h4>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#159F63" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#159F63" stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="contribGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis
                                    dataKey="year"
                                    tickFormatter={(value) => `Y${value}`}
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                                        return value;
                                    }}
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    width={55}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    formatter={(value) => value === "value" ? "Total Value" : "Contributions"}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="contributions"
                                    stroke="#9CA3AF"
                                    strokeWidth={2}
                                    fill="url(#contribGradient)"
                                    strokeDasharray="4 4"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#159F63"
                                    strokeWidth={2}
                                    fill="url(#growthGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        <p className="calculator-chart-note">
                            The gap between the lines represents your compound interest earnings
                        </p>
                    </div>
                )}

                {/* Results */}
                <CalculatorResultsCard
                    title="Projected Results"
                    note="Estimate based on consistent returns — actual results may vary with market conditions."
                >
                    <CalculatorResult
                        label="Final Value"
                        value={formatPKR(result.finalValue)}
                        highlight
                        size="large"
                    />
                    <CalculatorResult
                        label="Total Contributed"
                        value={formatPKR(result.totalContributions)}
                    />
                    <CalculatorResult
                        label="Interest Earned"
                        value={formatPKR(result.totalInterest)}
                        highlight
                    />
                    <CalculatorResult
                        label="Growth Multiple"
                        value={`${(result.finalValue / result.totalContributions).toFixed(2)}x`}
                        tooltip="How many times your investment grew"
                    />
                </CalculatorResultsCard>
            </CalculatorShell>
        </>
    );
}
