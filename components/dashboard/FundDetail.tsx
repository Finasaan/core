"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

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

// Simple SVG Line Chart Component
function NavChart({ data, height = 300 }: { data: NavData[]; height?: number }) {
    const width = 800;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };

    const chartData = useMemo(() => {
        if (data.length === 0) return null;

        const sorted = [...data].sort((a, b) =>
            new Date(a.nav_date).getTime() - new Date(b.nav_date).getTime()
        );

        const prices = sorted.map(d => d.nav_price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice || 1;

        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const points = sorted.map((d, i) => ({
            x: padding.left + (i / (sorted.length - 1 || 1)) * chartWidth,
            y: padding.top + chartHeight - ((d.nav_price - minPrice) / priceRange) * chartHeight,
            date: d.nav_date,
            price: d.nav_price,
        }));

        const pathD = points.map((p, i) =>
            `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
        ).join(" ");

        // Create gradient area path
        const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(2)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

        const startPrice = sorted[0].nav_price;
        const endPrice = sorted[sorted.length - 1].nav_price;
        const isPositive = endPrice >= startPrice;

        return {
            points,
            pathD,
            areaD,
            minPrice,
            maxPrice,
            startPrice,
            endPrice,
            isPositive,
            sorted,
        };
    }, [data, height]);

    if (!chartData) {
        return (
            <div className="nav-chart-empty">
                No NAV data available
            </div>
        );
    }

    const { pathD, areaD, minPrice, maxPrice, isPositive, sorted } = chartData;
    const color = isPositive ? "#16A34A" : "#DC2626";
    const gradientId = `nav-gradient-${isPositive ? "up" : "down"}`;

    // Y-axis labels
    const yLabels = [minPrice, (minPrice + maxPrice) / 2, maxPrice].map(v => ({
        value: v,
        y: padding.top + (height - padding.top - padding.bottom) - ((v - minPrice) / (maxPrice - minPrice || 1)) * (height - padding.top - padding.bottom),
    }));

    // X-axis labels (first, middle, last dates)
    const xLabels = [
        { date: sorted[0].nav_date, x: padding.left },
        { date: sorted[Math.floor(sorted.length / 2)]?.nav_date, x: width / 2 },
        { date: sorted[sorted.length - 1].nav_date, x: width - padding.right },
    ].filter(l => l.date);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="nav-chart" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {yLabels.map((l, i) => (
                <line
                    key={i}
                    x1={padding.left}
                    y1={l.y}
                    x2={width - padding.right}
                    y2={l.y}
                    stroke="#E5E7EB"
                    strokeDasharray="4,4"
                />
            ))}

            {/* Area fill */}
            <path d={areaD} fill={`url(#${gradientId})`} />

            {/* Line */}
            <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Y-axis labels */}
            {yLabels.map((l, i) => (
                <text
                    key={i}
                    x={padding.left - 10}
                    y={l.y + 4}
                    textAnchor="end"
                    className="chart-axis-label"
                >
                    {l.value.toFixed(2)}
                </text>
            ))}

            {/* X-axis labels */}
            {xLabels.map((l, i) => (
                <text
                    key={i}
                    x={l.x}
                    y={height - 10}
                    textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
                    className="chart-axis-label"
                >
                    {new Date(l.date).toLocaleDateString("en-PK", { month: "short", year: "2-digit" })}
                </text>
            ))}
        </svg>
    );
}

export function FundDetail({ fundId }: FundDetailProps) {
    const [fund, setFund] = useState<MutualFund | null>(null);
    const [navHistory, setNavHistory] = useState<NavData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>("1Y");

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
                        <NavChart data={filteredNavData} />
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
                        <div className="stock-stat-card">
                            <span className="stock-stat-label">Data Points</span>
                            <span className="stock-stat-value">{navHistory.length}</span>
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

            {/* Recent NAV Table */}
            {navHistory.length > 0 && (
                <div className="stock-trades-card">
                    <h3 className="stock-section-title">Recent NAV History</h3>
                    <div className="stock-trades-table">
                        <div className="fund-nav-header">
                            <span>Date</span>
                            <span>NAV</span>
                            <span>Change</span>
                        </div>
                        {navHistory.slice(0, 10).map((nav, i) => {
                            const prevNav = navHistory[i + 1];
                            const change = prevNav ? nav.nav_price - prevNav.nav_price : 0;
                            const percentChange = prevNav ? ((change / prevNav.nav_price) * 100) : 0;
                            const isUp = change >= 0;

                            return (
                                <div key={nav.nav_date} className={`fund-nav-row ${isUp ? "row-up" : "row-down"}`}>
                                    <span>{formatDate(nav.nav_date)}</span>
                                    <span>{formatPrice(nav.nav_price)}</span>
                                    <span className={isUp ? "highlight-up" : "highlight-down"}>
                                        {isUp ? "↑" : "↓"} {formatPercent(percentChange)}
                                    </span>
                                </div>
                            );
                        })}
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
