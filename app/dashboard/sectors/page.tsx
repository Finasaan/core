"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Sector } from "@/lib/sectors";
import { getSectors } from "@/lib/sectors";

// Bills & bonds sector to exclude
const BILLS_BONDS_SECTOR_ID = "978757d6-3c54-4704-bf4b-5f0e489ab668";

export default function SectorsPage() {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSectors()
            .then((data) => {
                setSectors(
                    data.filter(
                        (s) => s.id !== BILLS_BONDS_SECTOR_ID && s.company_count > 0
                    )
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const totalCompanies = sectors.reduce((sum, s) => sum + s.company_count, 0);

    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Sectors</h1>
                <p className="dashboard-date">Pakistan Stock Exchange — {totalCompanies} companies across {sectors.length} sectors</p>
            </header>

            {loading ? (
                <div className="sector-grid">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="sector-card skeleton-card" style={{ height: 120 }}>
                            <div className="skeleton-line w-32 h-5" />
                            <div className="skeleton-line w-16 h-4 mt-2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="sector-grid">
                    {sectors.map((sector) => (
                        <Link
                            key={sector.id}
                            href={`/dashboard/sectors/${sector.id}`}
                            className="sector-card-link"
                        >
                            <div className="sector-card">
                                <div className="sector-card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M6.88 17.76v-2.03M12 17.76v-4.06M17.12 17.76v-6.1M6.88 12.7L10.47 8.1c.62-.78 1.74-.88 2.5-.24l1.49 1.3c.76.64 1.88.54 2.5-.24l3.05-3.82" />
                                    </svg>
                                </div>
                                <h3 className="sector-card-name">{sector.name}</h3>
                                <span className="sector-card-count">
                                    {sector.company_count} {sector.company_count === 1 ? "company" : "companies"}
                                </span>
                                {sector.description && (
                                    <p className="sector-card-desc">{sector.description}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
