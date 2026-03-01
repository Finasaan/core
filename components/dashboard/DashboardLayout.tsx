"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { getUser } from "@/lib/auth/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [userName, setUserName] = useState("User");

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
                        return;
                    }
                }

                // Fallback to email from /api/auth/me if no profile display_name
                const user = await getUser();
                if (user?.email) {
                    setUserName(user.email.split("@")[0]);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

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
