import Link from "next/link";

export interface AssetItem {
    id: string;
    symbol: string;
    name?: string;
    company_name?: string;
    // Stock-specific
    close_price?: number;
    open_price?: number;
    // Fund-specific
    ytd?: number;
}

interface AssetListProps {
    items: AssetItem[];
    type: "stock" | "fund";
    emptyMessage?: string;
    loading?: boolean;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
}

function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 1) + "…";
}

function PriceIndicator({ closePrice, openPrice }: { closePrice?: number; openPrice?: number }) {
    if (closePrice === undefined) return null;

    const isUp = openPrice !== undefined && closePrice > openPrice;
    const isDown = openPrice !== undefined && closePrice < openPrice;

    return (
        <span className={`asset-price ${isUp ? "up" : ""} ${isDown ? "down" : ""}`}>
            {isUp && <span className="arrow">↑</span>}
            {isDown && <span className="arrow">↓</span>}
            {formatPrice(closePrice)}
        </span>
    );
}

function YtdIndicator({ ytd }: { ytd?: number }) {
    if (ytd === undefined) return null;

    const isUp = ytd > 0;
    const isDown = ytd < 0;

    return (
        <span className={`asset-ytd ${isUp ? "up" : ""} ${isDown ? "down" : ""}`}>
            {isUp && <span className="arrow">↑</span>}
            {isDown && <span className="arrow">↓</span>}
            {formatPercent(ytd)}
        </span>
    );
}

export function AssetList({ items, type, emptyMessage = "No data available", loading = false }: AssetListProps) {
    if (loading) {
        return (
            <div className="asset-list-loading">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="asset-list-item-skeleton" />
                ))}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return <div className="asset-list-empty">{emptyMessage}</div>;
    }

    const getHref = (item: AssetItem) => {
        return type === "stock" ? `/dashboard/stocks/${item.symbol}` : `/dashboard/funds/${item.id}`;
    };

    const getDisplayName = (item: AssetItem) => {
        const name = item.company_name || item.name || item.symbol;
        return type === "fund" ? truncate(name, 40) : name;
    };

    return (
        <ul className="asset-list">
            {items.map((item) => (
                <li key={item.id} className="asset-list-item">
                    <Link href={getHref(item)} className="asset-list-link">
                        <span className="asset-symbol">{item.symbol || "—"}</span>
                        <span className="asset-name">{getDisplayName(item)}</span>
                        {type === "stock" && (
                            <PriceIndicator closePrice={item.close_price} openPrice={item.open_price} />
                        )}
                        {type === "fund" && (
                            <YtdIndicator ytd={item.ytd} />
                        )}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

