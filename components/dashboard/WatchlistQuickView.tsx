"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWatchlist, type WatchlistItem } from "@/lib/watchlist";
import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth/client";

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
    }).format(price);
}

function formatPct(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

const MAX_ITEMS = 5;

export function WatchlistQuickView() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            if (!await checkIsAuthenticated()) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);

            try {
                const data = await getWatchlist("all");
                setItems(data.slice(0, MAX_ITEMS));
            } catch (err) {
                console.error("Failed to fetch watchlist:", err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, []);

    // Render loading skeleton
    if (loading) {
        return (
            <div className="wqv-container">
                <div className="wqv-header">
                    <h2 className="dashboard-panel-title">Watchlist</h2>
                </div>
                <div className="wqv-list">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="wqv-item skeleton-card">
                            <div className="skeleton-line w-24 h-4" />
                            <div className="skeleton-line w-16 h-4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Not logged in
    if (!isAuthenticated) {
        return (
            <div className="wqv-container">
                <div className="wqv-header">
                    <h2 className="dashboard-panel-title">Watchlist</h2>
                </div>
                <div className="wqv-empty">
                    <span className="wqv-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </span>
                    <p className="wqv-empty-text">Sign in to track your favorite stocks and funds</p>
                </div>
            </div>
        );
    }

    // Empty watchlist
    if (items.length === 0) {
        return (
            <div className="wqv-container">
                <div className="wqv-header">
                    <h2 className="dashboard-panel-title">Watchlist</h2>
                    <Link href="/dashboard/watchlist" className="wqv-view-all">
                        View All
                    </Link>
                </div>
                <div className="wqv-empty">
                    <span className="wqv-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </span>
                    <p className="wqv-empty-text">No items in your watchlist yet</p>
                    <p className="wqv-empty-subtext">
                        Star stocks and funds from their detail pages to track them here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="wqv-container">
            <div className="wqv-header">
                <h2 className="dashboard-panel-title">Watchlist</h2>
                <Link href="/dashboard/watchlist" className="wqv-view-all">
                    View All
                </Link>
            </div>
            <div className="wqv-list">
                {items.map((item) => (
                    <WatchlistQuickItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

function WatchlistQuickItem({ item }: { item: WatchlistItem }) {
    const isStock = item.type === "stock";
    const href = isStock
        ? `/dashboard/stocks/${item.symbol}`
        : `/dashboard/funds/${item.asset_id}`;

    let price: number | null = null;
    let change: number | null = null;
    let changePct: number | null = null;

    if (isStock && item.price_data) {
        price = item.price_data.close_price;
        change = item.price_data.change;
        changePct = item.price_data.change_pct;
    } else if (!isStock && item.nav_data) {
        price = item.nav_data.nav_price;
        change = item.nav_data.change;
        changePct = item.nav_data.change_pct;
    }

    const isUp = (change ?? 0) >= 0;

    return (
        <Link href={href} className="wqv-item">
            <div className="wqv-item-left">
                <span className="wqv-item-symbol">{item.symbol || "—"}</span>
                <span className="wqv-item-name">{item.name || "Unknown"}</span>
            </div>
            <div className="wqv-item-right">
                {price !== null ? (
                    <>
                        <span className="wqv-item-price">{formatPrice(price)}</span>
                        {changePct !== null && (
                            <span className={`wqv-item-change ${isUp ? "up" : "down"}`}>
                                {formatPct(changePct)}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="wqv-item-price wqv-no-data">—</span>
                )}
            </div>
        </Link>
    );
}
