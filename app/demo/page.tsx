import FinancialTips from "@/components/financial-tips";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Finasaan Demo - Financial Tips
        </h1>
        <FinancialTips />
      </div>
    </div>
  );
}
