import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { parseProfileUpsert } from "@/lib/user-profile";
import {
  fetchProfileByClerkId,
  incrementProfileStats,
  upsertProfile,
} from "@/lib/user-profile-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await fetchProfileByClerkId(userId);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile GET error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parseProfileUpsert(body);

    if (parsed.error || !parsed.upsert) {
      return NextResponse.json(
        { error: parsed.error ?? "No profile fields to save" },
        { status: 400 },
      );
    }

    const profile = await upsertProfile(userId, parsed.upsert);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile POST error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parseProfileUpsert(body);

    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    if (!parsed.upsert && !parsed.increment) {
      return NextResponse.json(
        { error: "No valid profile fields provided" },
        { status: 400 },
      );
    }

    let profile = await fetchProfileByClerkId(userId);

    if (parsed.upsert) {
      profile = await upsertProfile(userId, parsed.upsert);
    }

    let stageAdvanced = null;
    let previousStage = null;

    if (parsed.increment) {
      const incrementResult = await incrementProfileStats(userId, parsed.increment);
      if (incrementResult) {
        profile = incrementResult.profile;
        stageAdvanced = incrementResult.stageAdvanced ?? null;
        previousStage = incrementResult.previousStage ?? null;
      }
    }

    return NextResponse.json({ profile, stageAdvanced, previousStage });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
