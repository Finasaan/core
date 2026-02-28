"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { listPortfolios, createPortfolio, deletePortfolio } from "@/lib/portfolio";
import type { Portfolio } from "@/lib/portfolio";

// ---- Create Portfolio Dialog ----

interface CreatePortfolioDialogProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

function CreatePortfolioDialog({ open, onClose, onCreated }: CreatePortfolioDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Portfolio name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createPortfolio({
                name: name.trim(),
                description: description.trim() || undefined,
            });
            setName("");
            setDescription("");
            onCreated();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to create portfolio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pf-dialog-overlay" onClick={onClose}>
            <div className="pf-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="pf-dialog-header">
                    <h3 className="pf-dialog-title">Create Portfolio</h3>
                    <button className="pf-dialog-close" onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pf-dialog-form">
                    <div className="pf-input-group">
                        <label className="pf-input-label">Portfolio Name</label>
                        <input
                            type="text"
                            className="pf-input"
                            placeholder="e.g. Long-term Growth"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            maxLength={100}
                        />
                    </div>

                    <div className="pf-input-group">
                        <label className="pf-input-label">
                            Description <span className="pf-input-optional">(optional)</span>
                        </label>
                        <input
                            type="text"
                            className="pf-input"
                            placeholder="Brief description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={200}
                        />
                    </div>

                    {error && <p className="pf-error">{error}</p>}

                    <div className="pf-dialog-actions">
                        <button type="button" className="pf-btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="pf-btn-primary" disabled={loading || !name.trim()}>
                            {loading ? "Creating..." : "Create Portfolio"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ---- Delete Confirmation ----

interface DeleteConfirmProps {
    portfolioName: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

function DeleteConfirm({ portfolioName, onConfirm, onCancel, loading }: DeleteConfirmProps) {
    return (
        <div className="pf-dialog-overlay" onClick={onCancel}>
            <div className="pf-dialog pf-dialog-sm" onClick={(e) => e.stopPropagation()}>
                <div className="pf-dialog-header">
                    <h3 className="pf-dialog-title">Delete Portfolio</h3>
                </div>
                <p className="pf-dialog-text">
                    Are you sure you want to delete <strong>{portfolioName}</strong>? This will remove all holdings and cannot be undone.
                </p>
                <div className="pf-dialog-actions">
                    <button className="pf-btn-secondary" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="pf-btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---- Portfolio Card ----

interface PortfolioCardProps {
    portfolio: Portfolio;
    onDelete: (id: string) => void;
}

function PortfolioCard({ portfolio, onDelete }: PortfolioCardProps) {
    const date = new Date(portfolio.created_at).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="pf-card">
            <Link href={`/dashboard/portfolio/${portfolio.id}`} className="pf-card-link">
                <div className="pf-card-top">
                    <div className="pf-card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#159F63" strokeWidth="1.5">
                            <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" />
                            <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" />
                        </svg>
                    </div>
                    <div className="pf-card-info">
                        <h3 className="pf-card-name">{portfolio.name}</h3>
                        {portfolio.description && (
                            <p className="pf-card-desc">{portfolio.description}</p>
                        )}
                    </div>
                </div>
                <div className="pf-card-meta">
                    <span className="pf-card-holdings">
                        {portfolio.holdings_count} {portfolio.holdings_count === 1 ? "holding" : "holdings"}
                    </span>
                    <span className="pf-card-date">Created {date}</span>
                </div>
            </Link>
            <button
                className="pf-card-delete"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(portfolio.id);
                }}
                aria-label="Delete portfolio"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
            </button>
        </div>
    );
}

// ---- Portfolio List (main) ----

export function PortfolioList() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Portfolio | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPortfolios = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listPortfolios();
            setPortfolios(data);
        } catch (err) {
            console.error("Failed to fetch portfolios:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolios();
    }, [fetchPortfolios]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deletePortfolio(deleteTarget.id);
            setDeleteTarget(null);
            fetchPortfolios();
        } catch (err) {
            console.error("Failed to delete portfolio:", err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="pf-grid">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="pf-card pf-card-skeleton">
                        <div className="skeleton-line w-32 h-6" />
                        <div className="skeleton-line w-48 h-4 mt-2" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {portfolios.length === 0 ? (
                <div className="pf-empty">
                    <div className="pf-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
                            <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" />
                            <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" />
                        </svg>
                    </div>
                    <h3 className="pf-empty-title">No portfolios yet</h3>
                    <p className="pf-empty-text">
                        Create your first portfolio to start tracking your investments.
                    </p>
                    <button className="pf-btn-primary" onClick={() => setShowCreate(true)}>
                        Create Portfolio
                    </button>
                </div>
            ) : (
                <>
                    <div className="pf-grid">
                        {portfolios.map((p) => (
                            <PortfolioCard
                                key={p.id}
                                portfolio={p}
                                onDelete={(id) => {
                                    const target = portfolios.find((x) => x.id === id);
                                    if (target) setDeleteTarget(target);
                                }}
                            />
                        ))}

                        {/* Create new card */}
                        {portfolios.length < 10 && (
                            <button className="pf-card pf-card-add" onClick={() => setShowCreate(true)}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                <span className="pf-card-add-text">New Portfolio</span>
                            </button>
                        )}
                    </div>
                </>
            )}

            <CreatePortfolioDialog
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={fetchPortfolios}
            />

            {deleteTarget && (
                <DeleteConfirm
                    portfolioName={deleteTarget.name}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}
        </>
    );
}
