import { Badge } from "@/components/ui/badge";
import type { NewsSentiment } from "@/lib/news";

const CONFIG: Record<NewsSentiment, { label: string; className: string }> = {
  positive: { label: "Positive", className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  negative: { label: "Negative", className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
  neutral:  { label: "Neutral",  className: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100"  },
};

export function NewsSentimentBadge({ sentiment }: { sentiment: NewsSentiment }) {
  const { label, className } = CONFIG[sentiment];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}
