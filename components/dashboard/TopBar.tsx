"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/lib/auth/client";

interface ProfileDropdownProps {
    userName: string;
    onClose: () => void;
}

function ProfileDropdown({ userName, onClose }: ProfileDropdownProps) {
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        onClose();
    };

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            <div className="profile-dropdown-header">
                <span className="profile-dropdown-name">{userName}</span>
            </div>
            <div className="profile-dropdown-divider" />
            <button
                className="profile-dropdown-item"
                onClick={() => handleNavigate("/dashboard/settings?tab=profile")}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7" />
                </svg>
                <span>User Settings</span>
            </button>
            <div className="profile-dropdown-divider" />
            <button className="profile-dropdown-item profile-dropdown-logout" onClick={handleLogout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99M2 12h12.88" />
                    <path d="M12.65 8.65L16 12l-3.35 3.35" />
                </svg>
                <span>Log Out</span>
            </button>
        </div>
    );
}

interface TopBarProps {
    userName?: string;
    isGuest?: boolean;
    onMenuClick?: () => void;
    onSearchClick?: () => void;
}

export function TopBar({ userName = "User", isGuest = false, onMenuClick, onSearchClick }: TopBarProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMac, setIsMac] = useState(false);
    const pathname = usePathname();
    const userInitial = userName.charAt(0).toUpperCase();

    useEffect(() => {
        const platform = typeof navigator !== "undefined" ? (navigator.platform || navigator.userAgent) : "";
        setIsMac(/Mac|iPhone|iPad|iPod/i.test(platform));
    }, []);

    // Redirect back to current page after login
    const loginHref = `/login?redirect=${encodeURIComponent(pathname ?? "/dashboard")}`;

    return (
        <header className="topbar">
            {/* Mobile menu (hamburger) — visible only at small viewports via CSS */}
            {onMenuClick && (
                <button
                    type="button"
                    className="topbar-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                </button>
            )}

            {/* Search — opens command palette */}
            <button
                type="button"
                className="topbar-search"
                onClick={onSearchClick}
                aria-label="Open search"
            >
                <svg className="topbar-search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#708090" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <span className="topbar-search-text">Search finasaan</span>
                <span className="topbar-search-kbd" aria-hidden="true">
                    {isMac ? (
                        <><kbd>⌘</kbd><kbd>K</kbd></>
                    ) : (
                        <><kbd>Ctrl</kbd><kbd>K</kbd></>
                    )}
                </span>
            </button>

            {/* Right side */}
            <div className="topbar-right">
                {isGuest ? (
                    /* Guest — Sign In + Get Started */
                    <div className="topbar-guest-actions">
                        <Link href={loginHref} className="topbar-guest-signin">
                            Sign In
                        </Link>
                        <Link href="/signup" className="topbar-guest-signup">
                            Get Started
                        </Link>
                    </div>
                ) : (
                    /* Authenticated — notifications / profile */
                    <>
                        {/* Notifications */}
                        <button className="topbar-notification" aria-label="Notifications">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000020" strokeWidth="1.5">
                                <path d="M12 6.44v3.33M12.02 2C8.34 2 5.36 4.98 5.36 8.66v1.76c0 .68-.28 1.7-.63 2.28l-1.27 2.12c-.78 1.3-.24 2.77 1.2 3.25a23.34 23.34 0 0014.68 0 2.22 2.22 0 001.2-3.25l-1.27-2.12c-.35-.58-.63-1.6-.63-2.28V8.66C18.64 5 15.64 2 12.02 2z" />
                                <path d="M15.33 18.82c0 1.83-1.5 3.33-3.33 3.33a3.32 3.32 0 01-2.35-.98 3.32 3.32 0 01-.98-2.35" />
                            </svg>
                        </button>

                        {/* User Profile */}
                        <div className="topbar-profile">
                            <button
                                className="topbar-profile-button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-label="User menu"
                            >
                                <div className="topbar-avatar">
                                    <span>{userInitial}</span>
                                </div>
                                <div className="topbar-profile-info">
                                    <span className="topbar-profile-name">{userName}</span>
                                </div>
                                <svg
                                    className={`topbar-profile-arrow ${dropdownOpen ? "open" : ""}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#708090"
                                    strokeWidth="1.5"
                                >
                                    <path d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <ProfileDropdown
                                    userName={userName}
                                    onClose={() => setDropdownOpen(false)}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
