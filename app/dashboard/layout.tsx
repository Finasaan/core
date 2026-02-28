import { DashboardLayout } from "@/components/dashboard";
import "./dashboard.css";

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
