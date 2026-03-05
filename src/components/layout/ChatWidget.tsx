"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "./ChatProvider";
import { usePathname } from "next/navigation";

const suggestedQuestions: Record<string, string[]> = {
  "/": [
    "What's this application about?",
    "Why is Dominik applying to KLAR?",
    "What roles is he targeting?",
  ],
  "/analysis": [
    "What's KLAR's business model?",
    "How does KLAR compare to Triple Whale?",
    "What growth opportunities did Dominik find?",
  ],
  "/recommendations": [
    "Which recommendation is strongest?",
    "Tell me about the PO Marketing Measurement MVPs",
    "How does the unified measurement framework work?",
  ],
  "/about": [
    "What did Dominik do at Google?",
    "What's his attribution expertise?",
    "Why is he a fit for KLAR?",
  ],
};

function getSuggestions(pathname: string): string[] {
  if (pathname.startsWith("/recommendations/")) {
    return [
      "How would this work in practice?",
      "What skills does Dominik bring here?",
      "How does this help KLAR grow?",
    ];
  }
  return suggestedQuestions[pathname] || suggestedQuestions["/"];
}

export default function ChatWidget() {
  const { messages, isOpen, isLoading, setIsOpen, sendMessage } = useChatContext();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    await sendMessage(text);
  };

  const handleSuggestion = async (q: string) => {
    if (isLoading) return;
    await sendMessage(q);
  };

  const isHomePage = pathname === "/";

  return (
    <>
      {/* FAB — hidden on home page where chat is embedded */}
      <AnimatePresence>
        {!isOpen && !isHomePage && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-accent/20 transition-transform hover:scale-105"
            aria-label="Open chat"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-0 z-50 flex flex-col border-l border-card-border bg-background sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[500px] sm:w-[380px] sm:rounded-2xl sm:border"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Ask me anything</p>
                <p className="text-xs text-muted">About Dominik, KLAR, or this application</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-foreground transition-colors"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted">
                    Hi! I can answer questions about Dominik&apos;s background, the KLAR analysis, and these
                    recommendations. Try one of these:
                  </p>
                  <div className="space-y-2">
                    {getSuggestions(pathname).map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSuggestion(q)}
                        className="block w-full rounded-xl border border-card-border px-3 py-2 text-left text-sm text-muted transition-colors hover:border-accent/30 hover:text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-accent text-background"
                        : "bg-card border border-card-border text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-card border border-card-border px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-card-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-xl border border-card-border bg-background px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
