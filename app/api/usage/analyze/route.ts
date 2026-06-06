import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { saveAnalysisHistory } from "@/lib/analysis-history-server";
import type { AnalysisResult } from "@/lib/calculator";
import { extractZipCode } from "@/lib/location-intelligence";
import { ensureFreshLocationIntelligence } from "@/lib/location-intelligence-server";
import { incrementAnalysisUsage } from "@/lib/user-profile-server";

type AnalyzeBody = {
  propertyName?: string;
  address?: string;
  purchasePrice?: number;
  monthlyRent?: number;
  analysis?: AnalysisResult;
};

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as AnalyzeBody;
    const result = await incrementAnalysisUsage(userId);

    if ("error" in result) {
      return NextResponse.json(result.error, { status: 403 });
    }

    let analysisRecord = null;
    if (
      body.analysis &&
      typeof body.purchasePrice === "number" &&
      typeof body.monthlyRent === "number"
    ) {
      analysisRecord = await saveAnalysisHistory(userId, {
        propertyName: body.propertyName,
        address: body.address,
        purchasePrice: body.purchasePrice,
        monthlyRent: body.monthlyRent,
        analysis: body.analysis,
      });

      const zipCode = body.address ? extractZipCode(body.address) : null;
      if (zipCode) {
        try {
          await ensureFreshLocationIntelligence(zipCode);
        } catch (cacheError) {
          console.error("Location intelligence cache refresh failed:", cacheError);
        }
      }
    }

    return NextResponse.json({
      profile: result.profile,
      stageAdvanced: result.stageAdvanced ?? null,
      previousStage: result.previousStage ?? null,
      analysis: analysisRecord,
    });
  } catch (error) {
    console.error("Analyze usage error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to record analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
