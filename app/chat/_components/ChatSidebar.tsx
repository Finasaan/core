"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusIcon, XIcon, MessageSquareIcon } from "lucide-react";

interface Session {
  id: string;
  title: string;
  model: string | null;
  updated_at: string;
  message_count: number;
}

interface ChatSidebarProps {
  collapsed: boolean;
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  loadingSessions: boolean;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

function groupSessions(sessions: Session[]) {
  const now = Date.now();
  const today: Session[] = [];
  const week: Session[] = [];
  const older: Session[] = [];

  for (const s of sessions) {
    const hours = (now - new Date(s.updated_at).getTime()) / 3_600_000;
    if (hours < 24) today.push(s);
    else if (hours < 168) week.push(s);
    else older.push(s);
  }

  return [
    ...(today.length ? [{ label: "Today", items: today }] : []),
    ...(week.length ? [{ label: "This week", items: week }] : []),
    ...(older.length ? [{ label: "Older", items: older }] : []),
  ];
}

export function ChatSidebar({
  collapsed,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  loadingSessions,
}: ChatSidebarProps) {
  const groups = groupSessions(sessions);

  return (
    <aside className={`chat-sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Header */}
      <div className="chat-sidebar__header">
        <span className="chat-sidebar__logo">FinasaanGPT</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-sidebar__new-btn"
              onClick={onNewChat}
            >
              <PlusIcon size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">New chat</TooltipContent>
        </Tooltip>
      </div>

      {/* Sessions */}
      <ScrollArea className="flex-1" style={{ minHeight: 0 }}>
        {loadingSessions ? (
          <div className="chat-sidebar__empty">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="chat-sidebar__empty">No chats yet</div>
        ) : (
          groups.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <Separator className="my-1 bg-[var(--chat-border)]" />}
              <div className="chat-sidebar__section-label">{group.label}</div>
              {group.items.map((s) => (
                <div
                  key={s.id}
                  className={`chat-session-item${s.id === activeSessionId ? " active" : ""}`}
                  onClick={() => onSelectSession(s.id)}
                >
                  <MessageSquareIcon size={11} className="flex-shrink-0 text-[var(--chat-text-dim)]" />
                  <span className="chat-session-item__title" title={s.title}>
                    {s.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="chat-session-item__delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                  >
                    <XIcon size={11} />
                  </Button>
                </div>
              ))}
            </div>
          ))
        )}
      </ScrollArea>
    </aside>
  );
}
