"use client";

import { useEffect, useState, useCallback } from "react";
import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth/client";
import {
    checkWatchlisted,
    addToWatchlist,
    removeByAssetId,
} from "@/lib/watchlist";

interface WatchlistToggleProps {
    assetId: string;
    type: "stock" | "fund";
    className?: string;
}

/**
 * WatchlistToggle (W-1)
 * Star/unstar button for adding/removing assets from the watchlist.
 * Checks watchlist status on mount and toggles via API calls.
 */
export function WatchlistToggle({ assetId, type, className = "" }: WatchlistToggleProps) {
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check initial watchlist status
    useEffect(() => {
        const checkStatus = async () => {
            if (!await checkIsAuthenticated()) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);

            try {
                const result = await checkWatchlisted(assetId, type);
                setIsWatchlisted(result.in_watchlist);
            } catch (err) {
                console.error("Failed to check watchlist status:", err);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [assetId, type]);

    const handleToggle = useCallback(async () => {
        if (!isAuthenticated || toggling) return;

        setToggling(true);

        try {
            if (isWatchlisted) {
                // Remove from watchlist
                await removeByAssetId(assetId, type);
                setIsWatchlisted(false);
            } else {
                // Add to watchlist
                const body =
                    type === "stock"
                        ? { company_id: assetId }
                        : { mutual_fund_id: assetId };
                await addToWatchlist(body);
                setIsWatchlisted(true);
            }
        } catch (err) {
            console.error("Failed to toggle watchlist:", err);
            // Revert on error? No — keep current state, user can retry
        } finally {
            setToggling(false);
        }
    }, [isAuthenticated, toggling, isWatchlisted, assetId, type]);

    // Don't render for unauthenticated users
    if (!isAuthenticated && !loading) {
        return null;
    }

    return (
        <button
            className={`watchlist-toggle ${isWatchlisted ? "active" : ""} ${toggling ? "toggling" : ""} ${className}`}
            onClick={handleToggle}
            disabled={loading || toggling}
            title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
            aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isWatchlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                className="watchlist-toggle-icon"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {loading && <span className="watchlist-toggle-spinner" />}
        </button>
    );
}
