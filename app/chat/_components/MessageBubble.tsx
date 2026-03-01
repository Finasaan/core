"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UIMessage } from "ai";
import { ToolCallBlock } from "./ToolCallBlock";
import { SourcesCard } from "./SourcesCard";
import { AttachmentChip } from "./AttachmentChip";

interface MessageBubbleProps {
  message: UIMessage;
}

type AnyPart = {
  type: string;
  text?: string;
  state?: string;
  reasoning?: string;
  mediaType?: string;
  toolName?: string;
  output?: unknown;
  [key: string]: unknown;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`chat-msg chat-msg--${isUser ? "user" : "assistant"}`}>
      <span className="chat-msg__role">
        {isUser ? "YOU" : "FINASAANGPT"}
      </span>

      <div className="chat-msg__bubble">
        {(message.parts as AnyPart[]).map((part, i) => {
          /* ── Text ── */
          if (part.type === "text") {
            if (isUser) {
              return (
                <span key={i} style={{ whiteSpace: "pre-wrap" }}>
                  {part.text ?? ""}
                </span>
              );
            }
            return (
              <div key={i}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {part.text ?? ""}
                </ReactMarkdown>
                {part.state === "streaming" && (
                  <span className="streaming-cursor" />
                )}
              </div>
            );
          }

          /* ── File (user upload preview) ── */
          if (part.type === "file") {
            return (
              <div key={i} className="chat-msg__attachments">
                <AttachmentChip filename={part.mediaType ?? "file"} />
              </div>
            );
          }

          /* ── Tool call (dynamic-tool part) ── */
          if (part.type === "dynamic-tool") {
            return (
              <ToolCallBlock
                key={i}
                toolName={part.toolName ?? ""}
                state={(part.state ?? "input-streaming") as ToolCallBlockState}
                result={part.output}
              />
            );
          }

          /* ── Typed tool (tool-<name>) ── */
          if (part.type.startsWith("tool-")) {
            const toolName = part.type.replace(/^tool-/, "");
            return (
              <ToolCallBlock
                key={i}
                toolName={toolName}
                state={(part.state ?? "input-streaming") as ToolCallBlockState}
                result={part.output}
              />
            );
          }

          /* ── Reasoning ── */
          if (part.type === "reasoning") {
            return (
              <details
                key={i}
                className="tool-call tool-call--done"
                style={{ cursor: "pointer" }}
              >
                <summary className="tool-call__text">Reasoning</summary>
                <div
                  style={{
                    paddingTop: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--chat-text-dim)",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                {String(part.reasoning ?? "")}
                </div>
              </details>
            );
          }

          /* ── Step separator ── */
          if (part.type === "step-start") return null;

          return null;
        })}

        {/* Sources from metadata (persisted messages reloaded from DB) */}
        {(() => {
          if (isUser) return null;
          const meta = message.metadata as Record<string, unknown> | undefined;
          if (!meta || !Array.isArray(meta.sources)) return null;
          const sources = meta.sources as Parameters<typeof SourcesCard>[0]["sources"];
          return <SourcesCard sources={sources} />;
        })()}
      </div>
    </div>
  );
}

type ToolCallBlockState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-streaming";
