"use client";

import { useEffect, useState } from "react";
import { FinasaanGPTApp } from "@/app/chat/_components/FinasaanGPTApp";
import "@/app/chat/chat.css";
import "./mini-gpt.css";

interface MiniGPTSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniGPTSidebar({ isOpen, onClose }: MiniGPTSidebarProps) {
  const [pageContext, setPageContext] = useState<{ url: string; content?: string } | undefined>();

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const url = window.location.href;
      // Get text snippet from main content to avoid sidebar/nav
      const mainEl = document.querySelector('main');
      const sourceEl = mainEl || document.body;
      
      let content = "";
      if (sourceEl) {
        // Extract visible text and limit to 2500 chars for context
        content = sourceEl.innerText.substring(0, 2500);
      }
      
      setPageContext({ url, content });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mini-gpt-overlay" onClick={onClose}>
      <div className="mini-gpt-panel" onClick={e => e.stopPropagation()}>
        <FinasaanGPTApp isMini={true} pageContext={pageContext} onClose={onClose} />
      </div>
    </div>
  );
}
