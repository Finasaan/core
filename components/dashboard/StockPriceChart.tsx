"use client";

import { useMemo } from "react";
import {
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { StockDayData, StockChartPoint, StockTimeRange } from "@/lib/stocks";
import { STOCK_TIME_RANGES } from "@/lib/stocks";

// ---- Helpers ----

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
    }).format(price);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

function formatVolume(vol: number): string {
    if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(1) + "M";
    if (vol >= 1_000) return (vol / 1_000).toFixed(0) + "K";
    return vol.toLocaleString();
}

/**
 * Downsample data to a reasonable number of points for the chart.
 * This prevents rendering hundreds of data points unnecessarily.
 */
function downsample(data: StockChartPoint[], maxPoints = 120): StockChartPoint[] {
    if (data.length <= maxPoints) return data;
    const step = data.length / maxPoints;
    const result: StockChartPoint[] = [];
    for (let i = 0; i < maxPoints; i++) {
        result.push(data[Math.floor(i * step)]);
    }
    // Always include the last point
    if (result[result.length - 1] !== data[data.length - 1]) {
        result.push(data[data.length - 1]);
    }
    return result;
}

// ---- Custom Tooltip ----

interface TooltipPayload {
    value: number;
    payload: StockChartPoint;
    dataKey: string;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
        <div className="chart-tooltip stock-chart-tooltip">
            <p className="tooltip-date">{point.displayDate}</p>
            <div className="stock-tooltip-grid">
                <span className="stock-tooltip-label">Open</span>
                <span className="stock-tooltip-value">{formatPrice(point.open)}</span>
                <span className="stock-tooltip-label">High</span>
                <span className="stock-tooltip-value highlight-up">{formatPrice(point.high)}</span>
                <span className="stock-tooltip-label">Low</span>
                <span className="stock-tooltip-value highlight-down">{formatPrice(point.low)}</span>
                <span className="stock-tooltip-label">Close</span>
                <span className="stock-tooltip-value">{formatPrice(point.close)}</span>
                <span className="stock-tooltip-label">Volume</span>
                <span className="stock-tooltip-value">{formatVolume(point.volume)}</span>
            </div>
        </div>
    );
}

// ---- StockPriceChart Component ----

interface StockPriceChartProps {
    /** Raw OHLCV data from API (newest-first order) */
    data: StockDayData[];
    /** Currently selected time range */
    timeRange: StockTimeRange;
    /** Callback when user selects a time range */
    onTimeRangeChange: (range: StockTimeRange) => void;
    /** Whether data is currently loading */
    loading?: boolean;
}

export function StockPriceChart({
    data,
    timeRange,
    onTimeRangeChange,
    loading = false,
}: StockPriceChartProps) {
    // Transform and sort data (API returns newest first, chart needs oldest first)
    const chartData = useMemo<StockChartPoint[]>(() => {
        if (!data || data.length === 0) return [];

        const sorted = [...data]
            .sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
            .map((d) => ({
                date: d.trade_date,
                displayDate: formatDate(d.trade_date),
                close: d.close_price,
                open: d.open_price,
                high: d.high_price,
                low: d.low_price,
                volume: d.volume,
            }));

        return downsample(sorted);
    }, [data]);

    // Compute period performance
    const periodPerformance = useMemo(() => {
        if (chartData.length < 2) return null;
        const startPrice = chartData[0].close;
        const endPrice = chartData[chartData.length - 1].close;
        const change = endPrice - startPrice;
        const percentChange = (change / startPrice) * 100;
        return { startPrice, endPrice, change, percentChange };
    }, [chartData]);

    const isPositive = periodPerformance ? periodPerformance.percentChange >= 0 : true;
    const color = isPositive ? "#16A34A" : "#DC2626";
    const gradientId = isPositive ? "stockGradientUp" : "stockGradientDown";

    return (
        <div className="fund-chart-card">
            <div className="fund-chart-header">
                <h3 className="stock-section-title">Price History</h3>
                <div className="fund-time-range">
                    {STOCK_TIME_RANGES.map((range) => (
                        <button
                            key={range.key}
                            className={`time-range-btn ${timeRange === range.key ? "active" : ""}`}
                            onClick={() => onTimeRangeChange(range.key)}
                            disabled={loading}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {periodPerformance && (
                <div className="fund-period-stats">
                    <span className="period-stat">
                        Start: <strong>{formatPrice(periodPerformance.startPrice)}</strong>
                    </span>
                    <span className="period-stat">
                        End: <strong>{formatPrice(periodPerformance.endPrice)}</strong>
                    </span>
                    <span className={`period-stat change ${periodPerformance.percentChange >= 0 ? "up" : "down"}`}>
                        {periodPerformance.percentChange >= 0 ? "↑" : "↓"} {formatPercent(periodPerformance.percentChange)}
                    </span>
                </div>
            )}

            <div className="fund-chart-container">
                {loading ? (
                    <div className="stock-chart-loading">
                        <div className="stock-chart-spinner" />
                        Loading chart data...
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="nav-chart-empty">No price data available for this period</div>
                ) : (
                    <ResponsiveContainer width="100%" height={340}>
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString("en-PK", {
                                        month: "short",
                                        year: "2-digit",
                                    })
                                }
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                                minTickGap={50}
                            />
                            {/* Price Y-axis (left) */}
                            <YAxis
                                yAxisId="price"
                                domain={["auto", "auto"]}
                                tickFormatter={(v) => v.toFixed(0)}
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={55}
                            />
                            {/* Volume Y-axis (right, hidden) */}
                            <YAxis
                                yAxisId="volume"
                                orientation="right"
                                domain={[0, (max: number) => max * 4]}
                                hide
                            />
                            <Tooltip content={<ChartTooltip />} />
                            {/* Volume bars (behind price) */}
                            <Bar
                                yAxisId="volume"
                                dataKey="volume"
                                fill="#E5E7EB"
                                opacity={0.5}
                                barSize={chartData.length > 60 ? 2 : 4}
                            />
                            {/* Price area */}
                            <Area
                                yAxisId="price"
                                type="monotone"
                                dataKey="close"
                                stroke={color}
                                strokeWidth={2}
                                fill={`url(#${gradientId})`}
                                activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: "#fff" }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
