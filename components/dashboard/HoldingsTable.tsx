"use client";

import { useState } from "react";
import { deleteHolding } from "@/lib/portfolio";
import type { HoldingSummary, HoldingLot } from "@/lib/portfolio";

// ---- Helpers ----

function formatPKR(value: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

function formatQuantity(qty: number): string {
    return qty % 1 === 0 ? qty.toLocaleString() : qty.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

// ---- Holding Row ----

interface HoldingRowProps {
    holding: HoldingSummary;
    portfolioId: string;
    onDeleted: () => void;
}

function HoldingRow({ holding, portfolioId, onDeleted }: HoldingRowProps) {
    const [expanded, setExpanded] = useState(false);
    const [deletingLot, setDeletingLot] = useState<string | null>(null);
    const isUp = holding.pl >= 0;

    const handleDeleteLot = async (lotId: string) => {
        setDeletingLot(lotId);
        try {
            await deleteHolding(portfolioId, lotId);
            onDeleted();
        } catch (err) {
            console.error("Failed to delete holding:", err);
        } finally {
            setDeletingLot(null);
        }
    };

    return (
        <>
            <tr
                className={`pf-holding-row ${expanded ? "pf-holding-expanded" : ""}`}
                onClick={() => holding.lots.length > 1 && setExpanded(!expanded)}
                style={holding.lots.length > 1 ? { cursor: "pointer" } : undefined}
            >
                <td className="pf-holding-name-cell">
                    <div className="pf-holding-name-wrap">
                        <span className="pf-holding-symbol">{holding.symbol || "—"}</span>
                        <span className="pf-holding-name">{holding.name || "—"}</span>
                    </div>
                    {holding.lots.length > 1 && (
                        <span className="pf-holding-lots-badge">
                            {holding.lots.length} lots
                            <svg
                                width="12" height="12" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                className={`pf-chevron ${expanded ? "pf-chevron-up" : ""}`}
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </span>
                    )}
                </td>
                <td className="pf-holding-num">{formatPKR(holding.current_price)}</td>
                <td className="pf-holding-num">{formatPKR(holding.avg_cost)}</td>
                <td className="pf-holding-num">{formatQuantity(holding.total_quantity)}</td>
                <td className="pf-holding-num">{formatPKR(holding.current_value)}</td>
                <td className={`pf-holding-num ${isUp ? "pf-up" : "pf-down"}`}>
                    <div className="pf-pl-cell">
                        <span>{formatPKR(holding.pl)}</span>
                        <span className="pf-pl-pct">{formatPercent(holding.pl_pct)}</span>
                    </div>
                </td>
                <td className="pf-holding-num">{holding.weight_pct.toFixed(1)}%</td>
                <td className="pf-holding-actions">
                    {holding.lots.length === 1 && (
                        <button
                            className="pf-lot-delete"
                            onClick={(e) => { e.stopPropagation(); handleDeleteLot(holding.lots[0].id); }}
                            disabled={deletingLot === holding.lots[0].id}
                            aria-label="Delete holding"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                        </button>
                    )}
                </td>
            </tr>

            {/* Expanded lot rows */}
            {expanded && holding.lots.map((lot) => (
                <LotRow
                    key={lot.id}
                    lot={lot}
                    currentPrice={holding.current_price}
                    onDelete={() => handleDeleteLot(lot.id)}
                    deleting={deletingLot === lot.id}
                />
            ))}
        </>
    );
}

// ---- Lot Sub-Row ----

interface LotRowProps {
    lot: HoldingLot;
    currentPrice: number;
    onDelete: () => void;
    deleting: boolean;
}

function LotRow({ lot, currentPrice, onDelete, deleting }: LotRowProps) {
    const lotValue = lot.quantity * currentPrice;
    const lotCost = lot.quantity * lot.purchase_price;
    const lotPL = lotValue - lotCost;
    const lotPLPct = lotCost > 0 ? ((lotPL / lotCost) * 100) : 0;
    const isUp = lotPL >= 0;
    const date = lot.purchase_date
        ? new Date(lot.purchase_date).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })
        : "—";

    return (
        <tr className="pf-lot-row">
            <td className="pf-lot-date">{date}</td>
            <td className="pf-holding-num">{formatPKR(currentPrice)}</td>
            <td className="pf-holding-num">{formatPKR(lot.purchase_price)}</td>
            <td className="pf-holding-num">{formatQuantity(lot.quantity)}</td>
            <td className="pf-holding-num">{formatPKR(lotValue)}</td>
            <td className={`pf-holding-num ${isUp ? "pf-up" : "pf-down"}`}>
                <div className="pf-pl-cell">
                    <span>{formatPKR(lotPL)}</span>
                    <span className="pf-pl-pct">{formatPercent(lotPLPct)}</span>
                </div>
            </td>
            <td className="pf-holding-num">—</td>
            <td className="pf-holding-actions">
                <button
                    className="pf-lot-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    disabled={deleting}
                    aria-label="Delete lot"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                </button>
            </td>
        </tr>
    );
}

// ---- Holdings Table (main) ----

interface HoldingsTableProps {
    holdings: HoldingSummary[];
    portfolioId: string;
    onChanged: () => void;
}

export function HoldingsTable({ holdings, portfolioId, onChanged }: HoldingsTableProps) {
    if (holdings.length === 0) {
        return (
            <div className="pf-holdings-empty">
                <p>No holdings yet. Add stocks or mutual funds to start tracking.</p>
            </div>
        );
    }

    return (
        <div className="pf-holdings-wrap">
            <div className="pf-holdings-table-scroll">
                <table className="pf-holdings-table">
                    <thead>
                        <tr>
                            <th className="pf-th-name">Asset</th>
                            <th className="pf-th-num">Price</th>
                            <th className="pf-th-num">Avg Cost</th>
                            <th className="pf-th-num">Qty</th>
                            <th className="pf-th-num">Value</th>
                            <th className="pf-th-num">P/L</th>
                            <th className="pf-th-num">Weight</th>
                            <th className="pf-th-actions"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((h) => (
                            <HoldingRow
                                key={h.asset_id}
                                holding={h}
                                portfolioId={portfolioId}
                                onDeleted={onChanged}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
