import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  buildDealInsert,
  type SaveDealPayload,
  type SavedDealRow,
} from "@/lib/saved-deals";
import { getSubscriptionTier, getTierLimits } from "@/lib/subscription";
import {
  fetchProfileByClerkId,
  incrementProfileStats,
} from "@/lib/user-profile-server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("saved_deals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Deals fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deals: (data ?? []) as SavedDealRow[] });
  } catch (error) {
    console.error("Deals GET error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch deals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SaveDealPayload;
    if (!body?.name?.trim() || !body?.address?.trim() || !body?.inputs || !body?.analysis) {
      return NextResponse.json(
        { error: "Missing name, address, inputs, or analysis" },
        { status: 400 },
      );
    }

    const profile = await fetchProfileByClerkId(userId);
    const tier = getSubscriptionTier(profile);
    const limits = getTierLimits(tier);

    const supabase = getSupabaseAdmin();
    const { count, error: countError } = await supabase
      .from("saved_deals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if (
      Number.isFinite(limits.savedDeals) &&
      (count ?? 0) >= limits.savedDeals
    ) {
      return NextResponse.json(
        {
          code: "LIMIT_REACHED",
          reason: "saved_deals",
          tier,
        },
        { status: 403 },
      );
    }

    const row = buildDealInsert(userId, {
      name: body.name.trim(),
      address: body.address.trim(),
      inputs: body.inputs,
      analysis: body.analysis,
    });

    const { data, error } = await supabase
      .from("saved_deals")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Deal insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let stageAdvanced = null;
    try {
      const incrementResult = await incrementProfileStats(userId, {
        properties_saved: 1,
      });
      stageAdvanced = incrementResult?.stageAdvanced ?? null;
    } catch (counterError) {
      console.error("Profile properties_saved increment error:", counterError);
    }

    return NextResponse.json({
      deal: data as SavedDealRow,
      stageAdvanced,
    });
  } catch (error) {
    console.error("Deals POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to save deal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
