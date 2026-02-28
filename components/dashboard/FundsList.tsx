"use client";

import { useState, useEffect, useCallback } from "react";
import { AssetList, AssetItem } from "./AssetList";
import { Pagination } from "./Pagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface FundsListProps {
    searchQuery?: string;
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

export function FundsList({ searchQuery = "", initialPageSize = 20 }: FundsListProps) {
    const [funds, setFunds] = useState<AssetItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / pageSize) || 1;

    const fetchFunds = useCallback(async () => {
        setLoading(true);
        try {
            const offset = (page - 1) * pageSize;
            const params = new URLSearchParams({
                limit: pageSize.toString(),
                offset: offset.toString(),
            });

            if (searchQuery.trim()) {
                params.set("search", searchQuery.trim());
            }

            const response = await fetch(`${API_URL}/api/mfs/funds?${params}`);
            const data = await response.json() as ApiResponse;

            if (data.success) {
                setFunds(data.data || []);
                setTotal(data.pagination?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch mutual funds:", error);
            setFunds([]);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, searchQuery]);

    // Fetch on mount and when params change
    useEffect(() => {
        fetchFunds();
    }, [fetchFunds]);

    // Reset to page 1 when search or page size changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery, pageSize]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
    };

    return (
        <div className="stocks-list-container">
            <AssetList
                items={funds}
                type="fund"
                loading={loading}
                emptyMessage={
                    searchQuery
                        ? `No mutual funds found for "${searchQuery}"`
                        : "No mutual funds available"
                }
            />

            {!loading && funds.length > 0 && (
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
                    Showing {funds.length} of {total} mutual funds
                </div>
            )}
        </div>
    );
}
