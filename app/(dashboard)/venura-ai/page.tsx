"use client";

import { useCallback, useRef, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const PRELOADED_RESPONSES: Record<string, string> = {
  "dc metro market":
    "The DC metro rental market remains resilient with strong job growth from federal employment, defense contractors, and tech. Prince George's County offers lower entry prices with solid rental demand — areas like Landover and Hyattsville are popular with investors seeking cash flow. Montgomery County (Silver Spring, Bethesda) commands higher rents but tighter margins. Average cap rates in PG County run 5–7% vs. 4–5% in Montgomery. Watch for HOA-heavy condos which can compress cash flow significantly.",
  "rent control":
    "Maryland does not have statewide rent control, but Montgomery County has a rent stabilization program affecting certain multi-family buildings built before specific dates. DC has its own rent control laws under the Rental Housing Act covering most units built before 1975 (with exemptions). Prince George's County currently has no rent control ordinance. Always verify the jurisdiction and building age before underwriting — rent control can cap your upside and affect exit strategy.",
  "heloc vs home equity loan":
    "A HELOC (Home Equity Line of Credit) works like a revolving credit line — you draw as needed and pay interest only on what you use. Rates are typically variable. Best for: flexible access to capital for multiple deals or renovations over time.\n\nA Home Equity Loan gives you a lump sum with fixed payments and a fixed rate. Best for: a single large purchase like a down payment on an investment property.\n\nFor real estate investing, many investors prefer HELOCs for the flexibility to deploy capital across deals, but fixed-rate home equity loans provide payment certainty. Compare current rates — in rising rate environments, fixed loans may offer better predictability.",
  "deal analysis":
    "When analyzing a deal, focus on four pillars:\n\n1. **Cash Flow** — Monthly rent minus PITI, HOA, insurance, and reserves. Target positive cash flow from day one.\n\n2. **Cap Rate** — NOI ÷ purchase price. Compare against market averages (5%+ in PG County is solid).\n\n3. **Cash-on-Cash Return** — Annual cash flow ÷ cash invested. Aim for 8%+ on leveraged deals.\n\n4. **50% Rule** — Operating expenses should stay under 50% of gross rent as a quick sanity check.\n\nUse Venura's Analyzer to model scenarios, then stress-test with vacancy (5–8%) and maintenance reserves ($50–100/unit/mo). Never skip the HOA fee review — it can make or break condo deals.",
};

const SUGGESTED_QUESTIONS = [
  { label: "DC metro market outlook", key: "dc metro market" },
  { label: "Rent control in Maryland", key: "rent control" },
  { label: "HELOC vs home equity loan", key: "heloc vs home equity loan" },
  { label: "How to analyze a deal", key: "deal analysis" },
];

function findResponse(input: string): string {
  const lower = input.toLowerCase();

  for (const [key, response] of Object.entries(PRELOADED_RESPONSES)) {
    if (lower.includes(key) || key.split(" ").some((word) => lower.includes(word))) {
      return response;
    }
  }

  if (lower.includes("heloc") || lower.includes("home equity")) {
    return PRELOADED_RESPONSES["heloc vs home equity loan"];
  }
  if (lower.includes("rent")) {
    return PRELOADED_RESPONSES["rent control"];
  }
  if (lower.includes("analyze") || lower.includes("analysis") || lower.includes("deal")) {
    return PRELOADED_RESPONSES["deal analysis"];
  }
  if (lower.includes("dc") || lower.includes("metro") || lower.includes("maryland")) {
    return PRELOADED_RESPONSES["dc metro market"];
  }

  return "I can help with DC metro market insights, rent control regulations, HELOC vs home equity loans, and deal analysis strategies. Try one of the suggested questions below, or ask about any of these topics!";
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        const response = findResponse(text);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response,
          },
        ]);
        setIsTyping(false);
        setTimeout(scrollToBottom, 50);
      }, 1200);
    },
    [isTyping, scrollToBottom],
  );

  return (
    <>
      <PageHeader
        eyebrow="AI Assistant"
        title="VenuraAI"
        description="Get instant answers to common real estate investment questions."
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
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q.key}
                type="button"
                onClick={() => sendMessage(q.label)}
                disabled={isTyping}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:border-[#74C69D]/40 hover:text-[#74C69D] disabled:opacity-50"
              >
                {q.label}
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
