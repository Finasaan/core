"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchStocks, searchFunds, addHolding } from "@/lib/portfolio";
import type { AssetSearchResult } from "@/lib/portfolio";

// ---- Debounce hook ----

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

// ---- Asset Search Picker ----

interface AssetPickerProps {
    assetType: "stock" | "fund";
    selected: AssetSearchResult | null;
    onSelect: (asset: AssetSearchResult) => void;
    onClear: () => void;
}

function AssetPicker({ assetType, selected, onSelect, onClear }: AssetPickerProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AssetSearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Search on debounced query change
    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            return;
        }

        let cancelled = false;
        setSearching(true);

        const doSearch = assetType === "stock" ? searchStocks : searchFunds;
        doSearch(debouncedQuery)
            .then((data) => {
                if (!cancelled) {
                    setResults(data);
                    setShowDropdown(true);
                }
            })
            .catch(() => {
                if (!cancelled) setResults([]);
            })
            .finally(() => {
                if (!cancelled) setSearching(false);
            });

        return () => { cancelled = true; };
    }, [debouncedQuery, assetType]);

    if (selected) {
        return (
            <div className="pf-asset-selected">
                <div className="pf-asset-selected-info">
                    <span className="pf-asset-selected-symbol">{selected.symbol}</span>
                    <span className="pf-asset-selected-name">{selected.name}</span>
                </div>
                <button type="button" className="pf-asset-clear" onClick={onClear} aria-label="Clear selection">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="pf-asset-picker" ref={wrapperRef}>
            <input
                type="text"
                className="pf-input"
                placeholder={assetType === "stock" ? "Search stocks by symbol or name..." : "Search mutual funds..."}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    if (e.target.value.length >= 2) setShowDropdown(true);
                }}
                onFocus={() => {
                    if (results.length > 0) setShowDropdown(true);
                }}
            />
            {searching && <span className="pf-asset-spinner" />}

            {showDropdown && results.length > 0 && (
                <ul className="pf-asset-dropdown">
                    {results.map((r) => (
                        <li key={r.id}>
                            <button
                                type="button"
                                className="pf-asset-option"
                                onClick={() => {
                                    onSelect(r);
                                    setQuery("");
                                    setShowDropdown(false);
                                }}
                            >
                                <span className="pf-asset-option-symbol">{r.symbol}</span>
                                <span className="pf-asset-option-name">{r.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {showDropdown && debouncedQuery.length >= 2 && !searching && results.length === 0 && (
                <div className="pf-asset-dropdown pf-asset-no-results">
                    No {assetType === "stock" ? "stocks" : "funds"} found
                </div>
            )}
        </div>
    );
}

// ---- Add Holding Dialog (main) ----

interface AddHoldingDialogProps {
    open: boolean;
    portfolioId: string;
    onClose: () => void;
    onAdded: () => void;
}

export function AddHoldingDialog({ open, portfolioId, onClose, onAdded }: AddHoldingDialogProps) {
    const [assetType, setAssetType] = useState<"stock" | "fund">("stock");
    const [selectedAsset, setSelectedAsset] = useState<AssetSearchResult | null>(null);
    const [quantity, setQuantity] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            setAssetType("stock");
            setSelectedAsset(null);
            setQuantity("");
            setPurchasePrice("");
            setPurchaseDate("");
            setNotes("");
            setError("");
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAsset) {
            setError("Please select a stock or fund");
            return;
        }
        const qty = parseFloat(quantity);
        const price = parseFloat(purchasePrice);
        if (!qty || qty <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }
        if (!price || price <= 0) {
            setError("Purchase price must be greater than 0");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await addHolding(portfolioId, {
                company_id: assetType === "stock" ? selectedAsset.id : undefined,
                mutual_fund_id: assetType === "fund" ? selectedAsset.id : undefined,
                quantity: qty,
                purchase_price: price,
                purchase_date: purchaseDate || undefined,
                notes: notes.trim() || undefined,
            });
            onAdded();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to add holding");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pf-dialog-overlay" onClick={onClose}>
            <div className="pf-dialog pf-dialog-md" onClick={(e) => e.stopPropagation()}>
                <div className="pf-dialog-header">
                    <h3 className="pf-dialog-title">Add Holding</h3>
                    <button className="pf-dialog-close" onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pf-dialog-form">
                    {/* Asset type toggle */}
                    <div className="pf-toggle-group">
                        <button
                            type="button"
                            className={`pf-toggle-btn ${assetType === "stock" ? "pf-toggle-active" : ""}`}
                            onClick={() => { setAssetType("stock"); setSelectedAsset(null); }}
                        >
                            Stock
                        </button>
                        <button
                            type="button"
                            className={`pf-toggle-btn ${assetType === "fund" ? "pf-toggle-active" : ""}`}
                            onClick={() => { setAssetType("fund"); setSelectedAsset(null); }}
                        >
                            Mutual Fund
                        </button>
                    </div>

                    {/* Asset search picker */}
                    <div className="pf-input-group">
                        <label className="pf-input-label">
                            {assetType === "stock" ? "Stock" : "Mutual Fund"}
                        </label>
                        <AssetPicker
                            assetType={assetType}
                            selected={selectedAsset}
                            onSelect={setSelectedAsset}
                            onClear={() => setSelectedAsset(null)}
                        />
                    </div>

                    {/* Quantity + Purchase Price side by side */}
                    <div className="pf-input-row">
                        <div className="pf-input-group">
                            <label className="pf-input-label">
                                {assetType === "stock" ? "Shares" : "Units"}
                            </label>
                            <input
                                type="number"
                                className="pf-input"
                                placeholder="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="0"
                                step="any"
                            />
                        </div>
                        <div className="pf-input-group">
                            <label className="pf-input-label">
                                {assetType === "stock" ? "Purchase Price (PKR)" : "NAV at Purchase (PKR)"}
                            </label>
                            <input
                                type="number"
                                className="pf-input"
                                placeholder="0.00"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                min="0"
                                step="any"
                            />
                        </div>
                    </div>

                    {/* Purchase Date */}
                    <div className="pf-input-group">
                        <label className="pf-input-label">
                            Purchase Date <span className="pf-input-optional">(optional)</span>
                        </label>
                        <input
                            type="date"
                            className="pf-input"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                        />
                    </div>

                    {/* Notes */}
                    <div className="pf-input-group">
                        <label className="pf-input-label">
                            Notes <span className="pf-input-optional">(optional)</span>
                        </label>
                        <input
                            type="text"
                            className="pf-input"
                            placeholder="e.g. Bought on dip"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            maxLength={200}
                        />
                    </div>

                    {error && <p className="pf-error">{error}</p>}

                    <div className="pf-dialog-actions">
                        <button type="button" className="pf-btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="pf-btn-primary" disabled={loading || !selectedAsset}>
                            {loading ? "Adding..." : "Add Holding"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
