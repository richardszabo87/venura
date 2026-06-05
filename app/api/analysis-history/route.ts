import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchRecentAnalysisHistory } from "@/lib/analysis-history-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const history = await fetchRecentAnalysisHistory(userId, 5);
    return NextResponse.json({ history });
  } catch (error) {
    console.error("Analysis history GET error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch analysis history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
