import { DashboardPanel } from "@/components/dashboard";

export default function StocksPage() {
    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Stocks</h1>
                <p className="dashboard-date">Pakistan Stock Exchange</p>
            </header>

            <DashboardPanel title="All Stocks" className="coming-soon-panel">
                <span className="coming-soon-icon">📈</span>
                <p className="coming-soon-text">Full stock listing coming soon</p>
            </DashboardPanel>
        </>
    );
}
