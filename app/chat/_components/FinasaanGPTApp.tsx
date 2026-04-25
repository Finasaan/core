"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatSidebar } from "./ChatSidebar";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import type { Model } from "./ModelPicker";
import { PanelLeftIcon, X } from "lucide-react";

// ── Config ──────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

type Session = {
  id: string;
  title: string;
  model: string | null;
  updated_at: string;
  message_count: number;
};

type PendingAttachment = {
  filename: string;
  uploading: boolean;
};

// ── Component ────────────────────────────────────────────────────────────────

interface FinasaanGPTAppProps {
  isMini?: boolean;
  pageContext?: { url: string; content?: string };
  onClose?: () => void;
}

export function FinasaanGPTApp({ isMini = false, pageContext, onClose }: FinasaanGPTAppProps) {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(!isMini);
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [models, setModels] = useState<Model[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [lastUserText, setLastUserText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Refs for latest model + session (read at send-time) ───────────────────

  const selectedModelRef = useRef(selectedModel);
  selectedModelRef.current = selectedModel;
  const activeSessionRef = useRef(activeSessionId);
  activeSessionRef.current = activeSessionId;
  const pageContextRef = useRef(pageContext);
  pageContextRef.current = pageContext;

  // Stable ref to a callback that updates activeSessionId from the response
  // header. Using a ref keeps the transport memo dependency-free while always
  // calling the latest setter.
  const onSessionIdReceived = useRef<(id: string) => void>(() => {});
  onSessionIdReceived.current = (id: string) => {
    if (activeSessionRef.current !== id) {
      setActiveSessionId(id);
      activeSessionRef.current = id;
    }
  };

  // Transport created ONCE — body is a function so it always reads latest refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${API_BASE}/api/chatbot/stream`,
        credentials: "include",
        // Intercept the response to capture the session ID the server assigned
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          const sessionId = response.headers.get("X-Session-Id");
          if (sessionId) onSessionIdReceived.current(sessionId);
          return response;
        },
        body: () => ({
          modelId: selectedModelRef.current,
          sessionId: activeSessionRef.current,
          pageContext: pageContextRef.current,
        }),
      }),
    [], // intentionally stable — body/fetch functions read from refs
  );

  // ── useChat (AI SDK v6) ─────────────────────────────────────────────────

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    onFinish: () => {
      setStreamError(null);
      // Re-fetch sessions to update the sidebar after each turn.
      fetchSessions();
    },
    onError: (error) => {
      setStreamError(error?.message ?? "Stream failed. Please try again.");
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // ── Auto-scroll ─────────────────────────────────────────────────────────

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ── Catch in-stream failures (status → 'error', onError never fires) ────

  useEffect(() => {
    if (status === "error") {
      setStreamError((prev) => prev ?? "Stream failed. Please try again.");
    }
  }, [status]);

  // ── Fetch models ────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${API_BASE}/api/chatbot/models`, { credentials: "include" })
      .then((r) => r.json())
      .then((d: unknown) => {
        const data = d as { models: Model[]; default: string };
        setModels(data.models);
        setSelectedModel(data.default ?? data.models[0]?.id ?? "");
      })
      .catch(console.error);
  }, []);

  // ── Fetch sessions ──────────────────────────────────────────────────────

  const fetchSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const r = await fetch(`${API_BASE}/api/chatbot/sessions`, {
        credentials: "include",
      });
      if (!r.ok) return;
      const d = (await r.json()) as { sessions: Session[] };
      setSessions(d.sessions);
    } catch {
      // silently ignore
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // ── Load session messages ────────────────────────────────────────────────

  const handleSelectSession = useCallback(
    async (id: string) => {
      setActiveSessionId(id);
      try {
        const r = await fetch(`${API_BASE}/api/chatbot/sessions/${id}`, {
          credentials: "include",
        });
        if (!r.ok) return;
        const d = (await r.json()) as {
          messages: Array<{
            role: string;
            content: string;
            metadata?: Record<string, unknown>;
          }>;
        };
        // Convert DB messages to UIMessage format for setMessages
        setMessages(
          d.messages.map((m, i) => ({
            id: String(i),
            role: m.role as "user" | "assistant",
            parts: [{ type: "text" as const, text: m.content }],
            metadata: m.metadata ?? {},
          })),
        );
      } catch {
        // ignore
      }
    },
    [setMessages],
  );

  // ── New chat ─────────────────────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setInputValue("");
    setAttachments([]);
  }, [setMessages]);

  // ── Delete session ───────────────────────────────────────────────────────

  const handleDeleteSession = useCallback(
    async (id: string) => {
      await fetch(`${API_BASE}/api/chatbot/sessions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) handleNewChat();
    },
    [activeSessionId, handleNewChat],
  );

  // ── Send message ─────────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isStreaming) return;
    const text = inputValue.trim();
    setInputValue("");
    setStreamError(null);
    setLastUserText(text);
    sendMessage({ text });
  }, [inputValue, isStreaming, sendMessage]);

  // ── Retry last message ───────────────────────────────────────────────────

  const handleRetry = useCallback(() => {
    if (!lastUserText || isStreaming) return;
    setStreamError(null);
    sendMessage({ text: lastUserText });
  }, [lastUserText, isStreaming, sendMessage]);

  // ── Attach PDF ───────────────────────────────────────────────────────────

  const handleAttach = useCallback(
    async (file: File) => {
      if (!activeSessionId) {
        // Need a session first — create one by sending a dummy context message
        // For now just alert
        alert(
          "Please send a message first to start a session, then attach a file.",
        );
        return;
      }

      setAttachments((prev) => [
        ...prev,
        { filename: file.name, uploading: true },
      ]);

      const form = new FormData();
      form.append("file", file);
      form.append("sessionId", activeSessionId);

      try {
        const res = await fetch(`${API_BASE}/api/chatbot/upload-attachment`, {
          method: "POST",
          credentials: "include",
          body: form,
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(err.message ?? `Upload failed (${res.status})`);
        }
        // Remove the chip and notify the AI about the upload in the chat
        setAttachments((prev) => prev.filter((a) => a.filename !== file.name));
        sendMessage({
          text: `I just uploaded a document: "${file.name}". Please acknowledge it and let me know you can answer questions about it using the searchConversationDocument tool.`,
        });
      } catch (err) {
        setAttachments((prev) => prev.filter((a) => a.filename !== file.name));
        setStreamError(
          err instanceof Error
            ? err.message
            : "Upload failed. Please try again.",
        );
      }
    },
    [activeSessionId, sendMessage],
  );

  const handleRemoveAttachment = useCallback((filename: string) => {
    setAttachments((prev) => prev.filter((a) => a.filename !== filename));
  }, []);

  // ── Welcome prompt shortcut ──────────────────────────────────────────────

  const handlePrompt = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  // ── Active session title ─────────────────────────────────────────────────

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <TooltipProvider delayDuration={400}>
      <div className={`chat-shell ${isMini ? 'mini' : ''}`}>
        {/* Sidebar */}
        <ChatSidebar
          collapsed={!sidebarOpen}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          loadingSessions={loadingSessions}
        />

        {/* Main area */}
        <main className="chat-main">
          {/* Topbar */}
          <div className="chat-topbar">
            <Button
              variant="ghost"
              size="icon"
              className="chat-topbar__toggle"
              onClick={() => setSidebarOpen((o) => !o)}
              title="Toggle sidebar"
            >
              <PanelLeftIcon size={15} />
            </Button>
            {activeSession && (
              <span className="chat-topbar__session-title">
                {activeSession.title}
              </span>
            )}
            {isMini && onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="chat-topbar__toggle ml-auto border border-white/5"
                onClick={onClose}
                title="Close sidebar"
              >
                <X size={15} />
              </Button>
            )}
          </div>

          {/* Messages */}
          <div className="chat-messages" ref={scrollRef}>
            {messages.length === 0 ? (
              <WelcomeScreen onPrompt={handlePrompt} />
            ) : (
              <div className="chat-messages__inner">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Persistent streaming indicator — shows whenever the
                    stream is active and the last message isn't already
                    showing a streaming text cursor */}
                {isStreaming &&
                  (() => {
                    const lastMsg = messages[messages.length - 1];
                    const lastParts = (lastMsg?.parts ?? []) as Array<{
                      type: string;
                      state?: string;
                    }>;
                    const hasStreamingText = lastParts.some(
                      (p) => p.type === "text" && p.state === "streaming",
                    );
                    if (hasStreamingText) return null;
                    return (
                      <div className="chat-streaming-indicator">
                        <span className="chat-streaming-indicator__dot" />
                        <span className="chat-streaming-indicator__dot" />
                        <span className="chat-streaming-indicator__dot" />
                      </div>
                    );
                  })()}
              </div>
            )}
          </div>

          {/* Error banner */}
          {streamError && (
            <div className="chat-error-banner">
              <div className="chat-error-banner__inner">
                <span className="chat-error-banner__icon">!</span>
                <div className="chat-error-banner__body">
                  <div className="chat-error-banner__title">Stream error</div>
                  <div className="chat-error-banner__msg">{streamError}</div>
                </div>
                {lastUserText && (
                  <button
                    className="chat-error-banner__retry"
                    onClick={handleRetry}
                    disabled={isStreaming}
                  >
                    ↺ Retry
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Input */}
          <ChatInput
            input={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            onStop={stop}
            onAttach={handleAttach}
            onRemoveAttachment={handleRemoveAttachment}
            attachments={attachments}
            isStreaming={isStreaming}
            models={models}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
          />

          {/* Disclaimer */}
          <div className="chat-disclaimer">
            FinasaanGPT can make mistakes. Verify important financial data
            independently. Not investment advice.
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
