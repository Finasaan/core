"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [userName, setUserName] = useState("User");
    const supabase = createClient();

    useEffect(() => {
        // Get user display name from spine profile API
        const fetchProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;

                const response = await fetch(`${API_URL}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json() as { success: boolean; data?: { display_name?: string } };
                    if (result.success && result.data?.display_name) {
                        setUserName(result.data.display_name);
                        return;
                    }
                }

                // Fallback to email if no profile
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.email) {
                    setUserName(user.email.split("@")[0]);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, [supabase.auth]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <TopBar userName={userName} />
                <main className="dashboard-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
