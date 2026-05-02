"use client";

import { useEffect, useState } from "react";
import { DashboardPanel, AssetList, AssetItem, NewsStrip } from "@/components/dashboard";
import { MarketSummaryBar } from "@/components/dashboard/MarketSummaryBar";
import { WatchlistQuickView } from "@/components/dashboard/WatchlistQuickView";
import { PortfolioSnapshot } from "@/components/dashboard/PortfolioSnapshot";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function DashboardPage() {
    const [stocks, setStocks] = useState<AssetItem[]>([]);
    const [funds, setFunds] = useState<AssetItem[]>([]);
    const [loadingStocks, setLoadingStocks] = useState(true);
    const [loadingFunds, setLoadingFunds] = useState(true);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        // Fetch top stocks
        fetch(`${API_URL}/api/psx/top-stocks`)
            .then((res) => res.json() as Promise<{ success: boolean; data?: AssetItem[] }>)
            .then((data) => {
                if (data.success && data.data) {
                    setStocks(data.data);
                }
            })
            .catch(console.error)
            .finally(() => setLoadingStocks(false));

        // Fetch top funds
        fetch(`${API_URL}/api/mfs/top-funds`)
            .then((res) => res.json() as Promise<{ success: boolean; data?: AssetItem[] }>)
            .then((data) => {
                if (data.success && data.data) {
                    setFunds(data.data);
                }
            })
            .catch(console.error)
            .finally(() => setLoadingFunds(false));

        // Fetch user profile for name — sb-token cookie sent automatically
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/api/profile`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const result = await response.json() as { success: boolean; data?: { display_name?: string } };
                    if (result.success && result.data?.display_name) {
                        setUserName(result.data.display_name.split(" ")[0]); // First name only
                    }
                }
                // If not ok (e.g. 401), userName stays null — guest greeting shown
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            {/* D-4: Market Summary Bar */}
            <MarketSummaryBar />

            <header className="dashboard-header">
                <h1 className="dashboard-greeting">
                    {userName ? (
                        <>
                            <span className="greeting-green">Welcome back</span>
                            {", "}
                            <span className="greeting-dark">{userName}</span>
                        </>
                    ) : (
                        <span className="greeting-green">Welcome to finasaan</span>
                    )}
                </h1>
                <p className="dashboard-date">{today}</p>
            </header>

            <NewsStrip />

            <div className="dashboard-grid">
                <DashboardPanel title="Top Stocks">
                    <AssetList
                        items={stocks}
                        type="stock"
                        loading={loadingStocks}
                        emptyMessage="No stock data available"
                    />
                </DashboardPanel>

                <DashboardPanel title="Top Mutual Funds">
                    <AssetList
                        items={funds}
                        type="fund"
                        loading={loadingFunds}
                        emptyMessage="No mutual fund data available"
                    />
                </DashboardPanel>

                {/* D-5: Watchlist Quick View (replaces Learning Progress) */}
                <WatchlistQuickView />

                {/* D-6: Portfolio Snapshot (replaces Market News) */}
                <PortfolioSnapshot />
            </div>
        </>
    );
}
