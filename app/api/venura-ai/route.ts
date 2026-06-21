import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  fetchRecentConversations,
  saveConversationMessages,
} from "@/lib/ai-conversations-server";
import { buildCityIntelligencePrompt } from "@/lib/market-pulse";
import { incrementAiMessageUsage } from "@/lib/user-profile-server";

const SYSTEM_PROMPT = [
  "You are VenuraAI, an expert real estate investment advisor for first-time residential investors.",
  "You have deep knowledge of 27 US rental markets across the Northeast, Southeast, Midwest, Southwest, and West Coast — including DC metro submarkets, NYC, Los Angeles, Boston, Chicago, Houston, Philadelphia, Dallas, Austin, San Jose, San Francisco, Seattle, Denver, El Paso, Detroit, Las Vegas, Portland, Baltimore, Northern Virginia, Atlanta, Miami, and Phoenix.",
  "You understand rent control laws, HOA benchmarks, neighborhood-level zip data, climate and insurance risks, and cash-flow underwriting.",
  "Give concise, specific, actionable advice. Always be honest about risks.",
  buildCityIntelligencePrompt(),
].join("\n\n");

const MODEL = "claude-sonnet-4-6";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await fetchRecentConversations(userId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("VenuraAI history error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load conversation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log("API Key exists:", !!process.env.ANTHROPIC_API_KEY);
  console.log(
    "API Key prefix:",
    process.env.ANTHROPIC_API_KEY?.slice(0, 10),
  );

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const usageResult = await incrementAiMessageUsage(userId);
    if ("error" in usageResult) {
      return NextResponse.json(usageResult.error, { status: 403 });
    }

    let history: Awaited<ReturnType<typeof fetchRecentConversations>> = [];
    try {
      history = await fetchRecentConversations(userId);
    } catch (historyError) {
      console.error("VenuraAI history fetch error:", historyError);
    }

    const claudeMessages = [
      ...history.map((row) => ({
        role: row.role as "user" | "assistant",
        content: row.content,
      })),
      { role: "user" as const, content: message },
    ];

    let text: string;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: claudeMessages,
        }),
      });

      if (!response.ok) {
        let errBody: unknown;
        try {
          errBody = await response.json();
        } catch {
          errBody = await response.text();
        }
        const errMessage =
          typeof errBody === "object" &&
          errBody !== null &&
          "error" in errBody &&
          typeof (errBody as { error?: { message?: string } }).error?.message ===
            "string"
            ? (errBody as { error: { message: string } }).error.message
            : typeof errBody === "string"
              ? errBody
              : "Anthropic API request failed";

        console.error(
          "Anthropic API error:",
          errMessage,
          response.status,
          errBody,
        );
        return NextResponse.json(
          {
            error: errMessage,
            status: response.status,
            details: errBody,
          },
          { status: response.status >= 500 ? 502 : 400 },
        );
      }

      const data = (await response.json()) as {
        content?: { type: string; text?: string }[];
      };

      text =
        data.content
          ?.filter((block) => block.type === "text")
          .map((block) => block.text ?? "")
          .join("\n")
          .trim() ?? "";

      if (!text) {
        return NextResponse.json({ error: "Empty AI response" }, { status: 502 });
      }
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status?: number;
        error?: unknown;
      };
      console.error(
        "Anthropic API error:",
        err?.message,
        err?.status,
        err?.error,
      );
      return NextResponse.json(
        {
          error: err?.message || "Unknown error",
          status: err?.status,
          details: err?.error,
        },
        { status: 500 },
      );
    }

    await saveConversationMessages(userId, [
      { role: "user", content: message },
      { role: "assistant", content: text },
    ]);

    return NextResponse.json({
      reply: text,
      profile: usageResult.profile,
    });
  } catch (error) {
    console.error("VenuraAI route error:", error);
    const errMessage = error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
