import type { AnalysisResult } from "./calculator";
import { getSupabaseAdmin } from "./supabase";

export type AnalysisHistoryRow = {
  id: string;
  clerk_user_id: string;
  property_name: string | null;
  address: string | null;
  purchase_price: number | null;
  monthly_rent: number | null;
  monthly_cash_flow: number | null;
  cap_rate: number | null;
  cash_on_cash: number | null;
  verdict: "go" | "no-go" | "caution";
  analyzed_at: string;
};

export type SaveAnalysisHistoryInput = {
  propertyName?: string;
  address?: string;
  purchasePrice: number;
  monthlyRent: number;
  analysis: AnalysisResult;
};

export async function saveAnalysisHistory(
  clerkUserId: string,
  input: SaveAnalysisHistoryInput,
): Promise<AnalysisHistoryRow> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("analysis_history")
    .insert({
      clerk_user_id: clerkUserId,
      property_name: input.propertyName?.trim() || null,
      address: input.address?.trim() || null,
      purchase_price: input.purchasePrice,
      monthly_rent: input.monthlyRent,
      monthly_cash_flow: input.analysis.monthlyCashFlow,
      cap_rate: input.analysis.capRate,
      cash_on_cash: input.analysis.cashOnCashReturn,
      verdict: input.analysis.verdict,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AnalysisHistoryRow;
}

export async function fetchRecentAnalysisHistory(
  clerkUserId: string,
  limit = 5,
): Promise<AnalysisHistoryRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("analysis_history")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .order("analyzed_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AnalysisHistoryRow[];
}

export async function fetchAnalysisHistoryById(
  clerkUserId: string,
  id: string,
): Promise<AnalysisHistoryRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("analysis_history")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as AnalysisHistoryRow | null) ?? null;
}
