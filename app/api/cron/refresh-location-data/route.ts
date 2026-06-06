import { NextResponse } from "next/server";
import {
  getZipCodesFromRecentAnalyses,
  refreshLocationIntelligenceForZip,
} from "@/lib/location-intelligence-server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const zipCodes = await getZipCodesFromRecentAnalyses(30);
    const refreshed: string[] = [];
    const failed: Array<{ zip: string; error: string }> = [];

    for (const zipCode of zipCodes) {
      try {
        await refreshLocationIntelligenceForZip(zipCode);
        refreshed.push(zipCode);
      } catch (error) {
        failed.push({
          zip: zipCode,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      total: zipCodes.length,
      refreshed: refreshed.length,
      failed,
    });
  } catch (error) {
    console.error("Refresh location data cron error:", error);
    const message =
      error instanceof Error ? error.message : "Cron job failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
