import { DashboardLayout } from "@/components/dashboard";
import { BudgetAIProvider } from "@/context/BudgetAIContext";
import "./dashboard.css";

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BudgetAIProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </BudgetAIProvider>
    );
}
