"use client";

import { useEffect, useState } from "react";
import { DashboardPanel, AssetList, AssetItem } from "@/components/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function DashboardPage() {
    const [stocks, setStocks] = useState<AssetItem[]>([]);
    const [funds, setFunds] = useState<AssetItem[]>([]);
    const [loadingStocks, setLoadingStocks] = useState(true);
    const [loadingFunds, setLoadingFunds] = useState(true);

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
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Good morning</h1>
                <p className="dashboard-date">{today}</p>
            </header>

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

                <DashboardPanel title="Learning Progress" className="coming-soon-panel">
                    <span className="coming-soon-icon">📚</span>
                    <p className="coming-soon-text">Coming Soon</p>
                </DashboardPanel>

                <DashboardPanel title="Market News" className="coming-soon-panel">
                    <span className="coming-soon-icon">📰</span>
                    <p className="coming-soon-text">Coming Soon</p>
                </DashboardPanel>
            </div>
        </>
    );
}
