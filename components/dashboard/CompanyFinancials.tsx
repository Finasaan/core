"use client";

import { useState, useEffect, useMemo } from "react";
import { getCompanyFinancials } from "@/lib/stocks";
import type {
    CompanyFinancialsData,
    ExtractedTable,
    FinancialReport,
    CompanyRatio,
} from "@/lib/stocks";

// ---- Helpers ----

function formatNumber(num: number): string {
    if (Math.abs(num) >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (Math.abs(num) >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (Math.abs(num) >= 1_000) return (num / 1_000).toFixed(2) + "K";
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// ---- Sub-components ----

function ExtractedTableView({ table }: { table: ExtractedTable }) {
    const [expanded, setExpanded] = useState(false);
    const maxRows = 8;
    const displayRows = expanded ? table.rows : table.rows.slice(0, maxRows);

    return (
        <div className="financial-table-card">
            <div className="financial-table-header">
                <div className="financial-table-header-left">
                    <h4 className="financial-table-title">{table.table_name}</h4>
                    <div className="financial-table-meta">
                        <span className="financial-table-badge">{table.table_type}</span>
                        {table.fiscal_period && (
                            <span className="financial-table-period">{table.fiscal_period}</span>
                        )}
                        {table.table_unit && (
                            <span className="financial-table-unit">{table.currency} {table.table_unit}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="financial-table-scroll">
                <table className="financial-data-table">
                    <thead>
                        <tr>
                            {table.headers.map((h, i) => (
                                <th key={i}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayRows.map((row, ri) => (
                            <tr key={ri}>
                                {table.headers.map((h, ci) => (
                                    <td key={ci} className={ci === 0 ? "label-cell" : "value-cell"}>
                                        {row[h] != null ? String(row[h]) : "—"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {table.rows.length > maxRows && (
                <button
                    className="financial-table-expand"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "Show less" : `Show all ${table.rows.length} rows`}
                </button>
            )}
        </div>
    );
}

function FinancialReportView({ report }: { report: FinancialReport }) {
    const [expanded, setExpanded] = useState(false);
    const items = report.financial_report_line_items || [];
    const maxItems = 10;
    const displayItems = expanded ? items : items.slice(0, maxItems);

    const reportLabel = report.report_type.replace(/_/g, " ");
    const periodLabel = report.fiscal_year
        ? `FY${report.fiscal_year}${report.fiscal_quarter ? ` Q${report.fiscal_quarter}` : ""}`
        : report.period_end_date ? formatDate(report.period_end_date) : "";

    return (
        <div className="financial-table-card">
            <div className="financial-table-header">
                <div className="financial-table-header-left">
                    <h4 className="financial-table-title">{reportLabel}</h4>
                    <div className="financial-table-meta">
                        <span className="financial-table-badge">{report.period_type}</span>
                        {periodLabel && <span className="financial-table-period">{periodLabel}</span>}
                        {report.currency && <span className="financial-table-unit">{report.currency}</span>}
                    </div>
                </div>
            </div>

            {items.length > 0 ? (
                <>
                    <div className="financial-table-scroll">
                        <table className="financial-data-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="label-cell">{item.item_label || item.item_key}</td>
                                        <td className="value-cell">{formatNumber(item.item_value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {items.length > maxItems && (
                        <button
                            className="financial-table-expand"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? "Show less" : `Show all ${items.length} items`}
                        </button>
                    )}
                </>
            ) : (
                <p className="financial-empty-text">No line items available</p>
            )}
        </div>
    );
}

function RatiosView({ ratios }: { ratios: CompanyRatio[] }) {
    // Group ratios by date
    const grouped = useMemo(() => {
        const map = new Map<string, CompanyRatio[]>();
        for (const r of ratios) {
            const key = r.as_of_date || "unknown";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(r);
        }
        return Array.from(map.entries()).slice(0, 3); // Show 3 most recent dates
    }, [ratios]);

    if (grouped.length === 0) return null;

    return (
        <div className="financial-table-card">
            <div className="financial-table-header">
                <div className="financial-table-header-left">
                    <h4 className="financial-table-title">Financial Ratios</h4>
                </div>
            </div>
            <div className="financial-table-scroll">
                <table className="financial-data-table">
                    <thead>
                        <tr>
                            <th>Ratio</th>
                            {grouped.map(([date]) => (
                                <th key={date}>{date !== "unknown" ? formatDate(date) : "—"}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Collect unique ratio keys */}
                        {Array.from(new Set(ratios.map((r) => r.ratio_key))).map((key) => (
                            <tr key={key}>
                                <td className="label-cell">{key.replace(/_/g, " ")}</td>
                                {grouped.map(([date, dateRatios]) => {
                                    const ratio = dateRatios.find((r) => r.ratio_key === key);
                                    return (
                                        <td key={date} className="value-cell">
                                            {ratio ? formatNumber(ratio.ratio_value) : "—"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ---- Main Component ----

type FinancialTab = "tables" | "reports" | "ratios";

interface CompanyFinancialsProps {
    companyId: string;
}

export function CompanyFinancials({ companyId }: CompanyFinancialsProps) {
    const [data, setData] = useState<CompanyFinancialsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState<FinancialTab>("tables");

    useEffect(() => {
        setLoading(true);
        setError(false);
        getCompanyFinancials(companyId)
            .then((result) => {
                setData(result);
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => setLoading(false));
    }, [companyId]);

    // Group extracted tables by type — must be before any early returns (Rules of Hooks)
    const tablesByType = useMemo(() => {
        const map = new Map<string, ExtractedTable[]>();
        for (const t of data?.extracted_tables ?? []) {
            const key = t.table_type || "Other";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(t);
        }
        return map;
    }, [data?.extracted_tables]);

    // Don't render at all if there's no data or error
    if (loading) {
        return (
            <div className="financials-section">
                <h3 className="stock-section-title">Financials & Analysis</h3>
                <div className="financials-loading">
                    <div className="stock-chart-spinner" />
                    Loading financial data...
                </div>
            </div>
        );
    }

    if (error || !data) return null;

    const hasExtractedTables = data.extracted_tables.length > 0;
    const hasReports = data.financial_reports.length > 0;
    const hasRatios = data.company_ratios.length > 0;
    const hasAnyData = hasExtractedTables || hasReports || hasRatios;

    if (!hasAnyData) return null;

    // Determine available tabs
    const tabs: { key: FinancialTab; label: string; count: number }[] = [];
    if (hasExtractedTables) tabs.push({ key: "tables", label: "Financial Tables", count: data.extracted_tables.length });
    if (hasReports) tabs.push({ key: "reports", label: "Reports", count: data.financial_reports.length });
    if (hasRatios) tabs.push({ key: "ratios", label: "Ratios", count: data.company_ratios.length });

    // Default to first available tab
    const currentTab = tabs.find((t) => t.key === activeTab) ? activeTab : tabs[0]?.key || "tables";

    return (
        <div className="financials-section">
            <h3 className="stock-section-title">Financials & Analysis</h3>

            {/* Tab bar */}
            {tabs.length > 1 && (
                <div className="financials-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`financials-tab ${currentTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            <span className="financials-tab-count">{tab.count}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Tab content */}
            <div className="financials-content">
                {currentTab === "tables" && hasExtractedTables && (
                    <div className="financials-tables-list">
                        {Array.from(tablesByType.entries()).map(([type, tables]) => (
                            <div key={type} className="financials-type-group">
                                <h4 className="financials-type-title">{type.replace(/_/g, " ")}</h4>
                                {tables.map((table) => (
                                    <ExtractedTableView key={table.id} table={table} />
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {currentTab === "reports" && hasReports && (
                    <div className="financials-tables-list">
                        {data.financial_reports.map((report) => (
                            <FinancialReportView key={report.id} report={report} />
                        ))}
                    </div>
                )}

                {currentTab === "ratios" && hasRatios && (
                    <RatiosView ratios={data.company_ratios} />
                )}
            </div>
        </div>
    );
}
