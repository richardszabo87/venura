"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_WIDGET_CONFIG,
  generateEmbedCode,
  getContrastTextColor,
  WIDGET_PRICING_TIERS,
  type AgentWidgetConfig,
} from "@/lib/agent-widget";

type WidgetTab = "customize" | "preview" | "embed" | "pricing";

const TABS: { id: WidgetTab; label: string }[] = [
  { id: "customize", label: "Customize" },
  { id: "preview", label: "Preview" },
  { id: "embed", label: "Embed" },
  { id: "pricing", label: "Pricing" },
];

export function AgentWidgetPage() {
  const [activeTab, setActiveTab] = useState<WidgetTab>("customize");
  const [config, setConfig] = useState<AgentWidgetConfig>(DEFAULT_WIDGET_CONFIG);
  const [copied, setCopied] = useState(false);

  const embedCode = useMemo(() => generateEmbedCode(config), [config]);
  const ctaTextColor = useMemo(
    () => getContrastTextColor(config.accentColor),
    [config.accentColor],
  );

  function updateField<K extends keyof AgentWidgetConfig>(
    field: K,
    value: AgentWidgetConfig[K],
  ) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
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

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1B4332]/60">
            For Real Estate Agents
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            Venura Agent Widget
          </h1>
          <p className="mt-3 text-sm text-[#1B4332]/70 sm:text-base">
            Embed a branded investment analysis widget on your site and capture
            investor leads automatically.
          </p>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            {TABS.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "border-[#1B4332] bg-[#1B4332] text-[#E8D5B7]"
                      : "border-[#1B4332]/15 bg-white text-[#1B4332] hover:border-[#1B4332]/40"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "customize" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <CustomizeForm config={config} onChange={updateField} />
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
                  Live preview
                </p>
                <WidgetPreview config={config} ctaTextColor={ctaTextColor} />
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="mx-auto max-w-md">
              <WidgetPreview config={config} ctaTextColor={ctaTextColor} large />
            </div>
          )}

          {activeTab === "embed" && (
            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                Embed code
              </h2>
              <p className="mt-2 text-sm text-[#1B4332]/70">
                Paste this snippet before the closing{" "}
                <code className="rounded bg-[#F7F1E8] px-1.5 py-0.5 text-xs">
                  &lt;/body&gt;
                </code>{" "}
                tag on your website.
              </p>
              <pre className="mt-5 overflow-x-auto rounded-xl border border-[#1B4332]/10 bg-[#1B4332] p-4 text-xs leading-relaxed text-[#E8D5B7] sm:text-sm">
                {embedCode}
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-5 rounded-xl bg-[#E8D5B7] px-6 py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
              >
                {copied ? "Copied!" : "Copy embed code"}
              </button>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {WIDGET_PRICING_TIERS.map((tier) => (
                <article
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-6 ${
                    tier.highlighted
                      ? "border-[#1B4332] bg-[#1B4332] text-white shadow-xl ring-2 ring-[#E8D5B7]/30"
                      : "border-[#1B4332]/15 bg-white"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8D5B7] px-3 py-1 text-xs font-semibold text-[#1B4332]">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p
                    className={`mt-1 text-sm ${tier.highlighted ? "text-white/70" : "text-[#1B4332]/70"}`}
                  >
                    {tier.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black">${tier.price}</span>
                    <span
                      className={`text-sm ${tier.highlighted ? "text-white/50" : "text-[#1B4332]/50"}`}
                    >
                      /mo
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-2">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-2 text-sm ${
                          tier.highlighted ? "text-white/85" : "text-[#1B4332]/80"
                        }`}
                      >
                        <span className="text-[#E8D5B7]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sign-up"
                    className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition ${
                      tier.highlighted
                        ? "bg-[#E8D5B7] text-[#1B4332] hover:bg-[#F0E4CE]"
                        : "border border-[#1B4332]/20 bg-[#E8D5B7]/40 text-[#1B4332] hover:bg-[#E8D5B7]/60"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CustomizeForm({
  config,
  onChange,
}: {
  config: AgentWidgetConfig;
  onChange: <K extends keyof AgentWidgetConfig>(
    field: K,
    value: AgentWidgetConfig[K],
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-[#1B4332]">
        Widget customization
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Agent name">
          <input
            type="text"
            value={config.agentName}
            onChange={(e) => onChange("agentName", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Title">
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange("title", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={config.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={config.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Accent color" className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.accentColor}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-lg border border-[#1B4332]/15 bg-transparent"
            />
            <input
              type="text"
              value={config.accentColor}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className={inputClass}
            />
          </div>
        </Field>
        <Field label="Widget title" className="sm:col-span-2">
          <input
            type="text"
            value={config.widgetTitle}
            onChange={(e) => onChange("widgetTitle", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="CTA text" className="sm:col-span-2">
          <input
            type="text"
            value={config.ctaText}
            onChange={(e) => onChange("ctaText", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}

function WidgetPreview({
  config,
  ctaTextColor,
  large = false,
}: {
  config: AgentWidgetConfig;
  ctaTextColor: string;
  large?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#1B4332]/15 bg-white shadow-lg ${
        large ? "scale-100" : ""
      }`}
    >
      <div
        className="px-5 py-4"
        style={{ backgroundColor: config.accentColor }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider opacity-80"
          style={{ color: ctaTextColor }}
        >
          Powered by Venura
        </p>
        <p
          className="mt-1 text-lg font-bold"
          style={{ color: ctaTextColor }}
        >
          {config.widgetTitle || "Widget title"}
        </p>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/50">
            Your agent
          </p>
          <p className="mt-1 font-semibold text-[#1B4332]">
            {config.agentName || "Agent name"}
          </p>
          <p className="text-sm text-[#1B4332]/70">
            {config.title || "Title"}
          </p>
          <div className="mt-3 space-y-1 text-sm text-[#1B4332]/80">
            <p>{config.phone || "Phone"}</p>
            <p>{config.email || "Email"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg border border-[#1B4332]/10 bg-[#F7F1E8] px-2 py-3">
            <p className="font-semibold text-[#1B4332]">Cash flow</p>
            <p className="mt-1 text-[#1B4332]/60">+$312/mo</p>
          </div>
          <div className="rounded-lg border border-[#1B4332]/10 bg-[#F7F1E8] px-2 py-3">
            <p className="font-semibold text-[#1B4332]">Verdict</p>
            <p className="mt-1 font-bold text-emerald-700">GO</p>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition"
          style={{
            backgroundColor: config.accentColor,
            color: ctaTextColor,
          }}
        >
          {config.ctaText || "CTA text"}
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#1B4332]/15 bg-[#F7F1E8] px-3 py-2.5 text-sm text-[#1B4332] outline-none transition placeholder:text-[#1B4332]/30 focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8D5B7]/60";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#1B4332]/70">
        {label}
      </span>
      {children}
    </label>
  );
}
