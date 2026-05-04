"use client";

import { useEffect, useState } from "react";
import { DashboardPanel, AssetList, AssetItem, NewsStrip } from "@/components/dashboard";
import { MarketSummaryBar } from "@/components/dashboard/MarketSummaryBar";
import { WatchlistQuickView } from "@/components/dashboard/WatchlistQuickView";
import { PortfolioSnapshot } from "@/components/dashboard/PortfolioSnapshot";
import { sortStocksByInterests } from "@/lib/personalization";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function DashboardPage() {
    const [stocks, setStocks] = useState<AssetItem[]>([]);
    const [funds, setFunds] = useState<AssetItem[]>([]);
    const [loadingStocks, setLoadingStocks] = useState(true);
    const [loadingFunds, setLoadingFunds] = useState(true);
    const [userName, setUserName] = useState<string | null>(null);
    const [interests, setInterests] = useState<string[]>([]);
    const [financialKnowledge, setFinancialKnowledge] = useState<string | null>(null);

    useEffect(() => {
        // Fetch top stocks
        fetch(`${API_URL}/api/psx/top-stocks`)
            .then((res) => res.json() as Promise<{ success: boolean; data?: AssetItem[] }>)
            .then((data) => {
                if (data.success && data.data) {
                    // Sorting will happen reactively when interests are loaded
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
                    const result = await response.json() as { 
                        success: boolean; 
                        data?: { 
                            display_name?: string;
                            interests?: string[];
                            financial_knowledge?: string;
                        } 
                    };
                    if (result.success && result.data) {
                        if (result.data.display_name) {
                            setUserName(result.data.display_name.split(" ")[0]);
                        }
                        if (result.data.interests) {
                            setInterests(result.data.interests);
                        }
                        if (result.data.financial_knowledge) {
                            setFinancialKnowledge(result.data.financial_knowledge);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

    // Re-sort stocks when interests or raw stock data changes
    const personalizedStocks = sortStocksByInterests(stocks, interests);

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

            {/* Personalized Learning Journey Card */}
            {financialKnowledge === "beginner" && (
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 rounded-xl bg-green-500/20 text-green-600">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900">Start Your Journey</h3>
                            <p className="text-xs text-zinc-600">Master the basics of Pakistan Stock Exchange</p>
                        </div>
                    </div>
                    <Link 
                        href="/dashboard/learn/stock-market-basics"
                        className="flex items-center justify-between p-5 rounded-xl bg-white/60 border border-green-500/10 hover:border-green-500/30 hover:bg-white transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-green-500/20">
                                📊
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900 group-hover:text-green-600 transition-colors">Stock Market Basics</h4>
                                <p className="text-xs text-zinc-500">Step-by-step guide for new investors • 90 mins</p>
                            </div>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                            <ArrowRight className="h-4 w-4 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                    </Link>
                </div>
            )}

            <NewsStrip />

            <div className="dashboard-grid">
                <DashboardPanel title="Top Stocks">
                    <AssetList
                        items={personalizedStocks}
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
