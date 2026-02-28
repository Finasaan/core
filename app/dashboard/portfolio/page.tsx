"use client";

import { PortfolioList } from "@/components/dashboard";

export default function PortfolioPage() {
    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Portfolio</h1>
                <p className="dashboard-date">Track your investments</p>
            </header>

            <PortfolioList />
        </>
    );
}
