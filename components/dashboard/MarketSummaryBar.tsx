"use client";

import { useEffect, useState } from "react";
import { getMarketSummary, type MarketSummary } from "@/lib/market";

function formatNumber(num: number): string {
    return new Intl.NumberFormat("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

function formatChange(num: number): string {
    const sign = num >= 0 ? "+" : "";
    return `${sign}${formatNumber(num)}`;
}

function formatPct(num: number): string {
    const sign = num >= 0 ? "+" : "";
    return `${sign}${num.toFixed(2)}%`;
}

function getStatusLabel(status: MarketSummary["market_status"]): string {
    switch (status) {
        case "open":
            return "Market Open";
        case "closed":
            return "Market Closed";
        case "pre_market":
            return "Pre-Market";
        case "post_market":
            return "Post-Market";
        default:
            return "Market Closed";
    }
}

function getStatusClass(status: MarketSummary["market_status"]): string {
    switch (status) {
        case "open":
            return "status-open";
        case "pre_market":
        case "post_market":
            return "status-pre-post";
        default:
            return "status-closed";
    }
}

export function MarketSummaryBar() {
    const [data, setData] = useState<MarketSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMarketSummary()
            .then((result) => setData(result))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="market-summary-bar skeleton">
                <div className="market-summary-bar-inner">
                    <div className="skeleton-line w-32 h-4" />
                    <div className="skeleton-line w-48 h-6" />
                    <div className="skeleton-line w-24 h-4" />
                </div>
            </div>
        );
    }

    if (!data || !data.kse100) {
        return null; // Don't show the bar if no data
    }

    const kse100 = data.kse100;
    const isUp = kse100.net_change >= 0;
    const tradeDate = new Date(data.trade_date + "T00:00:00").toLocaleDateString("en-PK", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    return (
        <div className={`market-summary-bar ${isUp ? "market-up" : "market-down"}`}>
            <div className="market-summary-bar-inner">
                {/* KSE-100 Index */}
                <div className="market-index-group">
                    <span className="market-index-label">KSE-100</span>
                    <span className="market-index-value">{formatNumber(kse100.current_close)}</span>
                    <span className={`market-index-change ${isUp ? "up" : "down"}`}>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            {isUp ? (
                                <path d="M12 19V5M5 12l7-7 7 7" />
                            ) : (
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            )}
                        </svg>
                        {formatChange(kse100.net_change)}
                    </span>
                    <span className={`market-index-pct ${isUp ? "up" : "down"}`}>
                        ({formatPct(kse100.change_pct)})
                    </span>
                </div>

                {/* Divider */}
                <div className="market-bar-divider" />

                {/* KSE-30 Index (if available) */}
                {data.kse30 && (
                    <>
                        <div className="market-index-group secondary">
                            <span className="market-index-label">KSE-30</span>
                            <span className="market-index-value">
                                {formatNumber(data.kse30.current_close)}
                            </span>
                            <span
                                className={`market-index-change ${data.kse30.net_change >= 0 ? "up" : "down"}`}
                            >
                                {formatChange(data.kse30.net_change)}
                            </span>
                            <span className={`market-index-pct ${data.kse30.net_change >= 0 ? "up" : "down"}`}>
                                ({formatPct(data.kse30.change_pct)})
                            </span>
                        </div>
                        <div className="market-bar-divider" />
                    </>
                )}

                {/* Market Status */}
                <div className="market-status-group">
                    <span className={`market-status-badge ${getStatusClass(data.market_status)}`}>
                        <span className="market-status-dot" />
                        {getStatusLabel(data.market_status)}
                    </span>
                    <span className="market-trade-date">{tradeDate}</span>
                    {data.is_stale && (
                        <span className="market-stale-badge">Delayed</span>
                    )}
                </div>
            </div>
        </div>
    );
}
