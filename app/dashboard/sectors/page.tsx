"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { SectorPerformance } from "@/lib/sectors";
import { getSectorPerformance } from "@/lib/sectors";

function formatVolume(vol: number): string {
    if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(1) + "B";
    if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(1) + "M";
    if (vol >= 1_000) return (vol / 1_000).toFixed(0) + "K";
    return vol.toLocaleString();
}

function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

type SortKey = "name" | "change" | "companies" | "volume";

export default function SectorsPage() {
    const [sectors, setSectors] = useState<SectorPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortKey>("change");

    useEffect(() => {
        getSectorPerformance()
            .then(setSectors)
            .finally(() => setLoading(false));
    }, []);

    const sortedSectors = [...sectors].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.name.localeCompare(b.name);
            case "change":
                return (b.avg_change_pct ?? -999) - (a.avg_change_pct ?? -999);
            case "companies":
                return b.company_count - a.company_count;
            case "volume":
                return b.total_volume - a.total_volume;
            default:
                return 0;
        }
    });

    const totalCompanies = sectors.reduce((sum, s) => sum + s.company_count, 0);
    const avgMarketChange = sectors.length > 0
        ? sectors.reduce((sum, s) => sum + (s.avg_change_pct ?? 0), 0) / sectors.filter(s => s.avg_change_pct != null).length
        : 0;
    const totalGainers = sectors.reduce((sum, s) => sum + s.gainers, 0);
    const totalLosers = sectors.reduce((sum, s) => sum + s.losers, 0);

    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Sectors</h1>
                <p className="dashboard-date">Pakistan Stock Exchange — {totalCompanies} companies across {sectors.length} sectors</p>
            </header>

            {/* Market Overview Stats */}
            {!loading && sectors.length > 0 && (
                <div className="sector-overview-stats">
                    <div className="sector-stat-pill">
                        <span className="sector-stat-pill-label">Avg Change</span>
                        <span className={`sector-stat-pill-value ${avgMarketChange >= 0 ? "up" : "down"}`}>
                            {formatPercent(avgMarketChange)}
                        </span>
                    </div>
                    <div className="sector-stat-pill">
                        <span className="sector-stat-pill-label">Gainers</span>
                        <span className="sector-stat-pill-value up">{totalGainers}</span>
                    </div>
                    <div className="sector-stat-pill">
                        <span className="sector-stat-pill-label">Losers</span>
                        <span className="sector-stat-pill-value down">{totalLosers}</span>
                    </div>
                    <div className="sector-stat-pill">
                        <span className="sector-stat-pill-label">Sectors</span>
                        <span className="sector-stat-pill-value">{sectors.length}</span>
                    </div>
                </div>
            )}

            {/* Sort Controls */}
            {!loading && sectors.length > 0 && (
                <div className="sector-sort-bar">
                    <span className="sector-sort-label">Sort by:</span>
                    {([
                        { key: "change" as SortKey, label: "Performance" },
                        { key: "name" as SortKey, label: "Name" },
                        { key: "companies" as SortKey, label: "Companies" },
                        { key: "volume" as SortKey, label: "Volume" },
                    ]).map((opt) => (
                        <button
                            key={opt.key}
                            className={`sector-sort-btn ${sortBy === opt.key ? "active" : ""}`}
                            onClick={() => setSortBy(opt.key)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="sector-grid">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="sector-card skeleton-card" style={{ height: 160 }}>
                            <div className="skeleton-line w-32 h-5" />
                            <div className="skeleton-line w-16 h-4 mt-2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="sector-grid">
                    {sortedSectors.map((sector) => {
                        const changeClass = sector.avg_change_pct != null
                            ? sector.avg_change_pct >= 0 ? "up" : "down"
                            : "";

                        return (
                            <Link
                                key={sector.id}
                                href={`/dashboard/sectors/${sector.id}`}
                                className="sector-card-link"
                            >
                                <div className="sector-card sector-card-enhanced">
                                    <div className="sector-card-top">
                                        <div className="sector-card-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M6.88 17.76v-2.03M12 17.76v-4.06M17.12 17.76v-6.1M6.88 12.7L10.47 8.1c.62-.78 1.74-.88 2.5-.24l1.49 1.3c.76.64 1.88.54 2.5-.24l3.05-3.82" />
                                            </svg>
                                        </div>
                                        {sector.avg_change_pct != null && (
                                            <span className={`sector-card-change ${changeClass}`}>
                                                {formatPercent(sector.avg_change_pct)}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="sector-card-name">{sector.name}</h3>
                                    <span className="sector-card-count">
                                        {sector.company_count} {sector.company_count === 1 ? "company" : "companies"}
                                    </span>

                                    <div className="sector-card-metrics">
                                        <div className="sector-card-metric">
                                            <span className="sector-card-metric-label">Vol</span>
                                            <span className="sector-card-metric-value">{formatVolume(sector.total_volume)}</span>
                                        </div>
                                        <div className="sector-card-metric">
                                            <span className="sector-card-metric-label up">G</span>
                                            <span className="sector-card-metric-value">{sector.gainers}</span>
                                        </div>
                                        <div className="sector-card-metric">
                                            <span className="sector-card-metric-label down">L</span>
                                            <span className="sector-card-metric-value">{sector.losers}</span>
                                        </div>
                                    </div>

                                    {sector.top_gainer && (
                                        <div className="sector-card-highlight">
                                            <span className="sector-card-highlight-label">Top:</span>
                                            <span className="sector-card-highlight-symbol">{sector.top_gainer.symbol}</span>
                                            <span className="sector-card-highlight-change up">
                                                {formatPercent(sector.top_gainer.change_pct)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    );
}
