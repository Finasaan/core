"use client";

import { useRef, useCallback, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AttachmentChip } from "./AttachmentChip";
import { ModelPicker, Model } from "./ModelPicker";
import {
  SendHorizontalIcon,
  SquareIcon,
  PaperclipIcon,
  DatabaseZapIcon,
} from "lucide-react";

interface PendingAttachment {
  filename: string;
  uploading: boolean;
}

interface ChatInputProps {
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  onAttach: (file: File) => void;
  onRemoveAttachment: (filename: string) => void;
  onOpenIngest: () => void;
  attachments: PendingAttachment[];
  isStreaming: boolean;
  models: Model[];
  selectedModel: string;
  onModelSelect: (id: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  input,
  onInputChange,
  onSend,
  onStop,
  onAttach,
  onRemoveAttachment,
  onOpenIngest,
  attachments,
  isStreaming,
  models,
  selectedModel,
  onModelSelect,
  disabled,
}: ChatInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isStreaming && input.trim()) onSend();
      }
    },
    [isStreaming, input, onSend]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onAttach(file);
      e.target.value = "";
    },
    [onAttach]
  );

  return (
    <div className="chat-input-bar">
      <div className="chat-input-bar__inner">
        {/* Pending attachments */}
        {attachments.length > 0 && (
          <div className="chat-input-bar__attachments">
            {attachments.map((a) => (
              <AttachmentChip
                key={a.filename}
                filename={a.filename}
                uploading={a.uploading}
                onRemove={
                  !a.uploading
                    ? () => onRemoveAttachment(a.filename)
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Text row */}
        <div className="chat-input-bar__row">
          <Textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about PSX stocks, mutual funds, insurance..."
            className="chat-input-bar__textarea"
            rows={1}
            disabled={disabled}
          />
          <div className="chat-input-bar__actions">
            {/* Attach PDF (conversation context) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="chat-input-bar__btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={isStreaming || disabled}
                >
                  <PaperclipIcon size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach PDF to conversation</TooltipContent>
            </Tooltip>

            {/* Ingest Document (knowledge base) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="chat-input-bar__btn chat-input-bar__btn--ingest"
                  onClick={onOpenIngest}
                  disabled={isStreaming || disabled}
                >
                  <DatabaseZapIcon size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ingest document into knowledge base</TooltipContent>
            </Tooltip>

            {/* Send / Stop */}
            {isStreaming ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="chat-input-bar__btn chat-input-bar__btn--stop"
                    onClick={onStop}
                  >
                    <SquareIcon size={13} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop generating</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="chat-input-bar__btn chat-input-bar__btn--send"
                    onClick={onSend}
                    disabled={!input.trim() || disabled}
                  >
                    <SendHorizontalIcon size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send (Enter)</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="chat-input-bar__meta">
          <ModelPicker
            models={models}
            selectedId={selectedModel}
            onSelect={onModelSelect}
          />
          <span className="chat-input-bar__hint">
            Shift+Enter for new line
          </span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
