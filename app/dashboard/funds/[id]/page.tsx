import { FundDetail } from "@/components/dashboard/FundDetail";

interface FundPageProps {
    params: Promise<{ id: string }>;
}

export default async function FundPage({ params }: FundPageProps) {
    const { id } = await params;

    return <FundDetail fundId={id} />;
}
