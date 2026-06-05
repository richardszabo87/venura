"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import {
  getInvestorScoreLabel,
  getInvestorScoreStyle,
  MARKET_PULSE_DATA,
  TEMPERATURE_STYLES,
  US_REGION_LABELS,
  US_REGION_ORDER,
  type MarketPulse,
  type UsRegion,
} from "@/lib/market-pulse";

export function MarketPulseDashboard() {
  const [activeId, setActiveId] = useState(MARKET_PULSE_DATA[0].id);
  const [search, setSearch] = useState("");

  const filteredMarkets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MARKET_PULSE_DATA;

    return MARKET_PULSE_DATA.filter((market) => {
      const haystack = [
        market.name,
        market.region,
        US_REGION_LABELS[market.usRegion],
        market.zip,
        ...market.keyZipCodes.map((z) => `${z.zip} ${z.neighborhood}`),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [search]);

  const marketsByRegion = useMemo(() => {
    const grouped = new Map<UsRegion, MarketPulse[]>();
    for (const region of US_REGION_ORDER) {
      grouped.set(region, []);
    }
    for (const market of filteredMarkets) {
      grouped.get(market.usRegion)?.push(market);
    }
    return grouped;
  }, [filteredMarkets]);

  useEffect(() => {
    if (
      filteredMarkets.length > 0 &&
      !filteredMarkets.some((item) => item.id === activeId)
    ) {
      setActiveId(filteredMarkets[0].id);
    }
  }, [filteredMarkets, activeId]);

  const market =
    MARKET_PULSE_DATA.find((item) => item.id === activeId) ??
    filteredMarkets[0] ??
    MARKET_PULSE_DATA[0];

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="inline-flex items-baseline gap-0.5">
            <span className="text-2xl font-bold tracking-tight text-[#1B4332]">
              Venura
            </span>
            <span className="text-2xl font-bold text-[#E8D5B7]">.</span>
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[#1B4332]/70 transition hover:text-[#1B4332]"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1B4332]/60">
            City Intelligence
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            Rental Market Pulse
          </h1>
          <p className="mt-3 text-sm text-[#1B4332]/70 sm:text-base">
            {MARKET_PULSE_DATA.length} markets across five US regions — investor
            scores, zip-level rents, rent control, and climate signals.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-4 shadow-sm sm:p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
              Search cities
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, region, or zip code..."
              className="w-full rounded-xl border border-[#1B4332]/15 bg-[#F7F1E8] px-4 py-3 text-sm text-[#1B4332] outline-none transition placeholder:text-[#1B4332]/35 focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8D5B7]/60"
            />
          </label>
          {search && (
            <p className="mt-2 text-xs text-[#1B4332]/60">
              {filteredMarkets.length} market
              {filteredMarkets.length === 1 ? "" : "s"} match your search
            </p>
          )}
        </div>

        <div className="mt-6 space-y-5">
          {US_REGION_ORDER.map((region) => {
            const regionMarkets = marketsByRegion.get(region) ?? [];
            if (regionMarkets.length === 0) return null;

            return (
              <section key={region}>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#1B4332]/50">
                  {US_REGION_LABELS[region]}
                </h2>
                <div className="overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-2">
                    {regionMarkets.map((item) => {
                      const active = item.id === activeId;
                      const scoreStyle = getInvestorScoreStyle(item.investorScore);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveId(item.id)}
                          className={`min-w-[148px] rounded-xl border px-4 py-3 text-left transition ${
                            active
                              ? "border-[#1B4332] bg-[#1B4332] text-[#E8D5B7]"
                              : "border-[#1B4332]/15 bg-white text-[#1B4332] hover:border-[#1B4332]/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="block text-sm font-semibold leading-tight">
                              {item.name}
                            </span>
                            <span
                              className={`shrink-0 rounded-md border px-1.5 py-0.5 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
                            >
                              {item.investorScore}
                            </span>
                          </div>
                          <span
                            className={`mt-1 block text-xs ${active ? "text-[#E8D5B7]/70" : "text-[#1B4332]/60"}`}
                          >
                            {item.region}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {filteredMarkets.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#1B4332]/10 bg-white px-6 py-12 text-center">
            <p className="text-sm text-[#1B4332]/70">
              No markets match &ldquo;{search}&rdquo;. Try a city name, state, or
              zip code.
            </p>
          </div>
        ) : (
          <MarketPanel market={market} />
        )}
      </main>
    </div>
  );
}

function MarketPanel({ market }: { market: MarketPulse }) {
  const tempStyle = TEMPERATURE_STYLES[market.temperature];
  const scoreLabel = getInvestorScoreLabel(market.investorScore);
  const scoreStyle = getInvestorScoreStyle(market.investorScore);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-[#E8D5B7]/30 bg-[#1B4332] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8D5B7]/70">
                Investor Score
              </p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-5xl font-black text-[#E8D5B7]">
                  {market.investorScore}
                  <span className="text-2xl font-semibold text-white/40">/100</span>
                </p>
                <span
                  className={`mb-2 rounded-lg border px-2.5 py-1 text-sm font-bold ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
                >
                  {scoreLabel}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/75">
                {market.name} · {market.region} · {US_REGION_LABELS[market.usRegion]}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tempStyle.badge}`}
            >
              {market.temperatureLabel} market
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Vacancy rate" value={`${market.vacancyRate}%`} />
          <StatCard
            label="Days on market"
            value={`${market.daysOnMarket}`}
            detail="avg. to lease"
          />
          <StatCard
            label="Latest rent growth"
            value={`+${market.rentGrowthTrend.at(-1)?.growth.toFixed(1)}%`}
            detail="YoY"
            className="col-span-2"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {market.rentControlWarning ? (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-950/10 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-amber-900">
              Rent control: {market.rentControlWarning.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-950/80">
              {market.rentControlWarning.detail}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-50 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-emerald-900">
              Rent control: No local rent control
            </p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-900/75">
              This market does not impose local rent stabilization. Annual
              increases generally follow lease terms and market conditions.
            </p>
          </div>
        )}

        {market.climateWarning ? (
          <div className="rounded-2xl border border-sky-400/40 bg-sky-50 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-sky-900">
              Climate: {market.climateWarning.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-sky-900/80">
              {market.climateWarning.detail}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#1B4332]/10 bg-white px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-[#1B4332]/80">
              Climate: No major climate flags
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#1B4332]/60">
              Standard hazard insurance assumptions apply. Still verify flood
              maps for any waterfront or low-lying parcel.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-[#1B4332]">Key zip codes</h2>
        <p className="mt-1 text-sm text-[#1B4332]/70">
          Six submarket zips with investor scores and average 2-bedroom rents.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {market.keyZipCodes.map((zip) => {
            const zipScoreStyle = getInvestorScoreStyle(zip.investorScore);
            return (
              <div
                key={zip.zip + zip.neighborhood}
                className="rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#1B4332]">{zip.zip}</p>
                    <p className="mt-0.5 text-xs text-[#1B4332]/65">
                      {zip.neighborhood}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1B4332]">
                      {formatCurrency(zip.averageRent)}
                      <span className="text-xs font-normal text-[#1B4332]/60">
                        /mo avg
                      </span>
                    </p>
                  </div>
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-sm font-bold ${zipScoreStyle.bg} ${zipScoreStyle.text} ${zipScoreStyle.border}`}
                  >
                    {zip.investorScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-[#1B4332]">
          Average rent by bedroom
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {market.averageRentByBedroom.map((row) => (
            <div
              key={row.bedrooms}
              className="rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] p-4 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
                {row.label}
              </p>
              <p className="mt-2 text-xl font-bold text-[#1B4332]">
                {formatCurrency(row.averageRent)}
              </p>
              <p className="mt-1 text-xs text-[#1B4332]/60">/mo</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-[#1B4332]">
          3-year rent growth trend
        </h2>
        <p className="mt-1 text-sm text-[#1B4332]/70">
          Year-over-year rent growth (%)
        </p>
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={market.rentGrowthTrend}>
              <CartesianGrid
                stroke="#1B4332"
                strokeOpacity={0.08}
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "#1B4332", fontSize: 12 }}
                axisLine={{ stroke: "#1B4332", strokeOpacity: 0.15 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#1B4332", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)}%`,
                  "Rent growth",
                ]}
                contentStyle={{
                  backgroundColor: "#1B4332",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "#E8D5B7",
                }}
              />
              <Bar
                dataKey="growth"
                fill="#1B4332"
                radius={[6, 6, 0, 0]}
                activeBar={{
                  fill: "#E8D5B7",
                  stroke: "#1B4332",
                  strokeWidth: 2,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SignalPanel
          title="Bullish signals"
          signals={market.bullishSignals}
          tone="bullish"
        />
        <SignalPanel
          title="Bearish signals"
          signals={market.bearishSignals}
          tone="bearish"
        />
        <SignalPanel
          title="Neutral signals"
          signals={market.neutralSignals}
          tone="neutral"
        />
      </div>

      <div className="rounded-2xl border border-[#1B4332]/10 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
        <h2 className="text-lg font-semibold text-[#E8D5B7]">
          Put this market data to work
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
          Underwrite a deal in {market.name} with Venura&apos;s analyzer or ask
          VenuraAI about rent control, financing, and neighborhood strategy.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/analyzer"
            className="inline-flex w-full rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE] sm:w-auto"
          >
            Analyze on Venura →
          </Link>
          <Link
            href="/venura-ai"
            className="inline-flex w-full rounded-xl border border-[#E8D5B7]/40 px-6 py-3.5 text-sm font-semibold text-[#E8D5B7] transition hover:bg-[#E8D5B7]/10 sm:w-auto"
          >
            Ask VenuraAI →
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  className = "",
}: {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#1B4332]/10 bg-white p-5 text-center shadow-sm ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-[#1B4332]">{value}</p>
      {detail && (
        <p className="mt-1 text-xs text-[#1B4332]/60">{detail}</p>
      )}
    </div>
  );
}

function SignalPanel({
  title,
  signals,
  tone,
}: {
  title: string;
  signals: { text: string }[];
  tone: "bullish" | "bearish" | "neutral";
}) {
  const dotColor =
    tone === "bullish"
      ? "bg-emerald-600"
      : tone === "bearish"
        ? "bg-red-500"
        : "bg-[#1B4332]/40";

  return (
    <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-[#1B4332]">{title}</h2>
      <ul className="mt-4 space-y-3">
        {signals.map((signal) => (
          <li
            key={signal.text}
            className="flex gap-3 rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] px-4 py-3 text-sm leading-relaxed text-[#1B4332]/85"
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`}
            />
            {signal.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
