"use client";

import { useState, useEffect, useCallback } from "react";
import { AssetList, AssetItem } from "./AssetList";
import { Pagination } from "./Pagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface StocksListProps {
    searchQuery?: string;
    sectorId?: string;
    initialPageSize?: number;
}

interface ApiResponse {
    success: boolean;
    data: AssetItem[];
    pagination?: {
        limit: number;
        offset: number;
        total: number;
    };
}

export function StocksList({ searchQuery = "", sectorId = "", initialPageSize = 20 }: StocksListProps) {
    const [stocks, setStocks] = useState<AssetItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / pageSize) || 1;

    const fetchStocks = useCallback(async () => {
        setLoading(true);
        try {
            const offset = (page - 1) * pageSize;
            const params = new URLSearchParams({
                limit: pageSize.toString(),
                offset: offset.toString(),
                withPrice: "true",
            });

            if (searchQuery.trim()) {
                params.set("search", searchQuery.trim());
            }

            if (sectorId.trim()) {
                params.set("sector", sectorId.trim());
            }

            const response = await fetch(`${API_URL}/api/psx/companies?${params}`);
            const data = await response.json() as ApiResponse;

            if (data.success) {
                setStocks(data.data || []);
                setTotal(data.pagination?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch stocks:", error);
            setStocks([]);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, searchQuery, sectorId]);

    // Fetch on mount and when params change
    useEffect(() => {
        fetchStocks();
    }, [fetchStocks]);

    // Reset to page 1 when search, sector, or page size changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery, sectorId, pageSize]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
    };

    return (
        <div className="stocks-list-container">
            <AssetList
                items={stocks}
                type="stock"
                loading={loading}
                emptyMessage={
                    searchQuery
                        ? `No stocks found for "${searchQuery}"`
                        : sectorId
                            ? "No stocks found in this sector"
                            : "No stocks available"
                }
            />

            {!loading && stocks.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            {!loading && (
                <div className="stocks-list-count">
                    Showing {stocks.length} of {total} stocks
                </div>
            )}
        </div>
    );
}
