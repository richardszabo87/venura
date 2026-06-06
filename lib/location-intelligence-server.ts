import {
  extractZipCode,
  fetchLocationIntelligence,
  type LocationIntelligenceResult,
} from "./location-intelligence";
import { getSupabaseAdmin } from "./supabase";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type LocationIntelligenceRow = {
  zip_code: string;
  school_score: number;
  crime_score: number;
  school_summary: string;
  crime_summary: string;
  last_updated: string;
};

function isFresh(lastUpdated: string): boolean {
  const updatedAt = new Date(lastUpdated).getTime();
  return Date.now() - updatedAt < CACHE_TTL_MS;
}

export async function getCachedLocationIntelligence(
  zipCode: string,
): Promise<LocationIntelligenceRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("location_intelligence")
    .select("*")
    .eq("zip_code", zipCode)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as LocationIntelligenceRow | null) ?? null;
}

export async function upsertLocationIntelligence(
  zipCode: string,
  result: LocationIntelligenceResult,
): Promise<LocationIntelligenceRow> {
  const supabase = getSupabaseAdmin();
  const row = {
    zip_code: zipCode,
    school_score: result.school.overallScore,
    crime_score: result.crime.score,
    school_summary: result.school.summary,
    crime_summary: result.crime.insight,
    last_updated: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("location_intelligence")
    .upsert(row, { onConflict: "zip_code" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as LocationIntelligenceRow;
}

function mergeCachedWithFresh(
  cached: LocationIntelligenceRow,
  fresh: LocationIntelligenceResult,
): LocationIntelligenceResult {
  return {
    school: {
      ...fresh.school,
      overallScore: cached.school_score,
      summary: cached.school_summary,
    },
    crime: {
      ...fresh.crime,
      score: cached.crime_score,
      insight: cached.crime_summary,
    },
  };
}

export async function ensureFreshLocationIntelligence(
  zipCode: string,
): Promise<{ data: LocationIntelligenceResult; cached: boolean }> {
  const cached = await getCachedLocationIntelligence(zipCode);
  const fresh = await fetchLocationIntelligence(zipCode);

  if (cached && isFresh(cached.last_updated)) {
    return {
      data: mergeCachedWithFresh(cached, fresh),
      cached: true,
    };
  }

  const saved = await upsertLocationIntelligence(zipCode, fresh);
  return {
    data: mergeCachedWithFresh(saved, fresh),
    cached: false,
  };
}

export async function refreshLocationIntelligenceForZip(
  zipCode: string,
): Promise<LocationIntelligenceResult> {
  const fresh = await fetchLocationIntelligence(zipCode);
  await upsertLocationIntelligence(zipCode, fresh);
  return fresh;
}

export async function getZipCodesFromRecentAnalyses(
  days = 30,
): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("analysis_history")
    .select("address")
    .gte("analyzed_at", since)
    .not("address", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  const zipCodes = new Set<string>();
  for (const row of data ?? []) {
    const address = row.address as string | null;
    if (!address) continue;
    const zip = extractZipCode(address);
    if (zip) zipCodes.add(zip);
  }

  return [...zipCodes];
}
