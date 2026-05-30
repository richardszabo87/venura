export type AgentWidgetConfig = {
  agentName: string;
  title: string;
  phone: string;
  email: string;
  accentColor: string;
  widgetTitle: string;
  ctaText: string;
};

export type WidgetPricingTier = {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const DEFAULT_WIDGET_CONFIG: AgentWidgetConfig = {
  agentName: "Jane Smith",
  title: "Investment Property Specialist",
  phone: "(301) 555-0142",
  email: "jane.smith@example.com",
  accentColor: "#1B4332",
  widgetTitle: "Analyze this investment property",
  ctaText: "Get your free analysis",
};

export const WIDGET_PRICING_TIERS: WidgetPricingTier[] = [
  {
    name: "Agent Starter",
    price: 29,
    description: "Perfect for solo agents testing lead capture.",
    features: [
      "1 branded widget",
      "Venura analyzer embed",
      "Lead notifications by email",
      "Basic customization",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Agent Pro",
    price: 49,
    description: "For active investor-focused agents.",
    features: [
      "Unlimited widget embeds",
      "Custom colors & CTA text",
      "Lead CRM export",
      "RentCheck & HOA tools",
      "Priority support",
    ],
    highlighted: true,
    cta: "Go Pro",
  },
  {
    name: "Brokerage",
    price: 199,
    description: "White-label widgets for your entire team.",
    features: [
      "Team widget library",
      "Brokerage branding",
      "Admin dashboard",
      "API access",
      "Dedicated onboarding",
    ],
    cta: "Contact sales",
  },
];

export function generateEmbedCode(config: AgentWidgetConfig): string {
  const payload = {
    agentName: config.agentName,
    title: config.title,
    phone: config.phone,
    email: config.email,
    accentColor: config.accentColor,
    widgetTitle: config.widgetTitle,
    ctaText: config.ctaText,
  };

  return `<script
  src="https://venura.io/embed/widget.js"
  data-agent-name="${escapeAttr(payload.agentName)}"
  data-agent-title="${escapeAttr(payload.title)}"
  data-agent-phone="${escapeAttr(payload.phone)}"
  data-agent-email="${escapeAttr(payload.email)}"
  data-accent-color="${escapeAttr(payload.accentColor)}"
  data-widget-title="${escapeAttr(payload.widgetTitle)}"
  data-cta-text="${escapeAttr(payload.ctaText)}"
></script>`;
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, "&quot;");
}

export function getContrastTextColor(hex: string): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return "#E8D5B7";

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? "#1B4332" : "#E8D5B7";
}
