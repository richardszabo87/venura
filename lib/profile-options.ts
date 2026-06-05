import { MARKET_PULSE_DATA } from "./market-pulse";
import type {
  BuyerType,
  FinancingType,
  ManagementStyle,
  ProfileGoal,
  ProfileTimeline,
} from "./user-profile";

export const BUYER_TYPE_OPTIONS: { value: BuyerType; label: string }[] = [
  { value: "first_time_buyer", label: "First home buyer" },
  { value: "investor", label: "Real estate investor" },
  { value: "move_up_buyer", label: "Move-up buyer" },
  { value: "all", label: "All" },
];

export const FINANCING_TYPE_OPTIONS: { value: FinancingType; label: string }[] =
  [
    { value: "home_equity", label: "Home equity loan" },
    { value: "conventional", label: "Conventional mortgage" },
    { value: "cash", label: "All cash" },
    { value: "undecided", label: "Still deciding" },
  ];

export const MANAGEMENT_STYLE_OPTIONS: {
  value: ManagementStyle;
  label: string;
}[] = [
  { value: "self", label: "Self-manage" },
  { value: "semi", label: "Semi-involved" },
  { value: "managed", label: "Hire a property manager" },
];

export const PROFILE_GOAL_OPTIONS: { value: ProfileGoal; label: string }[] = [
  { value: "cash_flow", label: "Monthly cash flow" },
  { value: "appreciation", label: "Long-term appreciation" },
  { value: "both", label: "Both equally" },
  { value: "learning", label: "Learning the market" },
  { value: "primary_home", label: "Finding my perfect home" },
];

export const PROFILE_TIMELINE_OPTIONS: {
  value: ProfileTimeline;
  label: string;
}[] = [
  { value: "asap", label: "Ready now" },
  { value: "3months", label: "Within 3 months" },
  { value: "6months", label: "Within 6 months" },
  { value: "1year", label: "Within 1 year" },
  { value: "exploring", label: "Just exploring" },
];

const DC_METRO_MARKETS = [
  "Landover 20785",
  "Hyattsville 20783",
  "Silver Spring 20901",
  "Takoma Park 20912",
  "Bowie 20715",
  "DC Proper",
  "Montgomery County",
  "PG County",
  "Northern Virginia",
  "Baltimore",
  "Atlanta",
  "Miami",
  "Phoenix",
  "Open to anywhere",
];

const PULSE_ZIP_MARKETS = MARKET_PULSE_DATA.flatMap((market) =>
  market.keyZipCodes.map((z) => `${z.neighborhood} ${z.zip}`),
);

const PULSE_METRO_NAMES = MARKET_PULSE_DATA.map((market) => market.name);

export const TARGET_MARKET_OPTIONS = [
  ...new Set([...DC_METRO_MARKETS, ...PULSE_ZIP_MARKETS, ...PULSE_METRO_NAMES]),
].sort((a, b) => a.localeCompare(b));
