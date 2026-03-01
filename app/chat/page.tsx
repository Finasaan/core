"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Bot,
  User,
  Loader2,
  ChevronDown,
  MessageSquare,
  Upload,
  X,
  FileText,
  CheckCircle,
  Trash2,
} from "lucide-react";

// ============================================
// Types
// ============================================

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    company?: string;
    period?: string;
    similarity: number;
    snippet: string;
  }>;
  model?: string;
}

interface ChatSession {
  id: string;
  title: string;
  message_count: number;
  updated_at: string;
}

// ============================================
// Model Configuration
// ============================================

const MODELS = [
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile" },
  { id: "openai/gpt-oss-120b", name: "GPT OSS 120B" },
  { id: "openai/gpt-oss-20b", name: "GPT OSS 20B" },
] as const;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api";

// ============================================
// Components
// ============================================

function ModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-accent transition-colors"
      >
        <Bot className="h-4 w-4 text-muted-foreground" />
        <span>
          {MODELS.find((m) => m.id === value)?.name || "Select Model"}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-border bg-card shadow-lg">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg ${value === model.id ? "bg-accent font-medium" : ""
                  }`}
              >
                {model.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function UploadModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (
    file: File,
    metadata: { company: string; period: string }
  ) => Promise<{ chunks_created: number; documents_stored: number }>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    chunks_created: number;
    documents_stored: number;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a PDF file");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const result = await onUpload(file, { company, period });
      setStats(result);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setFile(null);
        setCompany("");
        setPeriod("");
        setSuccess(false);
        setStats(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  function resetModal() {
    setFile(null);
    setError(null);
    setSuccess(false);
    setStats(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={resetModal} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload PDF Document
          </h2>
          <button
            onClick={resetModal}
            className="rounded-lg p-1 hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragOver
              ? "border-primary bg-primary/5"
              : file
                ? "border-green-500 bg-green-500/5"
                : "border-border hover:border-muted-foreground"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="ml-2 p-1 rounded hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum file size: 10MB
                </p>
              </>
            )}
          </div>

          {/* Metadata Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., PTCL"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Period</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g., Q3 2024"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Success Message with Stats */}
          {success && stats && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Successfully processed: {stats.chunks_created} chunks created,{" "}
                  {stats.documents_stored} stored
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetModal}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {success ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Done!
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload & Process
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
          }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground"
          }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="chat-markdown text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                h1: ({ children }) => <h1 className="text-base font-bold mb-1 mt-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold mb-1 mt-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-1">{children}</h3>,
                code: ({ className, children, ...props }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <code className="block bg-black/10 rounded px-2 py-1.5 text-xs font-mono whitespace-pre-wrap my-1" {...props}>{children}</code>
                  ) : (
                    <code className="bg-black/10 rounded px-1 py-0.5 text-xs font-mono" {...props}>{children}</code>
                  );
                },
                pre: ({ children }) => <pre className="bg-black/10 rounded p-2 my-1 overflow-x-auto">{children}</pre>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-current opacity-70 pl-2 my-1 italic">{children}</blockquote>,
                table: ({ children }) => <div className="overflow-x-auto my-2"><table className="text-xs border-collapse w-full">{children}</table></div>,
                th: ({ children }) => <th className="border border-current/20 px-2 py-1 font-semibold bg-black/5">{children}</th>,
                td: ({ children }) => <td className="border border-current/20 px-2 py-1">{children}</td>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">{children}</a>,
                hr: () => <hr className="border-current/20 my-2" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 border-t border-border/50 pt-2">
            <div className="text-xs font-medium opacity-70 mb-1">Sources:</div>
            <div className="space-y-1">
              {message.sources.slice(0, 3).map((source, i) => (
                <div
                  key={i}
                  className="text-xs opacity-60 truncate"
                  title={source.snippet}
                >
                  {source.company || "Unknown"} • {source.period || "N/A"} •{" "}
                  {Math.round(source.similarity * 100)}% match
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <Bot className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Thinking...</span>
      </div>
    </div>
  );
}

function ChatSidebar({
  sessions,
  currentId,
  onSelect,
  onNew,
  onUpload,
  onDelete,
}: {
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onUpload: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border space-y-4">
        <Link href="/dashboard" className="flex justify-center">
          <Image
            src="/logodark.svg"
            alt="Finasaan"
            width={100}
            height={28}
            priority
          />
        </Link>
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <MessageSquare className="h-4 w-4" />
          New Chat
        </button>
        <button
          onClick={onUpload}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card text-foreground px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          <FileText className="h-4 w-4" />
          Upload Document
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative flex items-center rounded-lg text-sm transition-colors ${currentId === session.id
                  ? "bg-accent font-medium"
                  : "hover:bg-accent/50"
                  }`}
              >
                <button
                  onClick={() => onSelect(session.id)}
                  className="flex-1 text-left px-3 py-2.5 min-w-0"
                >
                  <div className="truncate pr-6">{session.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {session.message_count} messages
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Main Page
// ============================================

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>("llama-3.1-8b-instant");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const res = await fetch(`${API_BASE}/chatbot/chats`);
      if (res.ok) {
        const data = (await res.json()) as { chats?: ChatSession[] };
        setSessions(data.chats || []);
      }
    } catch {
      // Silently fail - sessions are optional
    }
  }

  async function loadChat(chatId: string) {
    try {
      const res = await fetch(`${API_BASE}/chatbot/chats/${chatId}`);
      if (res.ok) {
        const data = (await res.json()) as { messages?: ChatMessage[] };
        setMessages(
          (data.messages || []).map((m: ChatMessage, i: number) => ({
            ...m,
            id: m.id?.toString() || `msg-${i}`,
          }))
        );
        setCurrentChatId(chatId);
      }
    } catch {
      setError("Failed to load chat");
    }
  }

  function startNewChat() {
    setMessages([]);
    setCurrentChatId(null);
    setError(null);
  }

  async function deleteChat(chatId: string) {
    try {
      const res = await fetch(`${API_BASE}/chatbot/chats/${chatId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete chat: ${res.status}`);
      }
      // If we deleted the active chat, clear it
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
      // Refresh session list
      setSessions((prev) => prev.filter((s) => s.id !== chatId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chat");
    }
  }

  async function handleUpload(
    file: File,
    metadata: { company: string; period: string }
  ): Promise<{ chunks_created: number; documents_stored: number }> {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata.company) {
      formData.append("company", metadata.company);
    }
    if (metadata.period) {
      formData.append("period", metadata.period);
    }

    const res = await fetch(`${API_BASE}/chatbot/documents/upload`, {
      method: "POST",
      body: formData,
    });

    const data = (await res.json()) as {
      success: boolean;
      message?: string;
      statistics?: {
        chunks_created: number;
        documents_stored: number;
      };
      error?: string;
    };

    if (!res.ok || !data.success) {
      throw new Error(data.message || data.error || "Upload failed");
    }

    return {
      chunks_created: data.statistics?.chunks_created || 0,
      documents_stored: data.statistics?.documents_stored || 0,
    };
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          chat_id: currentChatId,
          model,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = (await res.json()) as {
        error?: boolean;
        message?: string;
        chat_id?: string;
        answer: string;
        sources?: ChatMessage["sources"];
        metadata?: { model?: string };
      };

      if (data.error) {
        throw new Error(data.message || "Unknown error");
      }

      // Update chat ID if new
      if (!currentChatId && data.chat_id) {
        setCurrentChatId(data.chat_id);
        loadSessions();
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        model: data.metadata?.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Upload Modal */}
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />

      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentId={currentChatId}
        onSelect={loadChat}
        onNew={startNewChat}
        onUpload={() => setShowUpload(true)}
        onDelete={deleteChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Ask questions about financial documents
            </p>
          </div>
          <ModelSelector value={model} onChange={setModel} />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Welcome to the AI Assistant
                </h2>
                <p className="text-muted-foreground mb-4">
                  Ask me anything about your financial documents. I can help you
                  find specific data, compare periods, and explain trends.
                </p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload a document to get started
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-6">
            <div className="max-w-3xl mx-auto mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border bg-card/50 px-6 py-4">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
