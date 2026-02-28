"use client";

import { useEffect, useState } from "react";
import { DashboardPanel, AssetList, AssetItem } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function DashboardPage() {
    const [stocks, setStocks] = useState<AssetItem[]>([]);
    const [funds, setFunds] = useState<AssetItem[]>([]);
    const [loadingStocks, setLoadingStocks] = useState(true);
    const [loadingFunds, setLoadingFunds] = useState(true);
    const [userName, setUserName] = useState("");
    const supabase = createClient();

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

        // Fetch user profile for name
        const fetchProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;

                const response = await fetch(`${API_URL}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json() as { success: boolean; data?: { display_name?: string } };
                    if (result.success && result.data?.display_name) {
                        setUserName(result.data.display_name.split(" ")[0]); // First name only
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, [supabase.auth]);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">
                    <span className="greeting-green">Welcome back</span>
                    {userName && <>, <span className="greeting-dark">{userName}</span></>}
                </h1>
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
