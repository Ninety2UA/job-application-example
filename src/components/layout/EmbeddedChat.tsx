"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useChatContext } from "./ChatProvider";

const suggestedQuestions = [
  "What's this application about?",
  "Why is Dominik applying to KLAR?",
  "What roles is he targeting?",
  "What did Dominik build at Google?",
];

export default function EmbeddedChat() {
  const { messages, isLoading, sendMessage } = useChatContext();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  return (
    <div className="flex flex-col rounded-2xl border border-card-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-card-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-semibold">Ask me anything</p>
        </div>
        <p className="mt-1 text-xs text-muted">
          About Dominik, KLAR, or this application — powered by AI
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-[260px] max-h-[400px]">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Hi! I can answer questions about Dominik&apos;s background, the
              KLAR analysis, and these prototypes. Try one:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  className="cursor-pointer rounded-full border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/30 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-accent text-background"
                  : "bg-background border border-card-border text-foreground"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl bg-background border border-card-border px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-card-border p-4">
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
            className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
