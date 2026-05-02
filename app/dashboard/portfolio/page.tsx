"use client";

import { PortfolioList } from "@/components/dashboard";
import { PortfolioAISummaryCard } from "@/components/dashboard/PortfolioAISummaryCard";

export default function PortfolioPage() {
    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Portfolio</h1>
                <p className="dashboard-date">Track your investments</p>
            </header>

            <PortfolioAISummaryCard />
            <PortfolioList />
        </>
    );
}
