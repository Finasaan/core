import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import { NewsSentimentBadge } from "./NewsSentimentBadge";
import { NewsAffectedTags } from "./NewsAffectedTags";
import type { EconomicNews } from "@/lib/news";

export function NewsCard({ article }: { article: EconomicNews }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-md transition-all duration-300 border-muted/60">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              {article.source} • {formatDistanceToNow(new Date(article.published_at))} ago
            </span>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:text-primary transition-colors line-clamp-2 leading-tight"
            >
              {article.title}
            </a>
          </div>
          <NewsSentimentBadge sentiment={article.sentiment} />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 pb-2 flex-grow">
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {article.ai_summary || "No summary available."}
        </p>
        <NewsAffectedTags sectors={article.affected_sectors} tickers={article.affected_tickers} />
      </CardContent>

      <CardFooter className="p-4 pt-0 justify-between items-center bg-muted/5 border-t border-muted/30">
        <div className="text-[10px] text-muted-foreground italic truncate max-w-[80%]">
          {article.impact_analysis || "General economic news"}
        </div>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
}
