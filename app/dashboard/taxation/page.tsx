import { DashboardPanel } from "@/components/dashboard";

export default function TaxationPage() {
    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Taxation</h1>
                <p className="dashboard-date">Tax Information & Resources</p>
            </header>

            <DashboardPanel title="Tax Information" className="coming-soon-panel">
                <span className="coming-soon-icon">🧾</span>
                <p className="coming-soon-text">Taxation resources coming soon</p>
            </DashboardPanel>
        </>
    );
}
