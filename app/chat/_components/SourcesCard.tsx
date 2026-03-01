"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { FileTextIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";

interface Source {
  domain?: string;
  similarity?: number;
  snippet?: string;
  company?: string;
  period?: string;
  filename?: string;
}

export function SourcesCard({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="sources-card">
      <CollapsibleTrigger asChild>
        <div className="sources-card__header">
          <FileTextIcon size={10} />
          SOURCES
          <Badge variant="secondary" className="sources-card__count">
            {sources.length}
          </Badge>
          {open ? <ChevronDownIcon size={10} className="ml-auto" /> : <ChevronRightIcon size={10} className="ml-auto" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="sources-card__list">
          {sources.map((s, i) => (
            <div key={i} className="source-item">
              <div className="source-item__meta">
                {s.domain && (
                  <span className="source-item__domain">{s.domain}</span>
                )}
                {s.company && <span>{s.company}</span>}
                {s.period && <span>{s.period}</span>}
                {s.filename && <span>{s.filename}</span>}
                {s.similarity !== undefined && (
                  <span className="ml-auto">
                    {(s.similarity * 100).toFixed(0)}% match
                  </span>
                )}
              </div>
              {s.snippet && (
                <p className="source-item__snippet">{s.snippet}</p>
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
