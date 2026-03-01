"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileIcon, XIcon, Loader2Icon } from "lucide-react";

interface AttachmentChipProps {
  filename: string;
  uploading?: boolean;
  onRemove?: () => void;
}

export function AttachmentChip({ filename, uploading, onRemove }: AttachmentChipProps) {
  return (
    <Badge
      variant="outline"
      className={`attachment-chip${uploading ? " attachment-chip--uploading" : ""}`}
    >
      {uploading ? (
        <Loader2Icon size={11} className="animate-spin text-[var(--chat-amber)]" />
      ) : (
        <FileIcon size={11} className="text-[var(--chat-amber)]" />
      )}
      <span className="truncate max-w-[140px]">
        {uploading ? "Uploading..." : filename}
      </span>
      {onRemove && !uploading && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 ml-1 text-[var(--chat-text-dim)] hover:text-[var(--chat-red)]"
          onClick={onRemove}
        >
          <XIcon size={10} />
        </Button>
      )}
    </Badge>
  );
}
