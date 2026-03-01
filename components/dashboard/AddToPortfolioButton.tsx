"use client";

import { useState, useEffect } from "react";
import { listPortfolios, createPortfolio, addHolding } from "@/lib/portfolio";
import type { Portfolio } from "@/lib/portfolio";

// ---- Types ----

interface AddToPortfolioButtonProps {
    /** Asset ID — company ID for stocks, fund ID for mutual funds */
    assetId: string;
    /** Asset symbol or short name (for display in dialog) */
    symbol: string;
    /** "stock" or "fund" — controls which ID field is sent to the API */
    assetType?: "stock" | "fund";
    /** Latest close/NAV price (pre-fills purchase price) */
    currentPrice?: number;
    /** Render as icon-only (no label text) for compact placements */
    iconOnly?: boolean;
}

// ---- AddToPortfolioButton Component ----

export function AddToPortfolioButton({
    assetId,
    symbol,
    assetType = "stock",
    currentPrice,
    iconOnly = false,
}: AddToPortfolioButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className={iconOnly ? "asset-action-btn add-portfolio-btn" : "pf-btn-primary atp-btn"}
                onClick={() => setOpen(true)}
                title="Add to portfolio"
                aria-label="Add to portfolio"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                {!iconOnly && "Add to Portfolio"}
            </button>

            {open && (
                <AddToPortfolioDialog
                    assetId={assetId}
                    assetType={assetType}
                    symbol={symbol}
                    currentPrice={currentPrice}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

// ---- Dialog ----

interface DialogProps {
    assetId: string;
    assetType: "stock" | "fund";
    symbol: string;
    currentPrice?: number;
    onClose: () => void;
}

function AddToPortfolioDialog({ assetId, assetType, symbol, currentPrice, onClose }: DialogProps) {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [purchasePrice, setPurchasePrice] = useState(currentPrice ? currentPrice.toString() : "");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingPortfolios, setLoadingPortfolios] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Fetch user portfolios
    useEffect(() => {
        async function load() {
            setLoadingPortfolios(true);
            try {
                const list = await listPortfolios();
                setPortfolios(list);

                if (list.length > 0) {
                    setSelectedPortfolioId(list[0].id);
                }
            } catch {
                setError("Please log in to add assets to your portfolio");
            } finally {
                setLoadingPortfolios(false);
            }
        }
        load();
    }, []);

    const handleCreateDefault = async () => {
        setLoading(true);
        setError("");
        try {
            const portfolio = await createPortfolio({ name: "My Portfolio" });
            setPortfolios([portfolio]);
            setSelectedPortfolioId(portfolio.id);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to create portfolio";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
        if (!selectedPortfolioId) {
            setError("Please select a portfolio");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await addHolding(selectedPortfolioId, {
                company_id: assetType === "stock" ? assetId : undefined,
                mutual_fund_id: assetType === "fund" ? assetId : undefined,
                quantity: qty,
                purchase_price: price,
                purchase_date: purchaseDate || undefined,
                notes: notes.trim() || undefined,
            });
            setSuccess(true);
            setTimeout(() => onClose(), 1200);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to add holding";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pf-dialog-overlay" onClick={onClose}>
            <div className="pf-dialog pf-dialog-md" onClick={(e) => e.stopPropagation()}>
                <div className="pf-dialog-header">
                    <h3 className="pf-dialog-title">Add {symbol} to Portfolio</h3>
                    <button className="pf-dialog-close" onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {success ? (
                    <div className="atp-success">
                        <div className="atp-success-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <p className="atp-success-text">{symbol} added to your portfolio!</p>
                    </div>
                ) : loadingPortfolios ? (
                    <div className="atp-loading">Loading portfolios...</div>
                ) : portfolios.length === 0 && !error ? (
                    <div className="atp-no-portfolio">
                        <p className="pf-dialog-text">
                            You don&apos;t have a portfolio yet. Create one to start tracking your investments.
                        </p>
                        <div className="pf-dialog-actions" style={{ padding: "0 28px 28px" }}>
                            <button className="pf-btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="pf-btn-primary" onClick={handleCreateDefault} disabled={loading}>
                                {loading ? "Creating..." : "Create Portfolio"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="pf-dialog-form">
                        {/* Portfolio selector */}
                        {portfolios.length > 1 && (
                            <div className="pf-input-group">
                                <label className="pf-input-label">Portfolio</label>
                                <select
                                    className="pf-input"
                                    value={selectedPortfolioId}
                                    onChange={(e) => setSelectedPortfolioId(e.target.value)}
                                >
                                    {portfolios.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quantity + Price */}
                        <div className="pf-input-row">
                            <div className="pf-input-group">
                                <label className="pf-input-label">{assetType === "fund" ? "Units" : "Shares"}</label>
                                <input
                                    type="number"
                                    className="pf-input"
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="0"
                                    step="any"
                                    autoFocus
                                />
                            </div>
                            <div className="pf-input-group">
                                <label className="pf-input-label">Purchase Price (PKR)</label>
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
                            <button type="submit" className="pf-btn-primary" disabled={loading}>
                                {loading ? "Adding..." : "Add to Portfolio"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
