import { AgentWidgetPage } from "@/components/widget/agent-widget-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Widget | Venura",
  description:
    "Embed a branded Venura investment analysis widget on your real estate website. Customize, preview, and capture investor leads.",
};

export default function WidgetPage() {
  return <AgentWidgetPage />;
}
