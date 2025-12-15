"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    // Refresh session manually if needed
    const refreshSession = useCallback(async () => {
        const { data, error } = await supabase.auth.refreshSession();
        if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
        }
    }, [supabase.auth]);

    // Sign out handler
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
    }, [supabase.auth]);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const {
                data: { session: initialSession },
            } = await supabase.auth.getSession();

            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const value: AuthContextType = {
        user,
        session,
        loading,
        signOut,
        refreshSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
