"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

// Spine API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface OnboardingData {
    displayName: string | null;
    financialKnowledge: string | null;
    occupation: string | null;
    interests: string[];
}

interface OnboardingContextType {
    data: OnboardingData;
    setDisplayName: (name: string) => Promise<boolean>;
    setFinancialKnowledge: (level: string) => Promise<boolean>;
    setOccupation: (occupation: string) => Promise<boolean>;
    setInterests: (interests: string[]) => Promise<boolean>;
    submitProfile: () => Promise<{ success: boolean; error?: string }>;
    isSubmitting: boolean;
    isSaving: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const initialData: OnboardingData = {
    displayName: null,
    financialKnowledge: null,
    occupation: null,
    interests: [],
};

interface OnboardingProviderProps {
    children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
    const [data, setData] = useState<OnboardingData>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const supabase = createClient();

    /**
     * Helper to save current profile data to spine
     * Returns true if successful, false otherwise
     */
    const saveToSpine = useCallback(async (updates: Partial<{
        display_name: string | null;
        financial_knowledge: string | null;
        occupation: string | null;
        interests: string[] | null;
    }>): Promise<boolean> => {
        setIsSaving(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;

            if (!accessToken) {
                console.error("Not authenticated, cannot save profile");
                return false;
            }

            const response = await fetch(`${API_URL}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const result = await response.json() as { error?: string };
                console.error("Failed to save profile:", result.error);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Failed to save to spine:", error);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [supabase.auth]);

    /**
     * Set display name and immediately persist to DB
     */
    const setDisplayName = useCallback(async (name: string): Promise<boolean> => {
        // Update local state first for responsiveness
        setData((prev) => ({ ...prev, displayName: name }));

        // Persist to spine
        return await saveToSpine({ display_name: name });
    }, [saveToSpine]);

    /**
     * Set financial knowledge level and immediately persist
     */
    const setFinancialKnowledge = useCallback(async (level: string): Promise<boolean> => {
        setData((prev) => ({ ...prev, financialKnowledge: level }));
        return await saveToSpine({ financial_knowledge: level });
    }, [saveToSpine]);

    /**
     * Set occupation and immediately persist
     */
    const setOccupation = useCallback(async (occupation: string): Promise<boolean> => {
        setData((prev) => ({ ...prev, occupation }));
        return await saveToSpine({ occupation });
    }, [saveToSpine]);

    /**
     * Set interests and immediately persist
     */
    const setInterests = useCallback(async (interests: string[]): Promise<boolean> => {
        setData((prev) => ({ ...prev, interests }));
        return await saveToSpine({ interests: interests.length > 0 ? interests : null });
    }, [saveToSpine]);

    /**
     * Submit the complete profile (legacy method, kept for compatibility)
     * Now mostly redundant since we save incrementally, but can be used for final validation
     */
    const submitProfile = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
        setIsSubmitting(true);

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;

            if (!accessToken) {
                return { success: false, error: "Not authenticated" };
            }

            const response = await fetch(`${API_URL}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    display_name: data.displayName,
                    financial_knowledge: data.financialKnowledge,
                    occupation: data.occupation,
                    interests: data.interests.length > 0 ? data.interests : null,
                }),
            });

            const result = await response.json() as { error?: string };

            if (!response.ok) {
                return { success: false, error: result.error || "Failed to save profile" };
            }

            return { success: true };
        } catch (error) {
            console.error("Failed to submit profile:", error);
            return { success: false, error: "Network error" };
        } finally {
            setIsSubmitting(false);
        }
    }, [data, supabase.auth]);

    const value: OnboardingContextType = {
        data,
        setDisplayName,
        setFinancialKnowledge,
        setOccupation,
        setInterests,
        submitProfile,
        isSubmitting,
        isSaving,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
}

