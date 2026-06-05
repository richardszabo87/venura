export type GuideToolLink = {
  label: string;
  href: string;
};

export type GuideChecklistItem = {
  id: string;
  label: string;
};

export type GuideStage = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  items: GuideChecklistItem[];
  venuraTip: string;
  tools: GuideToolLink[];
};

export const BUYER_GUIDE_STAGES: GuideStage[] = [
  {
    id: "finances",
    number: 1,
    title: "Get finances ready",
    subtitle: "Build a strong foundation before you start shopping.",
    items: [
      { id: "finances-credit", label: "Pull your credit report and fix any errors" },
      { id: "finances-debt", label: "Pay down high-interest debt where possible" },
      {
        id: "finances-savings",
        label: "Save for down payment, closing costs, and moving expenses",
      },
      {
        id: "finances-emergency",
        label: "Keep 3–6 months of expenses in an emergency fund",
      },
      {
        id: "finances-budget",
        label: "Calculate your true monthly housing budget (not just the mortgage)",
      },
      {
        id: "finances-rent-vs-buy",
        label: "Decide whether renting or buying fits your timeline and goals",
      },
      {
        id: "finances-docs",
        label: "Gather pay stubs, W-2s, tax returns, and bank statements",
      },
    ],
    venuraTip:
      "Most buyers only budget for the mortgage. Venura's True Cost Calculator includes taxes, insurance, HOA, PMI, and maintenance so you know what you can actually afford.",
    tools: [
      { label: "True Cost Calculator", href: "/cost" },
      { label: "Rent vs Buy Calculator", href: "/rvb" },
    ],
  },
  {
    id: "pre-approved",
    number: 2,
    title: "Get pre-approved",
    subtitle: "Know your buying power before you fall in love with a listing.",
    items: [
      { id: "pre-shop-lenders", label: "Compare at least 3 lenders on rates and fees" },
      {
        id: "pre-approval-letter",
        label: "Get a pre-approval letter (stronger than pre-qualification)",
      },
      {
        id: "pre-loan-types",
        label: "Understand loan options: conventional, FHA, VA, or USDA",
      },
      { id: "pre-max-price", label: "Confirm your maximum purchase price and monthly payment" },
      { id: "pre-down-payment", label: "Verify down payment requirements and PMI rules" },
      {
        id: "pre-rate-lock",
        label: "Discuss rate-lock timing with your loan officer",
      },
      {
        id: "pre-no-new-credit",
        label: "Avoid new credit cards, car loans, or large purchases",
      },
    ],
    venuraTip:
      "Lenders approve you on gross income, but you live on net cash flow. Cross-check your pre-approval amount against Venura's 28% affordability rule before house hunting.",
    tools: [
      { label: "True Cost Calculator", href: "/cost" },
      { label: "Investor Quiz", href: "/quiz" },
    ],
  },
  {
    id: "find-property",
    number: 3,
    title: "Find the right property",
    subtitle: "Search with criteria that match your budget and lifestyle.",
    items: [
      { id: "find-must-haves", label: "List must-haves vs. nice-to-haves before touring" },
      { id: "find-neighborhoods", label: "Research neighborhoods, schools, and commute times" },
      { id: "find-market-data", label: "Review local market trends and inventory levels" },
      {
        id: "find-budget-buffer",
        label: "Set a target price with room for taxes, HOA, and repairs",
      },
      { id: "find-tour-checklist", label: "Tour with a checklist: layout, noise, parking, light" },
      { id: "find-hoa-review", label: "Request HOA docs and review fees before making an offer" },
      {
        id: "find-rent-estimate",
        label: "Estimate market rent if you might house-hack or convert later",
      },
    ],
    venuraTip:
      "A low list price can hide expensive HOA fees or weak rental demand. Check HOA health and rent comps before you get attached to a property.",
    tools: [
      { label: "Market Pulse", href: "/markets" },
      { label: "RentCheck", href: "/rent" },
      { label: "HOA Danger Score", href: "/hoa" },
    ],
  },
  {
    id: "winning-offer",
    number: 4,
    title: "Make a winning offer",
    subtitle: "Submit a competitive offer without overpaying.",
    items: [
      { id: "offer-comps", label: "Review comparable sales and days on market" },
      { id: "offer-price", label: "Set your opening offer, target price, and walk-away price" },
      { id: "offer-earnest", label: "Decide earnest money amount and contingency terms" },
      {
        id: "offer-timeline",
        label: "Align closing timeline with your lender and lease end date",
      },
      { id: "offer-counter", label: "Prepare to respond quickly to counteroffers" },
      {
        id: "offer-escalation",
        label: "Understand escalation clauses before using one",
      },
      {
        id: "offer-analyze",
        label: "Run the numbers on cash flow if this is an investment property",
      },
    ],
    venuraTip:
      "Winning the offer is only step one. Run the property through Venura's analyzer before you waive contingencies — a pretty kitchen doesn't fix negative cash flow.",
    tools: [
      { label: "Deal Analyzer", href: "/analyzer" },
      { label: "Rent vs Buy Calculator", href: "/rvb" },
    ],
  },
  {
    id: "due-diligence",
    number: 5,
    title: "Due diligence and inspection",
    subtitle: "Verify the property before you remove contingencies.",
    items: [
      { id: "dd-inspector", label: "Hire a licensed home inspector" },
      {
        id: "dd-report",
        label: "Review the inspection report and prioritize safety issues",
      },
      { id: "dd-hoa-score", label: "Run an HOA reserve and fee risk analysis" },
      {
        id: "dd-insurance",
        label: "Get homeowners insurance quotes for the specific property",
      },
      {
        id: "dd-true-cost",
        label: "Recalculate true monthly cost with actual tax and insurance figures",
      },
      {
        id: "dd-negotiate",
        label: "Negotiate repairs, credits, or price reductions if needed",
      },
      {
        id: "dd-disclosures",
        label: "Read seller disclosures, title report, and HOA resale package",
      },
    ],
    venuraTip:
      "Inspection issues are negotiable; HOA underfunding is a long-term tax on ownership. A bad HOA can cost more than a leaky faucet over five years.",
    tools: [
      { label: "HOA Danger Score", href: "/hoa" },
      { label: "True Cost Calculator", href: "/cost" },
    ],
  },
  {
    id: "close",
    number: 6,
    title: "Close and get your keys",
    subtitle: "Cross the finish line and plan for move-in day.",
    items: [
      {
        id: "close-disclosure",
        label: "Review the Closing Disclosure at least 3 business days before closing",
      },
      { id: "close-walkthrough", label: "Complete the final walkthrough 24 hours before closing" },
      {
        id: "close-funds",
        label: "Confirm wire instructions by phone — never trust email alone",
      },
      { id: "close-insurance", label: "Bind homeowners insurance before closing day" },
      { id: "close-utilities", label: "Schedule utility transfers and mailbox setup" },
      {
        id: "close-warranties",
        label: "Save appliance manuals, warranties, and contractor contacts",
      },
      {
        id: "close-maintenance",
        label: "Budget for first-year maintenance and seasonal upkeep",
      },
    ],
    venuraTip:
      "Closing day is not the end of the financial picture. Set a maintenance reserve from day one — Venura models ~1% of home value annually so surprises don't wreck your budget.",
    tools: [
      { label: "True Cost Calculator", href: "/cost" },
      { label: "Deal Analyzer", href: "/analyzer" },
    ],
  },
];

export const ALL_GUIDE_ITEM_IDS = BUYER_GUIDE_STAGES.flatMap((stage) =>
  stage.items.map((item) => item.id),
);

export const GUIDE_STORAGE_KEY = "venura-buyer-guide-progress";
