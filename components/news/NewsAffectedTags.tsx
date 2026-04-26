import { Badge } from "@/components/ui/badge";

interface Props {
  sectors: string[];
  tickers: string[];
  limit?: number;
}

export function NewsAffectedTags({ sectors, tickers, limit = 4 }: Props) {
  const combined = [...sectors, ...tickers].slice(0, limit);

  if (combined.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {combined.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5 h-4 bg-muted/50 text-muted-foreground font-normal">
          {tag}
        </Badge>
      ))}
      {(sectors.length + tickers.length) > limit && (
        <span className="text-[10px] text-muted-foreground self-center">
          +{sectors.length + tickers.length - limit}
        </span>
      )}
    </div>
  );
}
