"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPortfolioSummary } from "@/lib/portfolio";
import type { PortfolioSummary } from "@/lib/portfolio";
import { PortfolioDashboard } from "@/components/dashboard/PortfolioDashboard";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { AddHoldingDialog } from "@/components/dashboard/AddHoldingDialog";

export default function PortfolioDetailPage() {
    const params = useParams();
    const router = useRouter();
    const portfolioId = params.id as string;

    const [summary, setSummary] = useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddHolding, setShowAddHolding] = useState(false);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPortfolioSummary(portfolioId);
            setSummary(data);
        } catch (err: any) {
            setError(err.message || "Failed to load portfolio");
        } finally {
            setLoading(false);
        }
    }, [portfolioId]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    if (loading) {
        return (
            <>
                <header className="dashboard-header">
                    <h1 className="dashboard-greeting">
                        <Link href="/dashboard/portfolio" className="pf-back-link">Portfolio</Link>
                    </h1>
                </header>
                <div className="pf-loading">
                    <div className="pf-loading-spinner" />
                    <p>Loading portfolio...</p>
                </div>
            </>
        );
    }

    if (error || !summary) {
        return (
            <>
                <header className="dashboard-header">
                    <h1 className="dashboard-greeting">
                        <Link href="/dashboard/portfolio" className="pf-back-link">Portfolio</Link>
                    </h1>
                </header>
                <div className="pf-error-state">
                    <p>{error || "Portfolio not found"}</p>
                    <button className="pf-btn-secondary" onClick={() => router.push("/dashboard/portfolio")}>
                        Back to Portfolios
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="dashboard-header">
                <div className="pf-detail-header">
                    <div className="pf-detail-header-left">
                        <Link href="/dashboard/portfolio" className="pf-back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Portfolio
                        </Link>
                        <h1 className="dashboard-greeting">{summary.portfolio.name}</h1>
                        {summary.portfolio.description && (
                            <p className="dashboard-date">{summary.portfolio.description}</p>
                        )}
                    </div>
                    <button className="pf-btn-primary" onClick={() => setShowAddHolding(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Holding
                    </button>
                </div>
            </header>

            <PortfolioDashboard summary={summary} />

            <div className="pf-section">
                <h3 className="pf-section-title">Holdings</h3>
                <HoldingsTable
                    holdings={summary.holdings}
                    portfolioId={portfolioId}
                    onChanged={fetchSummary}
                />
            </div>

            <AddHoldingDialog
                open={showAddHolding}
                portfolioId={portfolioId}
                onClose={() => setShowAddHolding(false)}
                onAdded={fetchSummary}
            />
        </>
    );
}
