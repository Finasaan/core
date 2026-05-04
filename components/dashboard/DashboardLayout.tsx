"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { getUser } from "@/lib/auth/client";
import { useBudgetAI } from "@/context/BudgetAIContext";
import { AskAIPanel } from "@/components/budget/ai";
import { Sparkles, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { MiniGPTSidebar } from "@/components/gpt/MiniGPTSidebar";
import { CommandPalette } from "@/components/CommandPalette";
import "./ai-fab.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [userName, setUserName] = useState("User");
    const [isGuest, setIsGuest] = useState(false);
    const [isGPTOpen, setIsGPTOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const pathname = usePathname();

    // Global Cmd/Ctrl + K to toggle command palette
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setPaletteOpen((o) => !o);
            }
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // Close mobile sidebar whenever the user navigates to a new page
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Lock body scroll while the mobile drawer is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    useEffect(() => {
        // Get user display name from spine profile API — sb-token cookie sent automatically
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/api/profile`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const result = await response.json() as { success: boolean; data?: { display_name?: string } };
                    if (result.success && result.data?.display_name) {
                        setUserName(result.data.display_name);
                        setIsGuest(false);
                        return;
                    }
                }

                // Fallback to email from /api/auth/me — also handles stale cookie cleanup
                const user = await getUser();
                if (user?.email) {
                    setUserName(user.email.split("@")[0]);
                    setIsGuest(false);
                } else {
                    // No valid session — guest mode
                    setIsGuest(true);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setIsGuest(true);
            }
        };
        fetchProfile();
    }, []);

    const { togglePanel } = useBudgetAI();
    const isBudgetPage = pathname?.startsWith("/dashboard/budget");

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            <div className="dashboard-content">
                <TopBar
                    userName={userName}
                    isGuest={isGuest}
                    onMenuClick={() => setSidebarOpen(true)}
                    onSearchClick={() => setPaletteOpen(true)}
                />
                <main className="dashboard-main">
                    {children}
                </main>
            </div>
            
            {isBudgetPage ? (
              <>
                {/* BachatAI Floating Button */}
                <button 
                    className="ask-ai-fab"
                    onClick={togglePanel}
                    title="BachatAI"
                >
                    <Sparkles size={24} />
                    <span>BachatAI</span>
                </button>

                <AskAIPanel />
              </>
            ) : (
              <>
                {/* Mini FinasaanGPT Floating Button */}
                <button 
                    className="ask-ai-fab gpt-fab"
                    onClick={() => setIsGPTOpen(prev => !prev)}
                    title="FinasaanGPT"
                >
                    <MessageSquare size={24} />
                    <span>FinasaanGPT</span>
                </button>
                <MiniGPTSidebar isOpen={isGPTOpen} onClose={() => setIsGPTOpen(false)} />
              </>
            )}

            <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
        </div>
    );
}
