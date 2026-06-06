import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { extractZipCode } from "@/lib/location-intelligence";
import { ensureFreshLocationIntelligence } from "@/lib/location-intelligence-server";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const zipParam = searchParams.get("zip")?.trim();
  const addressParam = searchParams.get("address")?.trim();

  const zipCode =
    zipParam && /^\d{5}$/.test(zipParam)
      ? zipParam
      : addressParam
        ? extractZipCode(addressParam)
        : null;

  if (!zipCode) {
    return NextResponse.json(
      { error: "A valid 5-digit zip code is required" },
      { status: 400 },
    );
  }

  try {
    const { data, cached } = await ensureFreshLocationIntelligence(zipCode);
    return NextResponse.json({
      zipCode,
      school: data.school,
      crime: data.crime,
      cached,
    });
  } catch (error) {
    console.error("Location intelligence error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load location data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
