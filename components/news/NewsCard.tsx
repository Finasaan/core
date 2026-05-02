"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Sparkles } from "lucide-react";
import { NewsSentimentBadge } from "./NewsSentimentBadge";
import { NewsAffectedTags } from "./NewsAffectedTags";
import type { EconomicNews } from "@/lib/news";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function NewsCard({ article, showPopover = false }: { article: EconomicNews, showPopover?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const cardContent = (
    <Card 
      className={`overflow-hidden h-full flex flex-col group hover:shadow-md transition-all duration-300 border-muted/60 ${isOpen ? "ring-2 ring-primary/20" : ""}`}
      onMouseEnter={() => showPopover && setIsOpen(true)}
      onMouseLeave={() => showPopover && setIsOpen(false)}
    >
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
        {!showPopover && (
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-3">
            {article.ai_summary || "No summary available."}
          </p>
        )}
        <NewsAffectedTags sectors={article.affected_sectors} tickers={article.affected_tickers} />
      </CardContent>

      {!showPopover && (
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
      )}
      
      {showPopover && (
        <CardFooter className="p-4 pt-0 justify-end items-center border-t border-muted/10">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors mt-2"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardFooter>
      )}
    </Card>
  );

  if (!showPopover) return cardContent;

  const sentimentStyles = {
    positive: "border-green-500/30 bg-green-50/95 backdrop-blur-md text-green-950",
    negative: "border-red-500/30 bg-red-50/95 backdrop-blur-md text-red-950",
    neutral: "border-slate-300 bg-slate-50/95 backdrop-blur-md text-slate-950",
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {cardContent}
      </PopoverTrigger>
      <PopoverContent 
        className={`w-80 p-0 overflow-hidden border shadow-2xl animate-in fade-in zoom-in duration-200 ${sentimentStyles[article.sentiment] || sentimentStyles.neutral}`}
        side="top"
        align="center"
        sideOffset={12}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-black/5 pb-2">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-primary/20 text-primary font-bold flex items-center gap-1 py-0.5 px-2">
              <Sparkles className="w-3 h-3" />
              AI-GENERATED
            </Badge>
            <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Analysis</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase opacity-50 flex items-center gap-1.5">
              Summary
            </h4>
            <p className="text-sm leading-relaxed font-medium">
              {article.ai_summary || "No summary available."}
            </p>
          </div>
          
          {article.impact_analysis && (
            <div className="pt-2 border-t border-black/5 space-y-2">
              <h4 className="text-xs font-bold uppercase opacity-50 flex items-center gap-1.5">
                Impact Analysis
              </h4>
              <p className="text-sm leading-relaxed italic">
                {article.impact_analysis}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
