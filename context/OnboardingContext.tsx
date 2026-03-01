"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

interface OnboardingData {
    displayName: string | null;
    financialKnowledge: string | null;
    occupation: string | null;
    interests: string[];
}

interface OnboardingContextType {
    data: OnboardingData;
    setDisplayName: (name: string) => void;
    setFinancialKnowledge: (level: string) => void;
    setOccupation: (occupation: string) => void;
    setInterests: (interests: string[]) => void;
    submitProfile: () => Promise<{ success: boolean; error?: string }>;
    isSubmitting: boolean;
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

    const setDisplayName = useCallback((name: string) => {
        setData((prev) => ({ ...prev, displayName: name }));
    }, []);

    const setFinancialKnowledge = useCallback((level: string) => {
        setData((prev) => ({ ...prev, financialKnowledge: level }));
    }, []);

    const setOccupation = useCallback((occupation: string) => {
        setData((prev) => ({ ...prev, occupation }));
    }, []);

    const setInterests = useCallback((interests: string[]) => {
        setData((prev) => ({ ...prev, interests }));
    }, []);

    const submitProfile = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
        setIsSubmitting(true);

        try {
            // The sb-token HttpOnly cookie is sent automatically via credentials: "include".
            // No need to extract or pass the token manually.
            const response = await fetch(`${API_URL}/api/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    display_name: data.displayName,
                    financial_knowledge: data.financialKnowledge,
                    occupation: data.occupation,
                    interests: data.interests.length > 0 ? data.interests : null,
                }),
            });

            const result = await response.json() as { error?: string };

            if (!response.ok) {
                return { success: false, error: result.error ?? "Failed to save profile" };
            }

            return { success: true };
        } catch {
            return { success: false, error: "Network error" };
        } finally {
            setIsSubmitting(false);
        }
    }, [data]);

    const value: OnboardingContextType = {
        data,
        setDisplayName,
        setFinancialKnowledge,
        setOccupation,
        setInterests,
        submitProfile,
        isSubmitting,
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
