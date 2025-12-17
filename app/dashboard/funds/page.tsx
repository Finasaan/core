import { DashboardPanel } from "@/components/dashboard";

export default function FundsPage() {
    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Mutual Funds</h1>
                <p className="dashboard-date">Pakistan Mutual Fund Market</p>
            </header>

            <DashboardPanel title="All Mutual Funds" className="coming-soon-panel">
                <span className="coming-soon-icon">💰</span>
                <p className="coming-soon-text">Full mutual fund listing coming soon</p>
            </DashboardPanel>
        </>
    );
}
