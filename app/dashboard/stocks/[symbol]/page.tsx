import { StockDetail } from "@/components/dashboard/StockDetail";

interface StockPageProps {
    params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: StockPageProps) {
    const { symbol } = await params;

    return <StockDetail symbol={symbol.toUpperCase()} />;
}
