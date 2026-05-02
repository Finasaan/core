"use client";

import { useState, useEffect } from "react";
import { StocksList } from "@/components/dashboard";
import type { Sector } from "@/lib/sectors";
import { getSectors } from "@/lib/sectors";
import { NewsWidget } from "@/components/news";


// Bills & bonds sector to exclude from filter
const BILLS_BONDS_SECTOR_ID = "978757d6-3c54-4704-bf4b-5f0e489ab668";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function StocksPage() {
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [selectedSector, setSelectedSector] = useState("");

    // Fetch sectors for filter chips
    useEffect(() => {
        getSectors().then((data) => {
            setSectors(
                data.filter(
                    (s) => s.id !== BILLS_BONDS_SECTOR_ID && s.company_count > 0
                )
            );
        });
    }, []);

    return (
        <>
            <header className="dashboard-header">
                <h1 className="dashboard-greeting">Stocks</h1>
                <p className="dashboard-date">Pakistan Stock Exchange</p>
            </header>

            {/* Search Bar */}
            <div className="stocks-search-bar">
                <svg className="stocks-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#708090" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    className="stocks-search-input"
                    placeholder="Search stocks by symbol or name..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                    <button
                        className="stocks-search-clear"
                        onClick={() => setSearchInput("")}
                        aria-label="Clear search"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Sector Filter Chips */}
            {sectors.length > 0 && (
                <div className="sector-filter-bar">
                    <button
                        className={`sector-chip ${selectedSector === "" ? "active" : ""}`}
                        onClick={() => setSelectedSector("")}
                    >
                        All Sectors
                    </button>
                    {sectors.map((sector) => (
                        <button
                            key={sector.id}
                            className={`sector-chip ${selectedSector === sector.id ? "active" : ""}`}
                            onClick={() =>
                                setSelectedSector(selectedSector === sector.id ? "" : sector.id)
                            }
                        >
                            {sector.name}
                            <span className="sector-chip-count">{sector.company_count}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <StocksList searchQuery={debouncedSearch} sectorId={selectedSector} />
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <NewsWidget title="Contextual News" />
                    </div>
                </div>
            </div>

        </>
    );
}
