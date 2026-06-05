"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { useSubscription } from "@/components/subscription/subscription-provider";
import {
  getDealAlertDefaultsFromProfile,
  getInvestorProfile,
} from "@/lib/investor-profile";
import { getTierLimits } from "@/lib/subscription";

const ALERTS_STORAGE_KEY = "venura:dealAlerts";

function getStoredAlertCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    const alerts = raw ? (JSON.parse(raw) as unknown[]) : [];
    return Array.isArray(alerts) ? alerts.length : 0;
  } catch {
    return 0;
  }
}

function saveAlert(form: AlertForm) {
  const existing = localStorage.getItem(ALERTS_STORAGE_KEY);
  const alerts = existing ? (JSON.parse(existing) as unknown[]) : [];
  const next = [
    ...(Array.isArray(alerts) ? alerts : []),
    { ...form, createdAt: new Date().toISOString() },
  ];
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(next));
}

type AlertForm = {
  maxPrice: string;
  maxHoa: string;
  minCashFlow: string;
  zipCodes: string;
  frequency: string;
};

const FREQUENCIES = ["Daily", "Weekly", "Instant"];

export default function DealAlertsPage() {
  const { tier, showUpgrade } = useSubscription();
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [form, setForm] = useState<AlertForm>({
    maxPrice: "",
    maxHoa: "",
    minCashFlow: "",
    zipCodes: "",
    frequency: "Weekly",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const profile = getInvestorProfile();
    if (!profile) return;
    setForm((prev) => ({ ...prev, ...getDealAlertDefaultsFromProfile(profile) }));
    setActiveAlerts(getStoredAlertCount());
  }, []);

  const alertLimit = getTierLimits(tier).dealAlerts;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (Number.isFinite(alertLimit) && activeAlerts >= alertLimit) {
      showUpgrade(tier === "free" ? "deal_alerts" : "portfolio");
      return;
    }

    saveAlert(form);
    setActiveAlerts((count) => count + 1);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function updateField(field: keyof AlertForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <PageHeader
        eyebrow="Stay Informed"
        title="Deal Alerts"
        description="Create custom alerts to get notified when properties match your investment criteria."
      />

      <div className="mx-auto max-w-xl">
        {Number.isFinite(alertLimit) && (
          <p className="mb-4 text-center text-sm text-white/60">
            {activeAlerts} of {alertLimit} active alert
            {alertLimit === 1 ? "" : "s"} used
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl"
        >
          <h2 className="mb-6 text-lg font-semibold text-[#E8D5B7]">
            New Alert
          </h2>

          <div className="space-y-5">
            <FormField
              id="maxPrice"
              label="Max Price"
              prefix="$"
              value={form.maxPrice}
              onChange={(v) => updateField("maxPrice", v)}
              placeholder="250000"
            />
            <FormField
              id="maxHoa"
              label="Max HOA"
              prefix="$"
              value={form.maxHoa}
              onChange={(v) => updateField("maxHoa", v)}
              placeholder="300"
            />
            <FormField
              id="minCashFlow"
              label="Min Cash Flow"
              prefix="$"
              value={form.minCashFlow}
              onChange={(v) => updateField("minCashFlow", v)}
              placeholder="100"
              suffix="/mo"
            />
            <div>
              <label
                htmlFor="zipCodes"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70"
              >
                Zip Codes
              </label>
              <input
                id="zipCodes"
                type="text"
                value={form.zipCodes}
                onChange={(e) => updateField("zipCodes", e.target.value)}
                placeholder="20785, 20901, 20782"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E8D5B7] focus:ring-2 focus:ring-[#E8D5B7]/30"
              />
              <p className="mt-1.5 text-xs text-white/40">
                Comma-separated list of target zip codes
              </p>
            </div>

            <div>
              <label
                htmlFor="frequency"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70"
              >
                Frequency
              </label>
              <select
                id="frequency"
                value={form.frequency}
                onChange={(e) => updateField("frequency", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#E8D5B7] focus:ring-2 focus:ring-[#E8D5B7]/30"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f} className="bg-[#1B4332]">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-[#E8D5B7] py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
          >
            Create Alert
          </button>

          {submitted && (
            <p className="mt-4 text-center text-sm text-[#E8D5B7]">
              Alert created successfully! You&apos;ll receive notifications{" "}
              {form.frequency.toLowerCase()}.
            </p>
          )}
        </form>
      </div>
    </>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70"
      >
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#E8D5B7]">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E8D5B7] focus:ring-2 focus:ring-[#E8D5B7]/30 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-12" : "pr-3"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/50">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
