"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

interface User {
    id: string;
    email?: string;
    email_confirmed_at?: string;
    created_at?: string;
    updated_at?: string;
    user_metadata?: Record<string, unknown>;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json() as { success: boolean; data: User };
                setUser(data.success ? data.data : null);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    const signOut = useCallback(async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // Best-effort — clear local state regardless
        }
        setUser(null);
    }, []);

    useEffect(() => {
        fetchUser().finally(() => setLoading(false));
    }, [fetchUser]);

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
