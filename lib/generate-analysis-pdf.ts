import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisResult, PropertyInputs } from "./calculator";
import { VERDICT_STYLES } from "./calculator";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatPercent,
} from "./format";

const FOREST = [27, 67, 50] as const;
const CREAM = [232, 213, 183] as const;
const DARK = [13, 40, 24] as const;

export type AnalysisPdfData = {
  propertyName: string;
  address: string;
  inputs: PropertyInputs;
  analysis: AnalysisResult;
};

export function generateAnalysisPdf(data: AnalysisPdfData): void {
  const { propertyName, address, inputs, analysis } = data;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, 72, "F");

  doc.setTextColor(...CREAM);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Venura", margin, 46);
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  const venuraWidth = doc.getTextWidth("Venura");
  doc.text(".", margin + venuraWidth, 46);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 210);
  doc.text("Investment Property Analysis Report", margin, 62);

  y = 96;
  doc.setTextColor(...FOREST);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(propertyName || "Property Analysis", margin, y);
  y += 20;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  if (address) {
    doc.text(address, margin, y);
    y += 18;
  }
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`, margin, y);
  y += 28;

  const verdictStyle = VERDICT_STYLES[analysis.verdict];
  const verdictLabel = verdictStyle.label;
  const verdictRgb =
    analysis.verdict === "go"
      ? [46, 125, 50]
      : analysis.verdict === "no-go"
        ? [198, 40, 40]
        : [230, 126, 34];

  doc.setFillColor(...FOREST);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 56, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("INVESTMENT VERDICT", margin + 16, y + 22);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...verdictRgb);
  doc.text(verdictLabel, margin + 16, y + 46);
  y += 72;

  doc.setTextColor(...FOREST);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Key Metrics", margin, y);
  y += 8;

  const metrics = [
    ["Monthly mortgage", formatCurrencyDetailed(analysis.monthlyMortgage)],
    ["Monthly cash flow", formatCurrencyDetailed(analysis.monthlyCashFlow)],
    ["Cap rate", formatPercent(analysis.capRate)],
    ["Cash-on-cash return", formatPercent(analysis.cashOnCashReturn)],
    [
      "50% rule",
      analysis.fiftyPercentRulePass ? "Pass" : "Fail",
    ],
    ["Down payment", formatCurrency(analysis.downPayment)],
    ["Loan amount", formatCurrency(analysis.loanAmount)],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Metric", "Value"]],
    body: metrics,
    theme: "grid",
    headStyles: {
      fillColor: FOREST,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 8 },
    alternateRowStyles: { fillColor: [245, 250, 247] },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  doc.setTextColor(...FOREST);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Property Details", margin, y);
  y += 8;

  const details = [
    ["Purchase price", formatCurrency(inputs.purchasePrice)],
    ["Monthly rent", formatCurrency(inputs.monthlyRent)],
    ["HOA", formatCurrency(inputs.hoaFee)],
    ["Property taxes (monthly)", formatCurrency(inputs.propertyTaxes)],
    ["Insurance (monthly)", formatCurrency(inputs.insurance)],
    ["Down payment", `${inputs.downPaymentPercent}%`],
    ["Interest rate", `${inputs.interestRate}%`],
    ["Loan term", `${inputs.loanTerm} years`],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Field", "Value"]],
    body: details,
    theme: "grid",
    headStyles: {
      fillColor: FOREST,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 8 },
    alternateRowStyles: { fillColor: [245, 250, 247] },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  if (y > doc.internal.pageSize.getHeight() - 200) {
    doc.addPage();
    y = margin;
  }

  doc.setTextColor(...FOREST);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Breakdown", margin, y);
  y += 8;

  const breakdownRows = [
    ["Gross rental income", `+${formatCurrencyDetailed(inputs.monthlyRent)}`],
    ...analysis.expenseBreakdown.map((item) => [
      item.label,
      `−${formatCurrencyDetailed(item.amount)}`,
    ]),
    ["Total expenses", `−${formatCurrencyDetailed(analysis.totalMonthlyExpenses)}`],
    [
      "Net cash flow",
      `${analysis.monthlyCashFlow >= 0 ? "+" : ""}${formatCurrencyDetailed(analysis.monthlyCashFlow)}`,
    ],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Line item", "Amount"]],
    body: breakdownRows,
    theme: "grid",
    headStyles: {
      fillColor: FOREST,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 8 },
    alternateRowStyles: { fillColor: [245, 250, 247] },
    didParseCell(hook) {
      if (hook.row.index === breakdownRows.length - 1) {
        hook.cell.styles.fontStyle = "bold";
        hook.cell.styles.fillColor = [232, 213, 183];
        hook.cell.styles.textColor = [27, 67, 50];
      }
    },
  });

  const disclaimerY = doc.internal.pageSize.getHeight() - 72;
  doc.setDrawColor(...CREAM);
  doc.setLineWidth(0.5);
  doc.line(margin, disclaimerY - 12, pageWidth - margin, disclaimerY - 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  const disclaimer =
    "Disclaimer: This report is for educational and informational purposes only and does not constitute financial, legal, or investment advice. Projections are based on user-supplied assumptions and may not reflect actual performance. Consult qualified professionals before making investment decisions.";
  const lines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
  doc.text(lines, margin, disclaimerY);

  const slug = (propertyName || "analysis")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  doc.save(`venura-analysis-${slug || "report"}.pdf`);
}
