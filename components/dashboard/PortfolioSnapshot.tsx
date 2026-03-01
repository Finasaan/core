"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    listPortfolios,
    getPortfolioSummary,
    type Portfolio,
    type PortfolioSummary,
    type HoldingSummary,
} from "@/lib/portfolio";

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function formatPct(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

function formatChange(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)}`;
}

interface SnapshotData {
    totalValue: number;
    totalPL: number;
    totalPLPct: number;
    dailyChange: number;
    dailyChangePct: number;
    topGainer: HoldingSummary | null;
    topLoser: HoldingSummary | null;
    portfolioId: string;
}

export function PortfolioSnapshot() {
    const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        const checkAuthAndFetch = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);

            try {
                // Get user's portfolios
                const portfolios = await listPortfolios();

                if (!portfolios || portfolios.length === 0) {
                    setLoading(false);
                    return;
                }

                // Use the first portfolio (primary)
                const primaryPortfolio = portfolios[0];
                const summary = await getPortfolioSummary(primaryPortfolio.id);

                // Find top gainer and top loser from holdings
                let topGainer: HoldingSummary | null = null;
                let topLoser: HoldingSummary | null = null;

                if (summary.holdings && summary.holdings.length > 0) {
                    const sorted = [...summary.holdings].sort(
                        (a, b) => b.daily_change_pct - a.daily_change_pct
                    );
                    topGainer = sorted[0].daily_change_pct > 0 ? sorted[0] : null;
                    topLoser =
                        sorted[sorted.length - 1].daily_change_pct < 0
                            ? sorted[sorted.length - 1]
                            : null;
                }

                setSnapshot({
                    totalValue: summary.total_value,
                    totalPL: summary.total_pl,
                    totalPLPct: summary.total_pl_pct,
                    dailyChange: summary.daily_change,
                    dailyChangePct: summary.daily_change_pct,
                    topGainer,
                    topLoser,
                    portfolioId: primaryPortfolio.id,
                });
            } catch (err) {
                console.error("Failed to fetch portfolio snapshot:", err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, []);

    // Loading
    if (loading) {
        return (
            <div className="ps-container">
                <div className="ps-header">
                    <h2 className="dashboard-panel-title">Portfolio</h2>
                </div>
                <div className="ps-content">
                    <div className="skeleton-line w-32 h-8" />
                    <div className="skeleton-line w-24 h-4 mt-2" />
                    <div className="skeleton-line w-48 h-4 mt-2" />
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="ps-container">
                <div className="ps-header">
                    <h2 className="dashboard-panel-title">Portfolio</h2>
                </div>
                <div className="ps-empty">
                    <span className="ps-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" />
                            <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" />
                        </svg>
                    </span>
                    <p className="ps-empty-text">Sign in to view your portfolio</p>
                </div>
            </div>
        );
    }

    // No portfolio
    if (!snapshot) {
        return (
            <div className="ps-container">
                <div className="ps-header">
                    <h2 className="dashboard-panel-title">Portfolio</h2>
                    <Link href="/dashboard/portfolio" className="ps-view-all">
                        Manage
                    </Link>
                </div>
                <div className="ps-empty">
                    <span className="ps-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" />
                            <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" />
                        </svg>
                    </span>
                    <p className="ps-empty-text">No portfolio yet</p>
                    <p className="ps-empty-subtext">
                        Create a portfolio to track your investments
                    </p>
                </div>
            </div>
        );
    }

    const isUpTotal = snapshot.totalPL >= 0;
    const isUpDaily = snapshot.dailyChange >= 0;

    return (
        <div className="ps-container">
            <div className="ps-header">
                <h2 className="dashboard-panel-title">Portfolio</h2>
                <Link href="/dashboard/portfolio" className="ps-view-all">
                    View Details
                </Link>
            </div>
            <div className="ps-content">
                {/* Total Value */}
                <div className="ps-total-value">
                    <span className="ps-total-label">Total Value</span>
                    <span className="ps-total-amount">{formatPrice(snapshot.totalValue)}</span>
                </div>

                {/* P/L Row */}
                <div className="ps-pl-row">
                    <div className="ps-pl-item">
                        <span className="ps-pl-label">Total P/L</span>
                        <span className={`ps-pl-value ${isUpTotal ? "up" : "down"}`}>
                            {formatChange(snapshot.totalPL)} ({formatPct(snapshot.totalPLPct)})
                        </span>
                    </div>
                    <div className="ps-pl-item">
                        <span className="ps-pl-label">Today</span>
                        <span className={`ps-pl-value ${isUpDaily ? "up" : "down"}`}>
                            {formatChange(snapshot.dailyChange)} ({formatPct(snapshot.dailyChangePct)})
                        </span>
                    </div>
                </div>

                {/* Top Gainer / Loser */}
                {(snapshot.topGainer || snapshot.topLoser) && (
                    <div className="ps-movers">
                        {snapshot.topGainer && (
                            <div className="ps-mover up">
                                <span className="ps-mover-label">Top Gainer</span>
                                <span className="ps-mover-symbol">
                                    {snapshot.topGainer.symbol || "—"}
                                </span>
                                <span className="ps-mover-change up">
                                    {formatPct(snapshot.topGainer.daily_change_pct)}
                                </span>
                            </div>
                        )}
                        {snapshot.topLoser && (
                            <div className="ps-mover down">
                                <span className="ps-mover-label">Top Loser</span>
                                <span className="ps-mover-symbol">
                                    {snapshot.topLoser.symbol || "—"}
                                </span>
                                <span className="ps-mover-change down">
                                    {formatPct(snapshot.topLoser.daily_change_pct)}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
