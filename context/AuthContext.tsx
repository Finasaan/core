"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
    type ReactNode,
} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

// Proactively refresh 10 minutes before the 1-hour JWT expires
const REFRESH_INTERVAL_MS = 50 * 60 * 1000; // 50 minutes

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
    /**
     * Authenticated fetch wrapper.
     * If the response is 401, attempts a silent token refresh once, then retries.
     * If the refresh also fails, signs the user out and redirects to /login.
     */
    apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // Prevent concurrent refresh attempts
    const refreshingRef = useRef<Promise<boolean> | null>(null);

    // ---------------------------------------------------------------------------
    // Silent token refresh — calls spine's /api/auth/refresh endpoint which
    // exchanges the sb-refresh-token cookie for a new token pair.
    // Returns true on success, false on failure.
    // ---------------------------------------------------------------------------
    const silentRefresh = useCallback(async (): Promise<boolean> => {
        // Deduplicate concurrent refresh calls
        if (refreshingRef.current) return refreshingRef.current;

        const promise = (async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                });
                return res.ok;
            } catch {
                return false;
            } finally {
                refreshingRef.current = null;
            }
        })();

        refreshingRef.current = promise;
        return promise;
    }, []);

    // ---------------------------------------------------------------------------
    // Fetch user from /api/auth/me — used on mount and after refresh
    // ---------------------------------------------------------------------------
    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json() as { success: boolean; data: User };
                setUser(data.success ? data.data : null);
                return;
            }

            // 401 — try to refresh once
            if (res.status === 401) {
                const refreshed = await silentRefresh();
                if (refreshed) {
                    // Retry after successful refresh
                    const retry = await fetch(`${API_URL}/api/auth/me`, {
                        credentials: "include",
                    });
                    if (retry.ok) {
                        const data = await retry.json() as { success: boolean; data: User };
                        setUser(data.success ? data.data : null);
                        return;
                    }
                }
            }

            setUser(null);
        } catch {
            setUser(null);
        }
    }, [silentRefresh]);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    // ---------------------------------------------------------------------------
    // Authenticated fetch — auto-retries once after a silent refresh on 401
    // ---------------------------------------------------------------------------
    const apiFetch = useCallback(async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        const opts: RequestInit = { credentials: "include", ...init };
        const res = await fetch(input, opts);

        if (res.status !== 401) return res;

        // Try to refresh
        const refreshed = await silentRefresh();
        if (!refreshed) {
            // Refresh token exhausted — sign out
            setUser(null);
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            return res;
        }

        // Retry the original request with the new access token (cookie is now rotated)
        return fetch(input, opts);
    }, [silentRefresh]);

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

    // Fetch user on mount
    useEffect(() => {
        fetchUser().finally(() => setLoading(false));
    }, [fetchUser]);

    // Proactive refresh every 50 minutes so the user is never interrupted
    useEffect(() => {
        const id = setInterval(async () => {
            const refreshed = await silentRefresh();
            if (!refreshed) {
                // Refresh token is also gone — sign out cleanly
                setUser(null);
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }, REFRESH_INTERVAL_MS);

        return () => clearInterval(id);
    }, [silentRefresh]);

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refreshUser, apiFetch }}>
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
