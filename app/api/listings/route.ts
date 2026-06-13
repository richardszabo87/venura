import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchListingsFromRapidApi } from "@/lib/listings";
import { filterSampleListings } from "@/lib/sample-listings";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get("zipCode")?.trim() ?? null;
  const minBedsParam = searchParams.get("minBeds");
  const maxPriceParam = searchParams.get("maxPrice");
  const propertyType = searchParams.get("propertyType")?.trim() ?? null;

  const minBeds =
    minBedsParam != null && minBedsParam !== ""
      ? Number(minBedsParam)
      : null;
  const maxPrice =
    maxPriceParam != null && maxPriceParam !== ""
      ? Number(maxPriceParam)
      : null;

  const filters = {
    zipCode,
    minBeds: Number.isFinite(minBeds) ? minBeds : null,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : null,
    propertyType,
  };

  try {
    const listings = await fetchListingsFromRapidApi({
      ...filters,
      locationQuery: zipCode,
    });

    if (listings.length > 0) {
      return NextResponse.json({
        listings,
        source: "live",
        query: filters,
      });
    }
  } catch (error) {
    console.error("Listings API error:", error);
  }

  const fallback = filterSampleListings(filters);

  return NextResponse.json({
    listings: fallback,
    source: "sample",
    query: filters,
  });
}
