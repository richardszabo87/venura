import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PropertyAnalyzer } from "@/components/analyzer/property-analyzer";

export default function AnalyzerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Investment Analysis"
        title="Analyzer"
        description="Professional rental property underwriting — cash flow, returns, and the 50% rule at a glance."
      />
      <Suspense
        fallback={
          <div className="rounded-2xl border border-white/10 bg-[#1B4332] p-8 text-center text-sm text-white/60">
            Loading analyzer…
          </div>
        }
      >
        <PropertyAnalyzer />
      </Suspense>
    </>
  );
}
