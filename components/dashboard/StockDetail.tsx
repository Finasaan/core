"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface Company {
    id: string;
    symbol: string;
    company_name: string;
    description?: string;
    sector_id?: string;
    website_url?: string;
    logo_url?: string;
    founded_year?: number;
    ceo_name?: string;
}

interface StockData {
    trade_date: string;
    open_price: number;
    high_price: number;
    low_price: number;
    close_price: number;
    volume: number;
    value_traded: number;
}

interface StockDetailProps {
    symbol: string;
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

function PriceChange({ current, previous }: { current: number; previous?: number }) {
    if (!previous) return null;
    const change = current - previous;
    const percentChange = ((change / previous) * 100).toFixed(2);
    const isUp = change >= 0;

    return (
        <span className={`stock-price-change ${isUp ? "up" : "down"}`}>
            {isUp ? "↑" : "↓"} {formatPrice(Math.abs(change))} ({isUp ? "+" : ""}{percentChange}%)
        </span>
    );
}

export function StockDetail({ symbol }: StockDetailProps) {
    const [company, setCompany] = useState<Company | null>(null);
    const [priceHistory, setPriceHistory] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                // Fetch company details
                const companyRes = await fetch(`${API_URL}/api/psx/companies/symbol/${symbol}`);
                const companyData = await companyRes.json() as { success: boolean; data?: Company; error?: string };

                if (!companyData.success || !companyData.data) {
                    setError(companyData.error || "Company not found");
                    return;
                }

                setCompany(companyData.data);

                // Fetch price history
                const priceRes = await fetch(`${API_URL}/api/psx/companies/${companyData.data.id}/stock-data?limit=30`);
                const priceData = await priceRes.json() as { success: boolean; data?: StockData[] };

                if (priceData.success && priceData.data) {
                    setPriceHistory(priceData.data);
                }
            } catch (err) {
                setError("Failed to load stock data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [symbol]);

    if (loading) {
        return <StockDetailSkeleton />;
    }

    if (error || !company) {
        return (
            <div className="stock-error">
                <div className="stock-error-icon">📉</div>
                <h2>Stock Not Found</h2>
                <p>{error || "Unable to load stock data"}</p>
                <Link href="/dashboard/stocks" className="stock-back-link">
                    ← Back to Stocks
                </Link>
            </div>
        );
    }

    const latestPrice = priceHistory[0];
    const previousPrice = priceHistory[1];
    const highestPrice = priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.high_price)) : 0;
    const lowestPrice = priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.low_price)) : 0;
    const avgVolume = priceHistory.length > 0
        ? priceHistory.reduce((sum, p) => sum + p.volume, 0) / priceHistory.length
        : 0;

    return (
        <div className="stock-detail">
            {/* Header */}
            <div className="stock-detail-header">
                <Link href="/dashboard/stocks" className="stock-back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                </Link>
            </div>

            {/* Main Price Card */}
            <div className="stock-price-card">
                <div className="stock-price-header">
                    <div className="stock-symbol-badge">{company.symbol}</div>
                    <h1 className="stock-company-name">{company.company_name || company.symbol}</h1>
                </div>

                {latestPrice ? (
                    <div className="stock-price-main">
                        <span className="stock-current-price">{formatPrice(latestPrice.close_price)}</span>
                        <PriceChange current={latestPrice.close_price} previous={previousPrice?.close_price} />
                        <span className="stock-price-date">as of {formatDate(latestPrice.trade_date)}</span>
                    </div>
                ) : (
                    <div className="stock-price-main">
                        <span className="stock-no-data">No price data available</span>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            {latestPrice && (
                <div className="stock-stats-grid">
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">Open</span>
                        <span className="stock-stat-value">{formatPrice(latestPrice.open_price)}</span>
                    </div>
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">High</span>
                        <span className="stock-stat-value highlight-up">{formatPrice(latestPrice.high_price)}</span>
                    </div>
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">Low</span>
                        <span className="stock-stat-value highlight-down">{formatPrice(latestPrice.low_price)}</span>
                    </div>
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">Close</span>
                        <span className="stock-stat-value">{formatPrice(latestPrice.close_price)}</span>
                    </div>
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">Volume</span>
                        <span className="stock-stat-value">{formatNumber(latestPrice.volume)}</span>
                    </div>
                    <div className="stock-stat-card">
                        <span className="stock-stat-label">Value Traded</span>
                        <span className="stock-stat-value">{formatNumber(latestPrice.value_traded)}</span>
                    </div>
                </div>
            )}

            {/* 30-Day Summary */}
            {priceHistory.length > 1 && (
                <div className="stock-summary-card">
                    <h3 className="stock-section-title">30-Day Summary</h3>
                    <div className="stock-summary-grid">
                        <div className="stock-summary-item">
                            <span className="stock-summary-label">Highest</span>
                            <span className="stock-summary-value highlight-up">{formatPrice(highestPrice)}</span>
                        </div>
                        <div className="stock-summary-item">
                            <span className="stock-summary-label">Lowest</span>
                            <span className="stock-summary-value highlight-down">{formatPrice(lowestPrice)}</span>
                        </div>
                        <div className="stock-summary-item">
                            <span className="stock-summary-label">Avg Volume</span>
                            <span className="stock-summary-value">{formatNumber(avgVolume)}</span>
                        </div>
                        <div className="stock-summary-item">
                            <span className="stock-summary-label">Trading Days</span>
                            <span className="stock-summary-value">{priceHistory.length}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Company Info */}
            <div className="stock-info-card">
                <h3 className="stock-section-title">Company Information</h3>
                <div className="stock-info-grid">
                    {company.ceo_name && (
                        <div className="stock-info-item">
                            <span className="stock-info-label">CEO</span>
                            <span className="stock-info-value">{company.ceo_name}</span>
                        </div>
                    )}
                    {company.founded_year && (
                        <div className="stock-info-item">
                            <span className="stock-info-label">Founded</span>
                            <span className="stock-info-value">{company.founded_year}</span>
                        </div>
                    )}
                    {company.website_url && (
                        <div className="stock-info-item">
                            <span className="stock-info-label">Website</span>
                            <a
                                href={company.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="stock-info-link"
                            >
                                {company.website_url.replace(/^https?:\/\//, "")}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
                {company.description && (
                    <p className="stock-description">{company.description}</p>
                )}
            </div>

            {/* Recent Trades */}
            {priceHistory.length > 0 && (
                <div className="stock-trades-card">
                    <h3 className="stock-section-title">Recent Trading Days</h3>
                    <div className="stock-trades-table">
                        <div className="stock-trades-header">
                            <span>Date</span>
                            <span>Open</span>
                            <span>High</span>
                            <span>Low</span>
                            <span>Close</span>
                            <span>Volume</span>
                        </div>
                        {priceHistory.slice(0, 7).map((day) => {
                            const isUp = day.close_price >= day.open_price;
                            return (
                                <div key={day.trade_date} className={`stock-trades-row ${isUp ? "row-up" : "row-down"}`}>
                                    <span>{formatDate(day.trade_date)}</span>
                                    <span>{formatPrice(day.open_price)}</span>
                                    <span className="highlight-up">{formatPrice(day.high_price)}</span>
                                    <span className="highlight-down">{formatPrice(day.low_price)}</span>
                                    <span className={isUp ? "highlight-up" : "highlight-down"}>{formatPrice(day.close_price)}</span>
                                    <span>{formatNumber(day.volume)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function StockDetailSkeleton() {
    return (
        <div className="stock-detail">
            <div className="stock-price-card skeleton-card">
                <div className="skeleton-line w-24 h-6" />
                <div className="skeleton-line w-48 h-8 mt-2" />
                <div className="skeleton-line w-32 h-10 mt-4" />
            </div>
            <div className="stock-stats-grid">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="stock-stat-card skeleton-card">
                        <div className="skeleton-line w-16 h-4" />
                        <div className="skeleton-line w-24 h-6 mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
