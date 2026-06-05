import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchAnalysisHistoryById } from "@/lib/analysis-history-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const record = await fetchAnalysisHistoryById(userId, id);

    if (!record) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    return NextResponse.json({ analysis: record });
  } catch (error) {
    console.error("Analysis history GET by id error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
