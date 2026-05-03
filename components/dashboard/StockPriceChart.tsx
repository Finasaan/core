"use client";

import { useMemo, useState, useCallback } from "react";
import {
    ComposedChart,
    Area,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import type { StockDayData, StockChartPoint, StockTimeRange } from "@/lib/stocks";
import { STOCK_TIME_RANGES } from "@/lib/stocks";
import {
    sma,
    ema,
    rsi as calcRSI,
    macd as calcMACD,
    bollingerBands,
    vwap as calcVWAP,
} from "@/lib/indicators";

// ---- Types ----

type ChartType = "line" | "candlestick";
type IndicatorKey = "sma20" | "sma50" | "ema12" | "ema26" | "bollinger" | "vwap";
type SubChartKey = "rsi" | "macd" | "volume";

interface IndicatorOption {
    key: IndicatorKey;
    label: string;
    color: string;
}

interface SubChartOption {
    key: SubChartKey;
    label: string;
}

const OVERLAY_INDICATORS: IndicatorOption[] = [
    { key: "sma20", label: "SMA 20", color: "#FF9800" },
    { key: "sma50", label: "SMA 50", color: "#2196F3" },
    { key: "ema12", label: "EMA 12", color: "#9C27B0" },
    { key: "ema26", label: "EMA 26", color: "#E91E63" },
    { key: "bollinger", label: "Bollinger", color: "#607D8B" },
    { key: "vwap", label: "VWAP", color: "#00BCD4" },
];

const SUB_CHARTS: SubChartOption[] = [
    { key: "volume", label: "Volume" },
    { key: "rsi", label: "RSI" },
    { key: "macd", label: "MACD" },
];

const INDICATOR_TOOLTIPS: Record<string, string> = {
    sma20: "SMA 20 — Simple Moving Average over 20 periods. Smooths short-term price noise.",
    sma50: "SMA 50 — Simple Moving Average over 50 periods. Tracks medium-term trend direction.",
    ema12: "EMA 12 — Exponential Moving Average (12 periods). Reacts faster to recent price changes than SMA.",
    ema26: "EMA 26 — Exponential Moving Average (26 periods). Used with EMA 12 to derive MACD.",
    bollinger: "Bollinger Bands — Volatility channel: SMA 20 ± 2 standard deviations. Bands widen when volatility is high.",
    vwap: "VWAP — Volume Weighted Average Price. Institutional benchmark for fair intraday value.",
    volume: "Volume — Shares traded per day. High volume validates price breakouts and reversals.",
    rsi: "RSI 14 — Relative Strength Index (0–100). Above 70 = overbought; below 30 = oversold.",
    macd: "MACD (12,26,9) — Momentum indicator. Shows difference between EMA 12 and EMA 26, with a 9-period signal line.",
};

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

function downsample<T>(data: T[], maxPoints = 150): T[] {
    if (data.length <= maxPoints) return data;
    const step = data.length / maxPoints;
    const result: T[] = [];
    for (let i = 0; i < maxPoints; i++) {
        result.push(data[Math.floor(i * step)]);
    }
    if (result[result.length - 1] !== data[data.length - 1]) {
        result.push(data[data.length - 1]);
    }
    return result;
}

// ---- Extended chart point with indicator data ----

interface EnrichedChartPoint extends StockChartPoint {
    sma20?: number | null;
    sma50?: number | null;
    ema12?: number | null;
    ema26?: number | null;
    bbUpper?: number | null;
    bbMiddle?: number | null;
    bbLower?: number | null;
    vwap?: number | null;
    rsiVal?: number | null;
    macdLine?: number | null;
    macdSignal?: number | null;
    macdHist?: number | null;
    // Candlestick helpers
    candleBody: [number, number]; // [open, close] for bar
    wickHigh: number;
    wickLow: number;
    isUp: boolean;
}

// ---- Custom Candlestick Shape ----

interface CandlestickShapeProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    payload?: EnrichedChartPoint;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

function CandlestickShape(props: CandlestickShapeProps) {
    const { x, width, payload } = props;
    if (!payload || x == null || width == null) return null;

    const { open, close, high, low, isUp } = payload;
    const color = isUp ? "#16A34A" : "#DC2626";

    // We need to compute y positions from the chart coordinate system
    // The parent YAxis maps price to pixel. We'll use the viewBox approach.
    // Since recharts Bar doesn't give us direct y-coordinate mappings for arbitrary values,
    // we render using the Bar's y/height for the body, and draw wicks relative to that.

    // The Bar already positions y and height for the candleBody range.
    // We need the y-axis scale to draw the wicks.
    // Unfortunately recharts doesn't expose the scale easily in shape props.
    // Workaround: Use the y and height from Bar to derive the scale factor.

    const barY = props.y ?? 0;
    const barHeight = Math.abs(props.height ?? 0);

    // The bar covers open→close range
    const bodyRange = Math.abs(close - open);
    if (bodyRange === 0 && barHeight === 0) {
        // Doji - just draw a horizontal line
        const centerX = x + width / 2;
        return (
            <g>
                <line
                    x1={centerX - width / 2}
                    y1={barY}
                    x2={centerX + width / 2}
                    y2={barY}
                    stroke={color}
                    strokeWidth={1}
                />
            </g>
        );
    }

    // Scale factor: pixels per price unit
    const pxPerUnit = bodyRange > 0 ? barHeight / bodyRange : 1;
    const bodyTop = Math.min(barY, barY + (props.height ?? 0));

    // Wick positions
    const topOfBody = isUp ? close : open; // higher price
    const wickTopPx = bodyTop - (high - topOfBody) * pxPerUnit;
    const bottomOfBody = isUp ? open : close;
    const wickBottomPx = bodyTop + barHeight + (bottomOfBody - low) * pxPerUnit;

    const centerX = x + width / 2;
    const bodyWidth = Math.max(width * 0.7, 2);
    const bodyX = x + (width - bodyWidth) / 2;

    return (
        <g>
            {/* Upper wick */}
            <line
                x1={centerX}
                y1={wickTopPx}
                x2={centerX}
                y2={bodyTop}
                stroke={color}
                strokeWidth={1}
            />
            {/* Body */}
            <rect
                x={bodyX}
                y={bodyTop}
                width={bodyWidth}
                height={Math.max(barHeight, 1)}
                fill={isUp ? color : color}
                fillOpacity={isUp ? 0.2 : 0.8}
                stroke={color}
                strokeWidth={1}
            />
            {/* Lower wick */}
            <line
                x1={centerX}
                y1={bodyTop + barHeight}
                x2={centerX}
                y2={wickBottomPx}
                stroke={color}
                strokeWidth={1}
            />
        </g>
    );
}

// ---- Custom Tooltip ----

interface TooltipPayload {
    value: number;
    payload: EnrichedChartPoint;
    dataKey: string;
}

function ChartTooltip({
    active,
    payload,
    activeIndicators,
    activeSubCharts,
}: {
    active?: boolean;
    payload?: TooltipPayload[];
    activeIndicators: Set<IndicatorKey>;
    activeSubCharts: Set<SubChartKey>;
}) {
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

            {/* Indicator values in tooltip */}
            {(activeIndicators.size > 0 || activeSubCharts.size > 0) && (
                <div className="stock-tooltip-indicators">
                    {activeIndicators.has("sma20") && point.sma20 != null && (
                        <div className="tooltip-indicator-row">
                            <span className="tooltip-indicator-dot" style={{ background: "#FF9800" }} />
                            <span>SMA 20: {point.sma20.toFixed(2)}</span>
                        </div>
                    )}
                    {activeIndicators.has("sma50") && point.sma50 != null && (
                        <div className="tooltip-indicator-row">
                            <span className="tooltip-indicator-dot" style={{ background: "#2196F3" }} />
                            <span>SMA 50: {point.sma50.toFixed(2)}</span>
                        </div>
                    )}
                    {activeIndicators.has("ema12") && point.ema12 != null && (
                        <div className="tooltip-indicator-row">
                            <span className="tooltip-indicator-dot" style={{ background: "#9C27B0" }} />
                            <span>EMA 12: {point.ema12.toFixed(2)}</span>
                        </div>
                    )}
                    {activeIndicators.has("ema26") && point.ema26 != null && (
                        <div className="tooltip-indicator-row">
                            <span className="tooltip-indicator-dot" style={{ background: "#E91E63" }} />
                            <span>EMA 26: {point.ema26.toFixed(2)}</span>
                        </div>
                    )}
                    {activeIndicators.has("vwap") && point.vwap != null && (
                        <div className="tooltip-indicator-row">
                            <span className="tooltip-indicator-dot" style={{ background: "#ec4899" }} />
                            <span>VWAP: {point.vwap.toFixed(2)}</span>
                        </div>
                    )}
                    {activeSubCharts.has("rsi") && point.rsiVal != null && (
                        <div className="tooltip-indicator-row">
                            <span className="tooltip-indicator-dot" style={{ background: "#FF5722" }} />
                            <span>RSI: {point.rsiVal.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ---- RSI Sub-chart Tooltip ----

function RSITooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0].payload;
    if (point.rsiVal == null) return null;

    return (
        <div className="chart-tooltip stock-chart-tooltip">
            <p className="tooltip-date">{point.displayDate}</p>
            <div className="tooltip-indicator-row">
                <span>RSI(14): <strong>{point.rsiVal.toFixed(1)}</strong></span>
            </div>
        </div>
    );
}

// ---- MACD Sub-chart Tooltip ----

function MACDTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0].payload;

    return (
        <div className="chart-tooltip stock-chart-tooltip">
            <p className="tooltip-date">{point.displayDate}</p>
            {point.macdLine != null && (
                <div className="tooltip-indicator-row">
                    <span className="tooltip-indicator-dot" style={{ background: "#2196F3" }} />
                    <span>MACD: {point.macdLine.toFixed(2)}</span>
                </div>
            )}
            {point.macdSignal != null && (
                <div className="tooltip-indicator-row">
                    <span className="tooltip-indicator-dot" style={{ background: "#FF9800" }} />
                    <span>Signal: {point.macdSignal.toFixed(2)}</span>
                </div>
            )}
            {point.macdHist != null && (
                <div className="tooltip-indicator-row">
                    <span className="tooltip-indicator-dot" style={{ background: point.macdHist >= 0 ? "#16A34A" : "#DC2626" }} />
                    <span>Histogram: {point.macdHist.toFixed(2)}</span>
                </div>
            )}
        </div>
    );
}

// ---- StockPriceChart Component ----

interface StockPriceChartProps {
    data: StockDayData[];
    timeRange: StockTimeRange;
    onTimeRangeChange: (range: StockTimeRange) => void;
    loading?: boolean;
}

export function StockPriceChart({
    data,
    timeRange,
    onTimeRangeChange,
    loading = false,
}: StockPriceChartProps) {
    const [chartType, setChartType] = useState<ChartType>("line");
    const [activeIndicators, setActiveIndicators] = useState<Set<IndicatorKey>>(new Set());
    const [activeSubCharts, setActiveSubCharts] = useState<Set<SubChartKey>>(new Set(["volume"]));

    const toggleIndicator = useCallback((key: IndicatorKey) => {
        setActiveIndicators((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    const toggleSubChart = useCallback((key: SubChartKey) => {
        setActiveSubCharts((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    // Transform, sort, compute indicators, downsample
    const chartData = useMemo<EnrichedChartPoint[]>(() => {
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

        // Extract price arrays for indicator computation (before downsampling)
        const closes = sorted.map((d) => d.close);
        const highs = sorted.map((d) => d.high);
        const lows = sorted.map((d) => d.low);
        const volumes = sorted.map((d) => d.volume);

        // Compute all indicators on full data
        const sma20Vals = sma(closes, 20);
        const sma50Vals = sma(closes, 50);
        const ema12Vals = ema(closes, 12);
        const ema26Vals = ema(closes, 26);
        const bb = bollingerBands(closes, 20, 2);
        const vwapVals = calcVWAP(highs, lows, closes, volumes);
        const rsiResult = calcRSI(closes, 14);
        const macdResult = calcMACD(closes, 12, 26, 9);

        // Enrich each point
        const enriched: EnrichedChartPoint[] = sorted.map((point, i) => ({
            ...point,
            sma20: sma20Vals[i],
            sma50: sma50Vals[i],
            ema12: ema12Vals[i],
            ema26: ema26Vals[i],
            bbUpper: bb.upper[i],
            bbMiddle: bb.middle[i],
            bbLower: bb.lower[i],
            vwap: vwapVals[i],
            rsiVal: rsiResult.rsi[i],
            macdLine: macdResult.macd[i],
            macdSignal: macdResult.signal[i],
            macdHist: macdResult.histogram[i],
            candleBody: [point.open, point.close] as [number, number],
            wickHigh: point.high,
            wickLow: point.low,
            isUp: point.close >= point.open,
        }));

        return downsample(enriched);
    }, [data]);

    // Period performance
    const periodPerformance = useMemo(() => {
        if (chartData.length < 2) return null;
        const startPrice = chartData[0].close;
        const endPrice = chartData[chartData.length - 1].close;
        const change = endPrice - startPrice;
        const percentChange = (change / startPrice) * 100;
        return { startPrice, endPrice, change, percentChange };
    }, [chartData]);

    const isPositive = periodPerformance ? periodPerformance.percentChange >= 0 : true;
    const mainColor = isPositive ? "#16A34A" : "#DC2626";
    const gradientId = isPositive ? "stockGradientUp" : "stockGradientDown";

    const hasSubCharts = activeSubCharts.has("rsi") || activeSubCharts.has("macd");
    const mainChartHeight = hasSubCharts ? 300 : 360;

    return (
        <div className="stock-chart-card">
            {/* Chart Header */}
            <div className="stock-chart-header">
                <div className="stock-chart-header-left">
                    <h3 className="stock-section-title">Price History</h3>
                    {/* Chart Type Toggle */}
                    <div className="chart-type-toggle">
                        <button
                            className={`chart-type-btn ${chartType === "line" ? "active" : ""}`}
                            onClick={() => setChartType("line")}
                            title="Line Chart"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22,6 13.5,15.5 8.5,10.5 2,17" />
                            </svg>
                        </button>
                        <button
                            className={`chart-type-btn ${chartType === "candlestick" ? "active" : ""}`}
                            onClick={() => setChartType("candlestick")}
                            title="Candlestick Chart"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="9" y1="2" x2="9" y2="6" />
                                <rect x="6" y="6" width="6" height="8" rx="1" />
                                <line x1="9" y1="14" x2="9" y2="18" />
                                <line x1="17" y1="6" x2="17" y2="10" />
                                <rect x="14" y="10" width="6" height="6" rx="1" />
                                <line x1="17" y1="16" x2="17" y2="22" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Time Range Buttons */}
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

            {/* Period Stats */}
            {periodPerformance && (
                <div className="fund-period-stats">
                    <span className="period-stat">
                        Start: <strong>{formatPrice(periodPerformance.startPrice)}</strong>
                    </span>
                    <span className="period-stat">
                        End: <strong>{formatPrice(periodPerformance.endPrice)}</strong>
                    </span>
                    <span className={`period-stat change ${periodPerformance.percentChange >= 0 ? "up" : "down"}`}>
                        {periodPerformance.percentChange >= 0 ? "+" : ""}{formatPercent(periodPerformance.percentChange)}
                    </span>
                </div>
            )}

            {/* Indicator Toggle Bar */}
            <TooltipProvider delayDuration={300}>
            <div className="indicator-toggle-bar">
                <span className="indicator-toggle-label">Overlays:</span>
                {OVERLAY_INDICATORS.map((ind) => (
                    <UITooltip key={ind.key}>
                        <TooltipTrigger asChild>
                            <button
                                className={`indicator-chip ${activeIndicators.has(ind.key) ? "active" : ""}`}
                                onClick={() => toggleIndicator(ind.key)}
                                style={activeIndicators.has(ind.key) ? { borderColor: ind.color, color: ind.color } : {}}
                            >
                                <span
                                    className="indicator-chip-dot"
                                    style={{ background: activeIndicators.has(ind.key) ? ind.color : "#9CA3AF" }}
                                />
                                {ind.label}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[220px] text-xs">
                            {INDICATOR_TOOLTIPS[ind.key]}
                        </TooltipContent>
                    </UITooltip>
                ))}

                <span className="indicator-toggle-separator" />
                <span className="indicator-toggle-label">Panels:</span>
                {SUB_CHARTS.map((sc) => (
                    <UITooltip key={sc.key}>
                        <TooltipTrigger asChild>
                            <button
                                className={`indicator-chip ${activeSubCharts.has(sc.key) ? "active" : ""}`}
                                onClick={() => toggleSubChart(sc.key)}
                            >
                                {sc.label}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[220px] text-xs">
                            {INDICATOR_TOOLTIPS[sc.key]}
                        </TooltipContent>
                    </UITooltip>
                ))}
            </div>
            </TooltipProvider>

            {/* Main Chart */}
            <div className="fund-chart-container">
                {loading ? (
                    <div className="stock-chart-loading">
                        <div className="stock-chart-spinner" />
                        Loading chart data...
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="nav-chart-empty">No price data available for this period</div>
                ) : (
                    <>
                        {/* Main Price Chart */}
                        <ResponsiveContainer width="100%" height={mainChartHeight}>
                            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={mainColor} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={mainColor} stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="bbBandGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#607D8B" stopOpacity={0.08} />
                                        <stop offset="100%" stopColor="#607D8B" stopOpacity={0.02} />
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
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                    minTickGap={50}
                                />

                                <YAxis
                                    yAxisId="price"
                                    domain={["auto", "auto"]}
                                    tickFormatter={(v) => v.toFixed(0)}
                                    stroke="#9CA3AF"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    width={55}
                                />

                                {/* Volume bars (if enabled in sub-charts) */}
                                {activeSubCharts.has("volume") && !hasSubCharts && (
                                    <>
                                        <YAxis
                                            yAxisId="volume"
                                            orientation="right"
                                            domain={[0, (max: number) => max * 4]}
                                            hide
                                        />
                                        <Bar
                                            yAxisId="volume"
                                            dataKey="volume"
                                            fill="#E5E7EB"
                                            opacity={0.5}
                                            barSize={chartData.length > 60 ? 2 : 4}
                                        />
                                    </>
                                )}

                                <Tooltip
                                    content={
                                        <ChartTooltip
                                            activeIndicators={activeIndicators}
                                            activeSubCharts={activeSubCharts}
                                        />
                                    }
                                />

                                {/* Bollinger Bands (rendered before price so they appear behind) */}
                                {activeIndicators.has("bollinger") && (
                                    <>
                                        <Area
                                            yAxisId="price"
                                            type="monotone"
                                            dataKey="bbUpper"
                                            stroke="#607D8B"
                                            strokeWidth={1}
                                            strokeDasharray="4 2"
                                            fill="none"
                                            dot={false}
                                            connectNulls={false}
                                        />
                                        <Area
                                            yAxisId="price"
                                            type="monotone"
                                            dataKey="bbLower"
                                            stroke="#607D8B"
                                            strokeWidth={1}
                                            strokeDasharray="4 2"
                                            fill="url(#bbBandGradient)"
                                            dot={false}
                                            connectNulls={false}
                                        />
                                        <Line
                                            yAxisId="price"
                                            type="monotone"
                                            dataKey="bbMiddle"
                                            stroke="#607D8B"
                                            strokeWidth={1}
                                            dot={false}
                                            connectNulls={false}
                                            strokeOpacity={0.5}
                                        />
                                    </>
                                )}

                                {/* Price: Line or Candlestick */}
                                {chartType === "line" ? (
                                    <Area
                                        yAxisId="price"
                                        type="monotone"
                                        dataKey="close"
                                        stroke={mainColor}
                                        strokeWidth={2}
                                        fill={`url(#${gradientId})`}
                                        activeDot={{ r: 5, fill: mainColor, strokeWidth: 2, stroke: "#fff" }}
                                    />
                                ) : (
                                    <Bar
                                        yAxisId="price"
                                        dataKey="candleBody"
                                        barSize={chartData.length > 100 ? 3 : chartData.length > 50 ? 5 : 8}
                                        shape={<CandlestickShape />}
                                    />
                                )}

                                {/* SMA / EMA overlay lines */}
                                {activeIndicators.has("sma20") && (
                                    <Line
                                        yAxisId="price"
                                        type="monotone"
                                        dataKey="sma20"
                                        stroke="#f59e0b"
                                        strokeWidth={1.5}
                                        dot={false}
                                        connectNulls={false}
                                        isAnimationActive={false}
                                        name="SMA 20"
                                    />
                                )}
                                {activeIndicators.has("sma50") && (
                                    <Line
                                        yAxisId="price"
                                        type="monotone"
                                        dataKey="sma50"
                                        stroke="#3b82f6"
                                        strokeWidth={1.5}
                                        dot={false}
                                        connectNulls={false}
                                        isAnimationActive={false}
                                        name="SMA 50"
                                    />
                                )}
                                {activeIndicators.has("ema12") && (
                                    <Line
                                        yAxisId="price"
                                        type="monotone"
                                        dataKey="ema12"
                                        stroke="#10b981"
                                        strokeWidth={1.5}
                                        dot={false}
                                        connectNulls={false}
                                        isAnimationActive={false}
                                        name="EMA 12"
                                    />
                                )}
                                {activeIndicators.has("ema26") && (
                                    <Line
                                        yAxisId="price"
                                        type="monotone"
                                        dataKey="ema26"
                                        stroke="#8b5cf6"
                                        strokeWidth={1.5}
                                        dot={false}
                                        connectNulls={false}
                                        isAnimationActive={false}
                                        name="EMA 26"
                                    />
                                )}
                                {activeIndicators.has("vwap") && (
                                    <Line
                                        yAxisId="price"
                                        type="monotone"
                                        dataKey="vwap"
                                        stroke="#ec4899"
                                        strokeWidth={1.5}
                                        dot={false}
                                        connectNulls={false}
                                        strokeDasharray="4 2"
                                        isAnimationActive={false}
                                        name="VWAP"
                                    />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>

                        {/* RSI Sub-chart */}
                        {activeSubCharts.has("rsi") && (
                            <div className="sub-chart-container">
                                <span className="sub-chart-label">RSI (14)</span>
                                <ResponsiveContainer width="100%" height={120}>
                                    <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                        <XAxis dataKey="date" hide />
                                        <YAxis
                                            domain={[0, 100]}
                                            ticks={[30, 50, 70]}
                                            stroke="#9CA3AF"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            width={55}
                                        />
                                        <Tooltip content={<RSITooltip />} />
                                        <ReferenceLine y={70} stroke="#DC2626" strokeDasharray="3 3" strokeOpacity={0.5} />
                                        <ReferenceLine y={30} stroke="#16A34A" strokeDasharray="3 3" strokeOpacity={0.5} />
                                        <Area
                                            type="monotone"
                                            dataKey="rsiVal"
                                            stroke="#FF5722"
                                            strokeWidth={1.5}
                                            fill="#FF5722"
                                            fillOpacity={0.05}
                                            dot={false}
                                            connectNulls={false}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* MACD Sub-chart */}
                        {activeSubCharts.has("macd") && (
                            <div className="sub-chart-container">
                                <span className="sub-chart-label">MACD (12,26,9)</span>
                                <ResponsiveContainer width="100%" height={120}>
                                    <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                        <XAxis dataKey="date" hide />
                                        <YAxis
                                            domain={["auto", "auto"]}
                                            stroke="#9CA3AF"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            width={55}
                                        />
                                        <Tooltip content={<MACDTooltip />} />
                                        <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="3 3" />
                                        <Bar
                                            dataKey="macdHist"
                                            barSize={chartData.length > 60 ? 2 : 4}
                                            fill="#9CA3AF"
                                            shape={(props: CandlestickShapeProps) => {
                                                const val = props.payload?.macdHist ?? 0;
                                                const color = val >= 0 ? "#16A34A" : "#DC2626";
                                                return (
                                                    <rect
                                                        x={props.x}
                                                        y={props.y}
                                                        width={props.width}
                                                        height={Math.abs(props.height ?? 0)}
                                                        fill={color}
                                                        fillOpacity={0.4}
                                                    />
                                                );
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="macdLine"
                                            stroke="#2196F3"
                                            strokeWidth={1.5}
                                            dot={false}
                                            connectNulls={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="macdSignal"
                                            stroke="#FF9800"
                                            strokeWidth={1.5}
                                            dot={false}
                                            connectNulls={false}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Volume Sub-chart (only when RSI/MACD is shown) */}
                        {activeSubCharts.has("volume") && hasSubCharts && (
                            <div className="sub-chart-container">
                                <span className="sub-chart-label">Volume</span>
                                <ResponsiveContainer width="100%" height={80}>
                                    <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                        <XAxis dataKey="date" hide />
                                        <YAxis
                                            domain={[0, "auto"]}
                                            tickFormatter={(v) => formatVolume(v)}
                                            stroke="#9CA3AF"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            width={55}
                                        />
                                        <Bar
                                            dataKey="volume"
                                            barSize={chartData.length > 60 ? 2 : 4}
                                            shape={(props: CandlestickShapeProps) => {
                                                const isUp = props.payload?.isUp ?? true;
                                                return (
                                                    <rect
                                                        x={props.x}
                                                        y={props.y}
                                                        width={props.width}
                                                        height={props.height}
                                                        fill={isUp ? "#16A34A" : "#DC2626"}
                                                        fillOpacity={0.3}
                                                    />
                                                );
                                            }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
