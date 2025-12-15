// Skip static generation - OnboardingProvider uses Supabase
export const dynamic = "force-dynamic";

import { OnboardingProvider } from "@/context/OnboardingContext";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <OnboardingProvider>{children}</OnboardingProvider>;
}
