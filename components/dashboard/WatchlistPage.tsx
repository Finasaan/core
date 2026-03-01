"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    getWatchlist,
    removeFromWatchlist,
    type WatchlistItem,
    type WatchlistStockItem,
    type WatchlistFundItem,
} from "@/lib/watchlist";

type FilterType = "all" | "stock" | "fund";

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

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function WatchlistPage() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getWatchlist(filter);
            setItems(data);
        } catch (err) {
            console.error("Failed to fetch watchlist:", err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        const supabase = createClient();

        const checkAndFetch = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);
            fetchItems();
        };

        checkAndFetch();
    }, [fetchItems]);

    const handleRemove = useCallback(
        async (id: string) => {
            setRemovingId(id);
            try {
                await removeFromWatchlist(id);
                setItems((prev) => prev.filter((item) => item.id !== id));
            } catch (err) {
                console.error("Failed to remove from watchlist:", err);
            } finally {
                setRemovingId(null);
            }
        },
        []
    );

    // Unauthenticated
    if (!loading && !isAuthenticated) {
        return (
            <div className="wl-page">
                <div className="wl-page-header">
                    <h1 className="wl-page-title">Watchlist</h1>
                </div>
                <div className="wl-empty-state">
                    <span className="wl-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </span>
                    <h2>Sign in to view your watchlist</h2>
                    <p>Track your favorite stocks and mutual funds in one place</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wl-page">
            <div className="wl-page-header">
                <h1 className="wl-page-title">Watchlist</h1>
                <span className="wl-item-count">
                    {items.length} {items.length === 1 ? "item" : "items"}
                </span>
            </div>

            {/* Filter Tabs */}
            <div className="wl-filter-tabs">
                {(["all", "stock", "fund"] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        className={`wl-filter-tab ${filter === f ? "active" : ""}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === "all" ? "All" : f === "stock" ? "Stocks" : "Funds"}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="wl-table-container">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="wl-row skeleton-card">
                            <div className="skeleton-line w-24 h-4" />
                            <div className="skeleton-line w-32 h-4" />
                            <div className="skeleton-line w-16 h-4" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && items.length === 0 && (
                <div className="wl-empty-state">
                    <span className="wl-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </span>
                    <h2>
                        {filter === "all"
                            ? "Your watchlist is empty"
                            : `No ${filter === "stock" ? "stocks" : "funds"} in your watchlist`}
                    </h2>
                    <p>
                        Star stocks and mutual funds from their detail pages to track them here
                    </p>
                    <div className="wl-empty-actions">
                        <Link href="/dashboard/stocks" className="wl-browse-btn">
                            Browse Stocks
                        </Link>
                        <Link href="/dashboard/funds" className="wl-browse-btn secondary">
                            Browse Funds
                        </Link>
                    </div>
                </div>
            )}

            {/* Table */}
            {!loading && items.length > 0 && (
                <div className="wl-table-container">
                    <div className="wl-table">
                        <div className="wl-table-header">
                            <span className="wl-col-symbol">Symbol</span>
                            <span className="wl-col-name">Name</span>
                            <span className="wl-col-type">Type</span>
                            <span className="wl-col-price">Price</span>
                            <span className="wl-col-change">Change</span>
                            <span className="wl-col-added">Added</span>
                            <span className="wl-col-action" />
                        </div>
                        {items.map((item) => (
                            <WatchlistRow
                                key={item.id}
                                item={item}
                                onRemove={handleRemove}
                                removing={removingId === item.id}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function WatchlistRow({
    item,
    onRemove,
    removing,
}: {
    item: WatchlistItem;
    onRemove: (id: string) => void;
    removing: boolean;
}) {
    const isStock = item.type === "stock";
    const href = isStock
        ? `/dashboard/stocks/${item.symbol}`
        : `/dashboard/funds/${item.asset_id}`;

    let price: number | null = null;
    let change: number | null = null;
    let changePct: number | null = null;

    if (isStock) {
        const stockItem = item as WatchlistStockItem;
        if (stockItem.price_data) {
            price = stockItem.price_data.close_price;
            change = stockItem.price_data.change;
            changePct = stockItem.price_data.change_pct;
        }
    } else {
        const fundItem = item as WatchlistFundItem;
        if (fundItem.nav_data) {
            price = fundItem.nav_data.nav_price;
            change = fundItem.nav_data.change;
            changePct = fundItem.nav_data.change_pct;
        }
    }

    const isUp = (change ?? 0) >= 0;

    return (
        <div className="wl-table-row">
            <Link href={href} className="wl-row-link">
                <span className="wl-col-symbol">
                    <span className="wl-symbol-text">{item.symbol || "—"}</span>
                </span>
                <span className="wl-col-name">{item.name || "Unknown"}</span>
                <span className="wl-col-type">
                    <span className={`wl-type-badge ${item.type}`}>
                        {isStock ? "Stock" : "Fund"}
                    </span>
                </span>
                <span className="wl-col-price">
                    {price !== null ? formatPrice(price) : "—"}
                </span>
                <span className={`wl-col-change ${isUp ? "up" : "down"}`}>
                    {changePct !== null ? formatPct(changePct) : "—"}
                </span>
                <span className="wl-col-added">
                    {formatDate(item.added_at)}
                </span>
            </Link>
            <span className="wl-col-action">
                <button
                    className={`wl-remove-btn ${removing ? "removing" : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(item.id);
                    }}
                    disabled={removing}
                    title="Remove from watchlist"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </span>
        </div>
    );
}
