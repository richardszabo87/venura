import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { incrementAnalysisUsage } from "@/lib/user-profile-server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await incrementAnalysisUsage(userId);

    if ("error" in result) {
      return NextResponse.json(result.error, { status: 403 });
    }

    return NextResponse.json({ profile: result.profile });
  } catch (error) {
    console.error("Analyze usage error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to record analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
