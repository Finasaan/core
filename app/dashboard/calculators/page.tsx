import Link from "next/link";

export default function CalculatorsPage() {
    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Calculators</h1>
                <p className="dashboard-date">Investment & Tax Planning Tools</p>
            </header>

            <div className="calculators-grid">
                <Link href="/dashboard/calculators/returns" className="calculator-card">
                    <div className="calculator-card-icon">📈</div>
                    <h3 className="calculator-card-title">Investment Returns</h3>
                    <p className="calculator-card-description">
                        Calculate potential returns with compounding and monthly contributions
                    </p>
                </Link>

                <Link href="/dashboard/calculators/taxation" className="calculator-card">
                    <div className="calculator-card-icon">🧾</div>
                    <h3 className="calculator-card-title">Tax Calculators</h3>
                    <p className="calculator-card-description">
                        Estimate capital gains, dividend tax, and pension credits
                    </p>
                </Link>
            </div>
        </>
    );
}
