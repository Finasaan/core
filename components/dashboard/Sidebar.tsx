"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface SidebarItem {
    label: string;
    href: string;
    icon: string;
    comingSoon?: boolean;
}

const sidebarItems: SidebarItem[] = [
    { label: "Home", href: "/dashboard", icon: "home" },
    { label: "finasaanGPT", href: "/chat", icon: "chat" },
];

const learnItems: SidebarItem[] = [
    { label: "My Journeys", href: "/dashboard/learn", icon: "book" },
    { label: "Explore", href: "/dashboard/learn", icon: "search" },
];

const infoItems: SidebarItem[] = [
    { label: "News", href: "/dashboard/news", icon: "newspaper" },
    { label: "Stocks", href: "/dashboard/stocks", icon: "chart" },
    { label: "Sectors", href: "/dashboard/sectors", icon: "sectors" },
    { label: "Mutual Funds", href: "/dashboard/funds", icon: "coin" },
    { label: "Watchlist", href: "/dashboard/watchlist", icon: "star" },
    { label: "Portfolio", href: "/dashboard/portfolio", icon: "portfolio" },
    { label: "Budget", href: "/dashboard/budget", icon: "budget" },
    { label: "Calculators", href: "/dashboard/calculators", icon: "calculator" },
    { label: "Insurance", href: "/dashboard/insurance", icon: "shield" },
];

interface SidebarNavItemProps {
    item: SidebarItem;
    isActive: boolean;
}

function SidebarNavItem({ item, isActive }: SidebarNavItemProps) {
    const content = (
        <div className={`sidebar-nav-item ${isActive ? "active" : ""} ${item.comingSoon ? "coming-soon" : ""}`}>
            <span className="sidebar-nav-icon">{getIcon(item.icon)}</span>
            <span className="sidebar-nav-label">{item.label}</span>
            {item.comingSoon && <span className="sidebar-coming-soon-badge">Soon</span>}
        </div>
    );

    if (item.comingSoon) {
        return <div className="sidebar-nav-link disabled">{content}</div>;
    }

    return (
        <Link href={item.href} className="sidebar-nav-link">
            {content}
        </Link>
    );
}

function getIcon(name: string): React.ReactElement {
    const icons: Record<string, React.ReactElement> = {
        home: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.02 2.84l-5.39 4.2C2.73 7.74 2 9.23 2 10.36v7.41c0 2.32 1.89 4.22 4.21 4.22h11.58c2.32 0 4.21-1.9 4.21-4.21V10.5c0-1.21-.81-2.76-1.8-3.45l-6.18-4.33c-1.4-.98-3.65-.93-5 .12z" />
                <path d="M12 17.99v-3" />
            </svg>
        ),
        chat: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.53-.4-.8-.4z" />
            </svg>
        ),
        book: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99H19.7c-2.01.15-5.02 1.13-6.68 2.21l-.17.12c-.29.19-.77.19-1.06 0l-.25-.15C9.87 3.78 6.87 2.83 4.86 2.67H4.73C3.53 2.57 2.56 3.47 2.56 4.67v12.07c0 .96.78 1.86 1.74 1.98l.29.04c2.09.27 5.32 1.3 7.15 2.31l.04.02c.27.15.7.15.96 0 1.83-1.02 5.07-2.07 7.18-2.33l.33-.04c.96-.12 1.74-1.02 1.74-1.98z" />
                <path d="M12 5.49v15M7.75 8.49h-2.5M8.25 11.49h-3" />
            </svg>
        ),
        magic: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3.5 20.5l17-17M6.5 10.5l-2-2M10.5 6.5l-2-2M18.5 14.5l-2-2" />
            </svg>
        ),
        search: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
            </svg>
        ),
        bookmark: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12.89 5.88h-1.78c-2.21 0-4 1.79-4 4v8.04c0 1.78 1.43 2.85 3.18 2.38l2.27-.62c.48-.13 1.28-.13 1.76 0l2.27.62c1.75.47 3.18-.6 3.18-2.38V9.88c0-2.21-1.79-4-4-4z" />
                <path d="M12 6v4" />
            </svg>
        ),
        chart: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6.88 17.76v-2.03M12 17.76v-4.06M17.12 17.76v-6.1M6.88 12.7L10.47 8.1c.62-.78 1.74-.88 2.5-.24l1.49 1.3c.76.64 1.88.54 2.5-.24l3.05-3.82" />
            </svg>
        ),
        sectors: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
        coin: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="9" r="7" />
                <path d="M15 15c3.87 0 7-3.13 7-7" />
                <path d="M15 9h-4M11 7v4" />
            </svg>
        ),
        shield: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10.49 2.23l-5.5 2.1c-1.24.47-2.25 1.94-2.25 3.27v6.09c0 1.29.77 2.97 1.71 3.73l5.5 4.36c1.4 1.11 3.7 1.11 5.1 0l5.5-4.36c.94-.76 1.71-2.44 1.71-3.73V7.6c0-1.33-1.01-2.8-2.25-3.27l-5.5-2.1c-1.13-.44-2.95-.44-4.02 0z" />
                <path d="M9.05 11.87l1.61 1.61 4.29-4.29" />
            </svg>
        ),
        money: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8.5c0-2.21 1.79-4 4-4h12c2.21 0 4 1.79 4 4v7c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4v-7z" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M5.5 12h.01M18.5 12h.01" />
            </svg>
        ),
        portfolio: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" />
                <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" />
            </svg>
        ),
        budget: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14z" />
                <path d="M16 11h.01M16 13h.01M16 15h.01M16 17h.01" />
                <path d="M12 11h.01M12 13h.01M12 15h.01M12 17h.01" />
                <path d="M8 11h.01M8 13h.01M8 15h.01M8 17h.01" />
                <path d="M3 13h18" />
            </svg>
        ),
        calculator: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" />
            </svg>
        ),
        newspaper: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                <path d="M7 8h10M7 12h10M7 16h6" />
            </svg>
        ),
        star: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    };
    return icons[name] || <span>•</span>;
}

interface SidebarSectionProps {
    title: string;
    items: SidebarItem[];
    pathname: string;
}

function SidebarSection({ title, items, pathname }: SidebarSectionProps) {
    return (
        <div className="sidebar-section">
            <div className="sidebar-section-header">
                <span className="sidebar-section-title">{title}</span>
                <div className="sidebar-section-line" />
            </div>
            <div className="sidebar-section-items">
                {items.map((item) => (
                    <SidebarNavItem
                        key={item.label}
                        item={item}
                        isActive={pathname === item.href || (item.href !== "#" && item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))}
                    />
                ))}
            </div>
        </div>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-logo">
                <Image
                    src="/logodark.svg"
                    alt="Finasaan"
                    width={120}
                    height={32}
                    priority
                />
            </div>

            <nav className="sidebar-nav">
                {sidebarItems.map((item) => (
                    <SidebarNavItem
                        key={item.label}
                        item={item}
                        isActive={pathname === item.href}
                    />
                ))}

                <SidebarSection title="Learn" items={learnItems} pathname={pathname} />
                <SidebarSection title="Info" items={infoItems} pathname={pathname} />
            </nav>
        </aside>
    );
}
