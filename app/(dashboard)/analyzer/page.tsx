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
      <PropertyAnalyzer />
    </>
  );
}
