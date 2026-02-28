"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { WatchlistToggle } from "./WatchlistToggle";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface MutualFund {
    id: string;
    symbol: string;
    name: string;
    description?: string;
    inception_date?: string;
    aum?: number;
    ytd?: number;
    risk_profile?: string;
    is_shariah_compliant?: boolean;
}

interface NavData {
    nav_date: string;
    nav_price: number;
}

interface ChartDataPoint {
    date: string;
    nav: number;
    displayDate: string;
}

interface FundDetailProps {
    fundId: string;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
    }).format(price);
}

function formatNumber(num: number): string {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
    return num.toLocaleString();
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

// Time range options for the chart
type TimeRange = "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y";

const TIME_RANGES: { key: TimeRange; label: string; days: number }[] = [
    { key: "1M", label: "1M", days: 30 },
    { key: "3M", label: "3M", days: 90 },
    { key: "6M", label: "6M", days: 180 },
    { key: "1Y", label: "1Y", days: 365 },
    { key: "3Y", label: "3Y", days: 1095 },
    { key: "5Y", label: "5Y", days: 1825 },
];

// NAV History interval options (shows NAV at regular intervals)
type HistoryInterval = "1D" | "1W" | "1M" | "3M" | "6M";

const HISTORY_INTERVALS: { key: HistoryInterval; label: string; daysApart: number }[] = [
    { key: "1D", label: "Daily", daysApart: 1 },
    { key: "1W", label: "Weekly", daysApart: 7 },
    { key: "1M", label: "Monthly", daysApart: 30 },
    { key: "3M", label: "Quarterly", daysApart: 90 },
    { key: "6M", label: "Half-Yearly", daysApart: 180 },
];

// Helper to sample data at intervals
function sampleAtIntervals(data: NavData[], daysApart: number): NavData[] {
    if (data.length === 0) return [];

    // Data is sorted newest first
    const result: NavData[] = [];
    let lastDate: Date | null = null;

    for (const nav of data) {
        const navDate = new Date(nav.nav_date);

        if (!lastDate) {
            result.push(nav);
            lastDate = navDate;
        } else {
            const daysDiff = Math.floor((lastDate.getTime() - navDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff >= daysApart) {
                result.push(nav);
                lastDate = navDate;
            }
        }
    }

    return result;
}

// Custom Tooltip Component
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: ChartDataPoint }> }) {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip">
                <p className="tooltip-date">{payload[0].payload.displayDate}</p>
                <p className="tooltip-value">{formatPrice(payload[0].value)}</p>
            </div>
        );
    }
    return null;
}

// Recharts Area Chart Component
function NavChart({ data, isPositive }: { data: NavData[]; isPositive: boolean }) {
    const chartData: ChartDataPoint[] = useMemo(() => {
        if (data.length === 0) return [];

        return [...data]
            .sort((a, b) => new Date(a.nav_date).getTime() - new Date(b.nav_date).getTime())
            .map(d => ({
                date: d.nav_date,
                nav: d.nav_price,
                displayDate: formatDate(d.nav_date),
            }));
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="nav-chart-empty">
                No NAV data available
            </div>
        );
    }

    const color = isPositive ? "#16A34A" : "#DC2626";
    const gradientId = isPositive ? "navGradientUp" : "navGradientDown";

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-PK", { month: "short", year: "2-digit" })}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    minTickGap={50}
                />
                <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => value.toFixed(1)}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="nav"
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#${gradientId})`}
                    activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: "#fff" }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function FundDetail({ fundId }: FundDetailProps) {
    const [fund, setFund] = useState<MutualFund | null>(null);
    const [navHistory, setNavHistory] = useState<NavData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>("1Y");
    const [historyInterval, setHistoryInterval] = useState<HistoryInterval>("1M");

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                // Fetch fund details
                const fundRes = await fetch(`${API_URL}/api/mfs/funds/${fundId}`);
                const fundData = await fundRes.json() as { success: boolean; data?: MutualFund; error?: string };

                if (!fundData.success || !fundData.data) {
                    setError(fundData.error || "Fund not found");
                    return;
                }

                setFund(fundData.data);

                // Fetch NAV history (get a lot for the chart)
                const navRes = await fetch(`${API_URL}/api/mfs/funds/${fundId}/nav?limit=2000`);
                const navData = await navRes.json() as { success: boolean; data?: NavData[] };

                if (navData.success && navData.data) {
                    setNavHistory(navData.data);
                }
            } catch (err) {
                setError("Failed to load fund data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [fundId]);

    // Filter NAV data based on selected time range
    const filteredNavData = useMemo(() => {
        const range = TIME_RANGES.find(r => r.key === timeRange);
        if (!range) return navHistory;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - range.days);

        return navHistory.filter(d => new Date(d.nav_date) >= cutoffDate);
    }, [navHistory, timeRange]);

    // Calculate period performance
    const periodPerformance = useMemo(() => {
        if (filteredNavData.length < 2) return null;

        const sorted = [...filteredNavData].sort((a, b) =>
            new Date(a.nav_date).getTime() - new Date(b.nav_date).getTime()
        );

        const startNav = sorted[0].nav_price;
        const endNav = sorted[sorted.length - 1].nav_price;
        const change = endNav - startNav;
        const percentChange = ((change / startNav) * 100);

        return { startNav, endNav, change, percentChange };
    }, [filteredNavData]);

    if (loading) {
        return <FundDetailSkeleton />;
    }

    if (error || !fund) {
        return (
            <div className="stock-error">
                <div className="stock-error-icon">📊</div>
                <h2>Fund Not Found</h2>
                <p>{error || "Unable to load fund data"}</p>
                <Link href="/dashboard/funds" className="stock-back-link">
                    ← Back to Mutual Funds
                </Link>
            </div>
        );
    }

    const latestNav = navHistory[0];

    return (
        <div className="fund-detail">
            {/* Header */}
            <div className="stock-detail-header">
                <Link href="/dashboard/funds" className="stock-back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                </Link>
            </div>

            {/* Main Info Card */}
            <div className="fund-price-card">
                <div className="fund-header">
                    <div className="fund-header-left">
                        {fund.symbol && <div className="stock-symbol-badge">{fund.symbol}</div>}
                        <h1 className="fund-name">{fund.name}</h1>
                    </div>
                    <div className="fund-header-right">
                        <div className="fund-badges">
                            {fund.risk_profile && (
                                <span className={`fund-badge risk-${fund.risk_profile.toLowerCase()}`}>
                                    {fund.risk_profile}
                                </span>
                            )}
                            {fund.is_shariah_compliant && (
                                <span className="fund-badge shariah">Shariah</span>
                            )}
                        </div>
                        <WatchlistToggle assetId={fund.id} type="fund" />
                    </div>
                </div>

                {latestNav && (
                    <div className="fund-nav-display">
                        <div className="fund-nav-main">
                            <span className="fund-nav-label">Latest NAV</span>
                            <span className="fund-nav-price">{formatPrice(latestNav.nav_price)}</span>
                            <span className="fund-nav-date">{formatDate(latestNav.nav_date)}</span>
                        </div>
                        {fund.ytd !== undefined && (
                            <div className={`fund-ytd-badge ${fund.ytd >= 0 ? "up" : "down"}`}>
                                <span className="fund-ytd-label">YTD</span>
                                <span className="fund-ytd-value">{formatPercent(fund.ytd)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Chart Section */}
            {navHistory.length > 1 && (
                <div className="fund-chart-card">
                    <div className="fund-chart-header">
                        <h3 className="stock-section-title">NAV Performance</h3>
                        <div className="fund-time-range">
                            {TIME_RANGES.map(range => (
                                <button
                                    key={range.key}
                                    className={`time-range-btn ${timeRange === range.key ? "active" : ""}`}
                                    onClick={() => setTimeRange(range.key)}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {periodPerformance && (
                        <div className="fund-period-stats">
                            <span className="period-stat">
                                Start: <strong>{formatPrice(periodPerformance.startNav)}</strong>
                            </span>
                            <span className="period-stat">
                                End: <strong>{formatPrice(periodPerformance.endNav)}</strong>
                            </span>
                            <span className={`period-stat change ${periodPerformance.percentChange >= 0 ? "up" : "down"}`}>
                                {periodPerformance.percentChange >= 0 ? "↑" : "↓"} {formatPercent(periodPerformance.percentChange)}
                            </span>
                        </div>
                    )}

                    <div className="fund-chart-container">
                        <NavChart
                            data={filteredNavData}
                            isPositive={periodPerformance ? periodPerformance.percentChange >= 0 : true}
                        />
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="stock-stats-grid">
                {fund.aum && (
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">AUM</span>
                        <span className="stock-stat-value">{formatNumber(fund.aum)}</span>
                    </div>
                )}
                {fund.inception_date && (
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">Inception</span>
                        <span className="stock-stat-value">{formatDate(fund.inception_date)}</span>
                    </div>
                )}
                {fund.risk_profile && (
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">Risk Profile</span>
                        <span className="stock-stat-value">{fund.risk_profile}</span>
                    </div>
                )}
                {latestNav && navHistory.length > 0 && (
                    <>
                        <div className="stock-stat-card">
                            <span className="stock-stat-label">52W High</span>
                            <span className="stock-stat-value highlight-up">
                                {formatPrice(Math.max(...navHistory.slice(0, 260).map(n => n.nav_price)))}
                            </span>
                        </div>
                        <div className="stock-stat-card">
                            <span className="stock-stat-label">52W Low</span>
                            <span className="stock-stat-value highlight-down">
                                {formatPrice(Math.min(...navHistory.slice(0, 260).map(n => n.nav_price)))}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Description */}
            {fund.description && (
                <div className="stock-info-card">
                    <h3 className="stock-section-title">About This Fund</h3>
                    <p className="stock-description" style={{ paddingTop: 0, borderTop: "none" }}>
                        {fund.description}
                    </p>
                </div>
            )}

            {/* NAV History Table */}
            {navHistory.length > 0 && (
                <div className="stock-trades-card">
                    <div className="fund-chart-header">
                        <h3 className="stock-section-title">NAV History</h3>
                        <div className="fund-time-range">
                            {HISTORY_INTERVALS.map(interval => (
                                <button
                                    key={interval.key}
                                    className={`time-range-btn ${historyInterval === interval.key ? "active" : ""}`}
                                    onClick={() => setHistoryInterval(interval.key)}
                                >
                                    {interval.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="stock-trades-table">
                        <div className="fund-nav-header">
                            <span>Date</span>
                            <span>NAV</span>
                            <span>Change</span>
                        </div>
                        {(() => {
                            const interval = HISTORY_INTERVALS.find(i => i.key === historyInterval);
                            const sampledData = sampleAtIntervals(navHistory, interval?.daysApart || 30);

                            return sampledData.slice(0, 20).map((nav, i) => {
                                const prevNav = sampledData[i + 1];
                                const change = prevNav ? nav.nav_price - prevNav.nav_price : 0;
                                const percentChange = prevNav ? ((change / prevNav.nav_price) * 100) : 0;
                                const isUp = change >= 0;

                                return (
                                    <div key={nav.nav_date} className={`fund-nav-row ${isUp ? "row-up" : "row-down"}`}>
                                        <span>{formatDate(nav.nav_date)}</span>
                                        <span>{formatPrice(nav.nav_price)}</span>
                                        <span className={isUp ? "highlight-up" : "highlight-down"}>
                                            {prevNav ? (isUp ? "↑" : "↓") : "–"} {prevNav ? formatPercent(percentChange) : ""}
                                        </span>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}

function FundDetailSkeleton() {
    return (
        <div className="fund-detail">
            <div className="fund-price-card skeleton-card" style={{ height: 180 }}>
                <div className="skeleton-line w-32 h-6" />
                <div className="skeleton-line w-48 h-8 mt-2" />
            </div>
            <div className="fund-chart-card skeleton-card" style={{ height: 350 }} />
            <div className="stock-stats-grid">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="stock-stat-card skeleton-card">
                        <div className="skeleton-line w-16 h-4" />
                        <div className="skeleton-line w-24 h-6 mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
