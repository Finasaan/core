"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchStocks, searchFunds } from "@/lib/portfolio/api";
import type { AssetSearchResult } from "@/lib/portfolio/types";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PageEntry {
    title: string;
    subtitle: string;
    href: string;
    keywords: string;
    group: string;
    icon: string;
}

const PAGES: PageEntry[] = [
    // Core
    { title: "Dashboard", subtitle: "Home", href: "/dashboard", keywords: "home dashboard overview", group: "Pages", icon: "home" },
    { title: "FinasaanGPT", subtitle: "AI assistant", href: "/chat", keywords: "gpt chat ai assistant finasaangpt", group: "Pages", icon: "chat" },

    // Markets
    { title: "Stocks", subtitle: "Browse PSX stocks", href: "/dashboard/stocks", keywords: "stocks psx shares equity market", group: "Markets", icon: "chart" },
    { title: "Mutual Funds", subtitle: "Browse mutual funds", href: "/dashboard/funds", keywords: "mutual funds mf", group: "Markets", icon: "coin" },
    { title: "Sectors", subtitle: "Market sectors", href: "/dashboard/sectors", keywords: "sectors industries", group: "Markets", icon: "sectors" },
    { title: "News", subtitle: "Economic news", href: "/dashboard/news", keywords: "news articles headlines economy", group: "Markets", icon: "news" },
    { title: "Watchlist", subtitle: "Your saved assets", href: "/dashboard/watchlist", keywords: "watchlist favorites saved", group: "Markets", icon: "star" },

    // Personal
    { title: "Portfolio", subtitle: "Your investments", href: "/dashboard/portfolio", keywords: "portfolio investments holdings", group: "Personal", icon: "portfolio" },
    { title: "Budget", subtitle: "Track spending", href: "/dashboard/budget", keywords: "budget spending money", group: "Personal", icon: "budget" },
    { title: "Budget Planner", subtitle: "Plan your budget", href: "/dashboard/budget/planner", keywords: "budget planner plan", group: "Personal", icon: "budget" },
    { title: "Transactions", subtitle: "Transaction history", href: "/dashboard/budget/transactions", keywords: "transactions history spending expenses", group: "Personal", icon: "budget" },
    { title: "Savings", subtitle: "Savings goals", href: "/dashboard/budget/savings", keywords: "savings goals", group: "Personal", icon: "budget" },

    // Tools
    { title: "Calculators", subtitle: "Financial calculators", href: "/dashboard/calculators", keywords: "calculator tools", group: "Tools", icon: "calculator" },
    { title: "Returns Calculator", subtitle: "Compound investment returns", href: "/dashboard/calculators/returns", keywords: "returns compound investment calculator", group: "Tools", icon: "calculator" },
    { title: "Salary & Tax Calculator", subtitle: "Calculate take-home pay", href: "/dashboard/calculators/salary-tax", keywords: "salary tax income take home", group: "Tools", icon: "calculator" },
    { title: "Taxation Calculator", subtitle: "Pakistan tax calculations", href: "/dashboard/calculators/taxation", keywords: "tax taxation pakistan", group: "Tools", icon: "calculator" },

    // Learn
    { title: "Learn", subtitle: "Learning journeys", href: "/dashboard/learn", keywords: "learn education journeys courses", group: "Learn", icon: "book" },

    // Insurance
    { title: "Insurance", subtitle: "Insurance overview", href: "/dashboard/insurance", keywords: "insurance", group: "Insurance", icon: "shield" },
    { title: "Takaful", subtitle: "Islamic insurance", href: "/dashboard/insurance/takaful", keywords: "takaful islamic insurance", group: "Insurance", icon: "shield" },
    { title: "Insurance Providers", subtitle: "Browse providers", href: "/dashboard/insurance/providers", keywords: "insurance providers companies", group: "Insurance", icon: "shield" },

    // Tax page
    { title: "Taxation", subtitle: "Tax tools and info", href: "/dashboard/taxation", keywords: "tax taxation income", group: "Tools", icon: "calculator" },

    // Account
    { title: "Settings", subtitle: "Profile, account, preferences", href: "/dashboard/settings", keywords: "settings account profile preferences password", group: "Account", icon: "settings" },
    { title: "Change Password", subtitle: "Update your password", href: "/dashboard/settings?tab=account", keywords: "password change security account", group: "Account", icon: "settings" },
];

interface FlatItem {
    key: string;
    title: string;
    subtitle: string;
    href: string;
    group: string;
    icon: string;
}

function getIcon(name: string) {
    switch (name) {
        case "home":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.02 2.84l-5.39 4.2C2.73 7.74 2 9.23 2 10.36v7.41c0 2.32 1.89 4.22 4.21 4.22h11.58c2.32 0 4.21-1.9 4.21-4.21V10.5c0-1.21-.81-2.76-1.8-3.45l-6.18-4.33c-1.4-.98-3.65-.93-5 .12z" />
                </svg>
            );
        case "chat":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.53-.4-.8-.4z" />
                </svg>
            );
        case "chart":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.88 17.76v-2.03M12 17.76v-4.06M17.12 17.76v-6.1M6.88 12.7L10.47 8.1c.62-.78 1.74-.88 2.5-.24l1.49 1.3c.76.64 1.88.54 2.5-.24l3.05-3.82" />
                </svg>
            );
        case "coin":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="9" r="7" />
                    <path d="M15 15c3.87 0 7-3.13 7-7M15 9h-4M11 7v4" />
                </svg>
            );
        case "sectors":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
            );
        case "news":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                    <path d="M7 8h10M7 12h10M7 16h6" />
                </svg>
            );
        case "star":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        case "portfolio":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" />
                    <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" />
                </svg>
            );
        case "budget":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14z" />
                    <path d="M3 13h18" />
                </svg>
            );
        case "calculator":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" />
                </svg>
            );
        case "book":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99H19.7c-2.01.15-5.02 1.13-6.68 2.21l-.17.12c-.29.19-.77.19-1.06 0l-.25-.15C9.87 3.78 6.87 2.83 4.86 2.67H4.73C3.53 2.57 2.56 3.47 2.56 4.67v12.07c0 .96.78 1.86 1.74 1.98l.29.04c2.09.27 5.32 1.3 7.15 2.31l.04.02c.27.15.7.15.96 0 1.83-1.02 5.07-2.07 7.18-2.33l.33-.04c.96-.12 1.74-1.02 1.74-1.98z" />
                </svg>
            );
        case "shield":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.49 2.23l-5.5 2.1c-1.24.47-2.25 1.94-2.25 3.27v6.09c0 1.29.77 2.97 1.71 3.73l5.5 4.36c1.4 1.11 3.7 1.11 5.1 0l5.5-4.36c.94-.76 1.71-2.44 1.71-3.73V7.6c0-1.33-1.01-2.8-2.25-3.27l-5.5-2.1c-1.13-.44-2.95-.44-4.02 0z" />
                </svg>
            );
        case "stock":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M7 14l3-4 4 3 5-6" />
                </svg>
            );
        case "fund":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3a9 9 0 010 18M3 12h18" />
                </svg>
            );
        case "settings":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c0 .66.39 1.26 1 1.51a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82c.25.61.85 1 1.51 1H21a2 2 0 010 4h-.09c-.66 0-1.26.39-1.51 1z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                </svg>
            );
    }
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const [query, setQuery] = useState("");
    const [stocks, setStocks] = useState<AssetSearchResult[]>([]);
    const [funds, setFunds] = useState<AssetSearchResult[]>([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Reset state when palette closes
    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setStocks([]);
            setFunds([]);
            setSelectedIndex(0);
        } else {
            // Focus input on next tick so animation/render completes
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [isOpen]);

    // Lock body scroll while open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // Debounced asset search (stocks + funds)
    useEffect(() => {
        if (!isOpen) return;
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setStocks([]);
            setFunds([]);
            setLoadingAssets(false);
            return;
        }

        const handle = window.setTimeout(async () => {
            setLoadingAssets(true);
            try {
                const [s, f] = await Promise.all([
                    searchStocks(trimmed).catch(() => []),
                    searchFunds(trimmed).catch(() => []),
                ]);
                setStocks(s.slice(0, 6));
                setFunds(f.slice(0, 6));
            } finally {
                setLoadingAssets(false);
            }
        }, 180);

        return () => window.clearTimeout(handle);
    }, [query, isOpen]);

    // Filter pages by query (substring match against title + keywords)
    const filteredPages = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return PAGES;
        return PAGES.filter((p) =>
            p.title.toLowerCase().includes(q) || p.keywords.includes(q) || p.keywords.split(" ").some((k) => k.startsWith(q))
        );
    }, [query]);

    // Build flat list grouped: Pages, Stocks, Mutual Funds
    const flat: FlatItem[] = useMemo(() => {
        const items: FlatItem[] = [];
        for (const p of filteredPages) {
            items.push({
                key: `page:${p.href}`,
                title: p.title,
                subtitle: p.subtitle,
                href: p.href,
                group: p.group,
                icon: p.icon,
            });
        }
        for (const s of stocks) {
            items.push({
                key: `stock:${s.id}`,
                title: s.symbol,
                subtitle: s.name,
                href: `/dashboard/stocks/${s.symbol}`,
                group: "Stocks",
                icon: "stock",
            });
        }
        for (const f of funds) {
            items.push({
                key: `fund:${f.id}`,
                title: f.name,
                subtitle: f.symbol || "Mutual Fund",
                href: `/dashboard/funds/${f.id}`,
                group: "Mutual Funds",
                icon: "fund",
            });
        }
        return items;
    }, [filteredPages, stocks, funds]);

    // Reset selection when result list changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [flat.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
                return;
            }
            if (e.key === "Enter") {
                e.preventDefault();
                const item = flat[selectedIndex];
                if (item) {
                    router.push(item.href);
                    onClose();
                }
            }
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, flat, selectedIndex, router, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        const el = itemRefs.current[selectedIndex];
        if (el) el.scrollIntoView({ block: "nearest" });
    }, [selectedIndex]);

    if (!isOpen) return null;

    // Group items for rendering
    const grouped: { group: string; items: Array<{ item: FlatItem; index: number }> }[] = [];
    flat.forEach((item, idx) => {
        const last = grouped[grouped.length - 1];
        if (last && last.group === item.group) {
            last.items.push({ item, index: idx });
        } else {
            grouped.push({ group: item.group, items: [{ item, index: idx }] });
        }
    });

    const showAssetLoading = loadingAssets && query.trim().length >= 2 && stocks.length === 0 && funds.length === 0;
    const showEmpty = !showAssetLoading && flat.length === 0;

    return (
        <div
            className="cmd-palette-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Search finasaan"
        >
            <div className="cmd-palette" onMouseDown={(e) => e.stopPropagation()}>
                <div className="cmd-palette-input-row">
                    <svg className="cmd-palette-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="cmd-palette-input"
                        placeholder="Search stocks, funds, pages, anything…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button type="button" className="cmd-palette-esc" onClick={onClose} aria-label="Close">esc</button>
                </div>

                <div className="cmd-palette-results" ref={listRef}>
                    {showAssetLoading && (
                        <div className="cmd-palette-status">Searching…</div>
                    )}
                    {showEmpty && (
                        <div className="cmd-palette-status">No results for &ldquo;{query}&rdquo;</div>
                    )}
                    {grouped.map((g) => (
                        <div key={g.group} className="cmd-palette-group">
                            <div className="cmd-palette-group-label">{g.group}</div>
                            {g.items.map(({ item, index }) => (
                                <button
                                    key={item.key}
                                    ref={(el) => {
                                        itemRefs.current[index] = el;
                                    }}
                                    type="button"
                                    className={`cmd-palette-item${index === selectedIndex ? " is-selected" : ""}`}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    onClick={() => {
                                        router.push(item.href);
                                        onClose();
                                    }}
                                >
                                    <span className="cmd-palette-item-icon">{getIcon(item.icon)}</span>
                                    <span className="cmd-palette-item-text">
                                        <span className="cmd-palette-item-title">{item.title}</span>
                                        <span className="cmd-palette-item-subtitle">{item.subtitle}</span>
                                    </span>
                                    <span className="cmd-palette-item-enter" aria-hidden="true">↵</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="cmd-palette-footer">
                    <span className="cmd-palette-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                    <span className="cmd-palette-hint"><kbd>↵</kbd> open</span>
                    <span className="cmd-palette-hint"><kbd>esc</kbd> close</span>
                </div>
            </div>
        </div>
    );
}
