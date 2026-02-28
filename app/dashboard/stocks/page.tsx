"use client";

import { useState, useEffect } from "react";
import { StocksList } from "@/components/dashboard";

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

            <StocksList searchQuery={debouncedSearch} />
        </>
    );
}
