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
import "./ai-fab.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [userName, setUserName] = useState("User");
    const [isGuest, setIsGuest] = useState(false);
    const [isGPTOpen, setIsGPTOpen] = useState(false);

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
    const pathname = usePathname();
    const isBudgetPage = pathname?.startsWith("/dashboard/budget");

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <TopBar userName={userName} isGuest={isGuest} />
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
        </div>
    );
}
