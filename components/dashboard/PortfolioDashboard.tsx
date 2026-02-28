"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { PortfolioSummary } from "@/lib/portfolio";

// ---- Helpers ----

function formatPKR(value: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

function formatChange(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${formatPKR(value)}`;
}

// ---- Stat Card ----

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    variant?: "default" | "up" | "down";
}

function StatCard({ label, value, sub, variant = "default" }: StatCardProps) {
    return (
        <div className={`pf-stat-card pf-stat-${variant}`}>
            <span className="pf-stat-label">{label}</span>
            <span className="pf-stat-value">{value}</span>
            {sub && <span className="pf-stat-sub">{sub}</span>}
        </div>
    );
}

// ---- Allocation Pie Chart ----

const PIE_COLORS = ["#159F63", "#3B82F6"];
const PIE_LABELS: Record<string, string> = {
    stocks: "Stocks",
    mutual_funds: "Mutual Funds",
};

interface AllocationChartProps {
    allocation: PortfolioSummary["allocation"];
}

function AllocationChart({ allocation }: AllocationChartProps) {
    const data = allocation
        .filter((a) => a.value > 0)
        .map((a) => ({
            name: PIE_LABELS[a.type] || a.type,
            value: a.value,
            pct: a.weight_pct,
        }));

    if (data.length === 0) {
        return (
            <div className="pf-chart-empty">
                <p>No allocation data</p>
            </div>
        );
    }

    return (
        <div className="pf-chart-wrap">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => formatPKR(Number(value ?? 0))}
                        contentStyle={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: "13px",
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="pf-chart-legend">
                {data.map((d, i) => (
                    <div key={d.name} className="pf-chart-legend-item">
                        <span
                            className="pf-chart-legend-dot"
                            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="pf-chart-legend-label">{d.name}</span>
                        <span className="pf-chart-legend-pct">{d.pct.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---- Portfolio Dashboard (main) ----

interface PortfolioDashboardProps {
    summary: PortfolioSummary;
}

export function PortfolioDashboard({ summary }: PortfolioDashboardProps) {
    const plVariant = summary.total_pl >= 0 ? "up" : "down";
    const dailyVariant = summary.daily_change >= 0 ? "up" : "down";

    return (
        <div className="pf-dashboard">
            {/* Stats row */}
            <div className="pf-stats-grid">
                <StatCard
                    label="Total Value"
                    value={formatPKR(summary.total_value)}
                />
                <StatCard
                    label="Total P/L"
                    value={formatChange(summary.total_pl)}
                    sub={formatPercent(summary.total_pl_pct)}
                    variant={plVariant}
                />
                <StatCard
                    label="Daily Change"
                    value={formatChange(summary.daily_change)}
                    sub={formatPercent(summary.daily_change_pct)}
                    variant={dailyVariant}
                />
                <StatCard
                    label="Total Cost"
                    value={formatPKR(summary.total_cost)}
                />
            </div>

            {/* Allocation chart */}
            {summary.allocation.length > 0 && (
                <div className="pf-allocation-card">
                    <h3 className="pf-section-title">Allocation</h3>
                    <AllocationChart allocation={summary.allocation} />
                </div>
            )}
        </div>
    );
}
