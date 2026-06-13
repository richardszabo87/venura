"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { computeListingDealScore } from "@/lib/deal-score";
import { formatCurrency, formatCashFlow } from "@/lib/format";
import type { Listing } from "@/lib/listings";
import { analyzeProperty, DEFAULTS } from "@/lib/calculator";
import { estimateMonthlyRent } from "@/lib/rent-estimate";

const DEFAULT_ZIP = "20785";

const PROPERTY_TYPES = [
  { value: "", label: "Any type" },
  { value: "single_family", label: "Single family" },
  { value: "townhouse", label: "Townhouse" },
  { value: "condo", label: "Condo" },
  { value: "multi_family", label: "Multi-family" },
];

type EnrichedListing = Listing & {
  estimatedRent: number;
  venuraScore: number;
  monthlyCashFlow: number;
};

type ListingsResponse = {
  listings: Listing[];
  source: "live" | "sample";
};

function enrichListing(listing: Listing): EnrichedListing {
  const estimatedRent = estimateMonthlyRent({
    price: listing.listPrice,
    zipCode: listing.zipCode || DEFAULT_ZIP,
    beds: listing.beds,
    propertyType: listing.propertyType,
  });

  const propertyTaxes =
    listing.taxAmount != null && listing.taxAmount > 0
      ? Math.round(listing.taxAmount / 12)
      : Math.round((listing.listPrice * 0.011) / 12);

  const insurance = Math.round((listing.listPrice * 0.0035) / 12);

  const analysis = analyzeProperty({
    ...DEFAULTS,
    purchasePrice: listing.listPrice,
    monthlyRent: estimatedRent,
    hoaFee: listing.hoaFee ?? 0,
    propertyTaxes,
    insurance,
  });

  return {
    ...listing,
    estimatedRent,
    venuraScore: computeListingDealScore({
      listPrice: listing.listPrice,
      monthlyRent: estimatedRent,
      hoaFee: listing.hoaFee,
      taxAmount: listing.taxAmount,
    }),
    monthlyCashFlow: analysis.monthlyCashFlow,
  };
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-300";
  if (score >= 55) return "text-[#E8D5B7]";
  return "text-orange-300";
}

function ListingsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-white/10 bg-[#1B4332]/60 p-5"
        >
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="mt-3 h-6 w-1/3 rounded bg-white/10" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-white/10" />
          </div>
          <div className="mt-4 h-10 w-full rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function ListingCard({ listing }: { listing: EnrichedListing }) {
  const analyzerHref = "/analyzer";

  return (
    <article className="rounded-2xl border border-white/10 bg-[#1B4332]/60 p-5 shadow-xl transition hover:border-[#E8D5B7]/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{listing.address}</h3>
          <p className="mt-1 text-sm text-white/60">
            {listing.city}, {listing.state} {listing.zipCode}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold tabular-nums ${scoreColor(listing.venuraScore)}`}>
            {listing.venuraScore}
          </p>
          <p className="text-xs uppercase tracking-wider text-white/50">
            Venura Score
          </p>
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-[#E8D5B7]">
        {formatCurrency(listing.listPrice)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Metric label="Beds" value={String(listing.beds)} />
        <Metric label="Baths" value={String(listing.baths)} />
        <Metric
          label="Sq ft"
          value={listing.sqft > 0 ? listing.sqft.toLocaleString() : "—"}
        />
        <Metric label="DOM" value={String(listing.daysOnMarket)} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">
            Est. rent
          </p>
          <p className="mt-1 font-semibold text-white">
            {formatCurrency(listing.estimatedRent)}/mo
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">
            Est. cash flow
          </p>
          <p
            className={`mt-1 font-semibold ${
              listing.monthlyCashFlow >= 0 ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {formatCashFlow(listing.monthlyCashFlow)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
        <span className="rounded-full bg-white/5 px-2.5 py-1 capitalize">
          {listing.propertyType.replace(/_/g, " ")}
        </span>
        {listing.hoaFee != null && listing.hoaFee > 0 && (
          <span className="rounded-full bg-white/5 px-2.5 py-1">
            HOA {formatCurrency(listing.hoaFee)}/mo
          </span>
        )}
        {listing.taxAmount != null && listing.taxAmount > 0 && (
          <span className="rounded-full bg-white/5 px-2.5 py-1">
            Tax {formatCurrency(listing.taxAmount)}/yr
          </span>
        )}
      </div>

      <Link
        href={analyzerHref}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#E8D5B7] px-4 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
      >
        Analyze in Venura
      </Link>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-0.5 font-medium text-white">{value}</p>
    </div>
  );
}

export function ListingsDashboard() {
  const [locationQuery, setLocationQuery] = useState(DEFAULT_ZIP);
  const [minBeds, setMinBeds] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listings, setListings] = useState<EnrichedListing[]>([]);
  const [source, setSource] = useState<"live" | "sample">("sample");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("zipCode", query.trim());
      if (minBeds) params.set("minBeds", minBeds);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (propertyType) params.set("propertyType", propertyType);

      const response = await fetch(`/api/listings?${params.toString()}`);
      const data = (await response.json().catch(() => ({}))) as ListingsResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load listings");
      }

      setSource(data.source ?? "sample");
      setListings((data.listings ?? []).map(enrichListing));
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load listings",
      );
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [maxPrice, minBeds, propertyType]);

  useEffect(() => {
    void fetchListings(DEFAULT_ZIP);
    // Initial load only — searches run via form submit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badgeLabel = source === "live" ? "Live listings" : "Sample data";
  const badgeClass =
    source === "live"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : "border-amber-400/30 bg-amber-500/10 text-amber-200";

  const summary = useMemo(() => {
    if (listings.length === 0) return null;
    const avgScore = Math.round(
      listings.reduce((sum, listing) => sum + listing.venuraScore, 0) /
        listings.length,
    );
    return { count: listings.length, avgScore };
  }, [listings]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    void fetchListings(locationQuery.trim() || DEFAULT_ZIP);
  }

  return (
    <>
      <PageHeader
        eyebrow="Market Search"
        title="Listings"
        description="Browse for-sale properties in the DC metro with Venura Score and estimated rent on every listing."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badgeClass}`}
        >
          {badgeLabel}
        </span>
        {summary && !loading && (
          <span className="text-sm text-white/60">
            {summary.count} properties · avg Venura Score {summary.avgScore}
          </span>
        )}
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-8 rounded-2xl border border-white/10 bg-[#1B4332]/60 p-5"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Zip or city
            </span>
            <input
              type="text"
              value={locationQuery}
              onChange={(event) => setLocationQuery(event.target.value)}
              placeholder="20785 or Hyattsville"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E8D5B7]/50 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Min beds
            </span>
            <input
              type="number"
              min={0}
              value={minBeds}
              onChange={(event) => setMinBeds(event.target.value)}
              placeholder="Any"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E8D5B7]/50 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Max price
            </span>
            <input
              type="number"
              min={0}
              step={10000}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Any"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E8D5B7]/50 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Property type
            </span>
            <select
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[#E8D5B7]/50 focus:outline-none"
            >
              {PROPERTY_TYPES.map((option) => (
                <option key={option.value || "any"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-[#E8D5B7] px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search listings"}
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <ListingsSkeleton />
      ) : listings.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#1B4332]/60 px-6 py-12 text-center">
          <p className="text-white/80">No listings found for this search.</p>
          <p className="mt-2 text-sm text-white/50">
            Try a different zip code or broaden your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard key={listing.propertyId} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
}
