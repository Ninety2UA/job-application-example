"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (open: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = { role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages.slice(-10),
          }),
        });
        const data = await res.json();
        const reply = data.text || data.error || "Sorry, I couldn't generate a response.";
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "I'm having trouble connecting right now. Try again in a moment." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return (
    <ChatContext.Provider value={{ messages, isOpen, isLoading, setIsOpen, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}
