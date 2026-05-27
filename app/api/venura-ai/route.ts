import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are VenuraAI, an expert real estate investment advisor specializing in the DC metro area. You know DC, Maryland and Virginia markets deeply including rent control laws, HOA benchmarks, neighborhood data, and investment strategies. Give concise, specific, actionable advice to first-time residential investors. Always be honest about risks.";

const MODEL = "claude-sonnet-4-20250514";

export async function POST(request: Request) {
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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Anthropic API error:", response.status, errBody);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: response.status >= 500 ? 502 : 400 },
      );
    }

    const data = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };

    const text =
      data.content
        ?.filter((block) => block.type === "text")
        .map((block) => block.text ?? "")
        .join("\n")
        .trim() ?? "";

    if (!text) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 502 });
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("VenuraAI route error:", error);
    const errMessage = error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
