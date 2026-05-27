"use client";

import { useCallback, useRef, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What's the DC metro rental market outlook for 2026?",
  "How does rent control work in Montgomery County?",
  "HELOC vs home equity loan for a rental down payment?",
  "How should I analyze my first investment property?",
];

export default function VenuraAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm VenuraAI, your real estate investment assistant. Ask me about the DC metro market, rent control, financing strategies, or how to analyze deals.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);
      setError(null);

      try {
        const res = await fetch("/api/venura-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim() }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to get a response");
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.reply,
          },
        ]);
      } catch (err) {
        const errMessage =
          err instanceof Error ? err.message : "Something went wrong";
        setError(errMessage);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `Sorry, I couldn't respond right now. ${errMessage}`,
          },
        ]);
      } finally {
        setIsTyping(false);
        setTimeout(scrollToBottom, 50);
      }
    },
    [isTyping, scrollToBottom],
  );

  return (
    <>
      <PageHeader
        eyebrow="AI Assistant"
        title="VenuraAI"
        description="Get expert real estate investment advice powered by Claude."
      />

      <div className="flex h-[calc(100vh-220px)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1B4332] shadow-xl">
        <div className="border-b border-white/10 bg-[#1B4332] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#74C69D]/20">
              <span className="text-sm font-bold text-[#74C69D]">V</span>
            </div>
            <div>
              <p className="font-semibold text-white">VenuraAI</p>
              <p className="text-xs text-[#74C69D]">Investment advisor</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#74C69D] text-[#1B4332]"
                      : "bg-white/5 text-white/90"
                  }`}
                >
                  {msg.content.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>
                      {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#74C69D] [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#74C69D] [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#74C69D] [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-3">
          {error && (
            <p className="mb-2 text-xs text-red-300">{error}</p>
          )}
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                disabled={isTyping}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:border-[#74C69D]/40 hover:text-[#74C69D] disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about markets, financing, or deal analysis..."
              disabled={isTyping}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#74C69D] focus:ring-2 focus:ring-[#74C69D]/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-[#74C69D] px-5 py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2] disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
