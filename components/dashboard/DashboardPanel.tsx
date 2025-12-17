interface DashboardPanelProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function DashboardPanel({ title, children, className = "" }: DashboardPanelProps) {
    return (
        <div className={`dashboard-panel ${className}`}>
            <h2 className="dashboard-panel-title">{title}</h2>
            <div className="dashboard-panel-content">
                {children}
            </div>
        </div>
    );
}
