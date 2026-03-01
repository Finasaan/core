"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSectorById, getSectorCompanies } from "@/lib/sectors";
import type { Sector, SectorCompany } from "@/lib/sectors";
import { AssetList } from "@/components/dashboard/AssetList";
import { Pagination } from "@/components/dashboard/Pagination";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

export default function SectorDetailPage() {
    const params = useParams();
    const sectorId = params.id as string;

    const [sector, setSector] = useState<Sector | null>(null);
    const [companies, setCompanies] = useState<SectorCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);

    const totalPages = Math.ceil(total / pageSize) || 1;

    // Fetch sector info
    useEffect(() => {
        getSectorById(sectorId)
            .then((data) => {
                if (!data) setError("Sector not found");
                else setSector(data);
            })
            .catch(() => setError("Failed to load sector"));
    }, [sectorId]);

    // Fetch companies
    const fetchCompanies = useCallback(async () => {
        setListLoading(true);
        try {
            const offset = (page - 1) * pageSize;
            const result = await getSectorCompanies(sectorId, {
                limit: pageSize,
                offset,
                search: debouncedSearch || undefined,
                withPrice: true,
            });
            setCompanies(result.data);
            setTotal(result.total);
        } catch {
            setCompanies([]);
        } finally {
            setListLoading(false);
            setLoading(false);
        }
    }, [sectorId, page, pageSize, debouncedSearch]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    // Reset page on search change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, pageSize]);

    if (error) {
        return (
            <div className="stock-error">
                <div className="stock-error-icon">📊</div>
                <h2>Sector Not Found</h2>
                <p>{error}</p>
                <Link href="/dashboard/sectors" className="stock-back-link">
                    ← Back to Sectors
                </Link>
            </div>
        );
    }

    // Map SectorCompany to AssetItem shape for AssetList
    const assetItems = companies.map((c) => ({
        id: c.id,
        symbol: c.symbol,
        company_name: c.company_name,
        close_price: c.close_price,
        open_price: c.open_price,
    }));

    return (
        <>
            <header className="dashboard-header">
                <Link href="/dashboard/sectors" className="stock-back-link" style={{ marginBottom: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Sectors
                </Link>
                <h1 className="dashboard-greeting">
                    {loading ? "Loading..." : sector?.name || "Sector"}
                </h1>
                <p className="dashboard-date">
                    {sector?.description || `${total} companies in this sector`}
                </p>
            </header>

            {/* Search */}
            <div className="stocks-search-bar">
                <svg className="stocks-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#708090" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    className="stocks-search-input"
                    placeholder="Search companies in this sector..."
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

            {/* Companies list */}
            <div className="stocks-list-container">
                <AssetList
                    items={assetItems}
                    type="stock"
                    loading={loading || listLoading}
                    emptyMessage={
                        debouncedSearch
                            ? `No companies found for "${debouncedSearch}"`
                            : "No companies in this sector"
                    }
                />

                {!listLoading && companies.length > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={(p) => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onPageSizeChange={setPageSize}
                    />
                )}

                {!listLoading && (
                    <div className="stocks-list-count">
                        Showing {companies.length} of {total} companies
                    </div>
                )}
            </div>
        </>
    );
}
