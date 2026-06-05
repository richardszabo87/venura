import { createMetro } from "./market-pulse-helpers";

export const NATIONAL_METRO_DATA = [
  createMetro({
    id: "new-york-metro",
    name: "New York Metro",
    region: "NY / NJ / CT",
    usRegion: "northeast",
    zip: "11201",
    investorScore: 68,
    avg2Bed: 3200,
    rentGrowth: 2.1,
    vacancy: 4.2,
    rentControl: {
      title: "NYC rent stabilization on pre-1974 buildings",
      detail:
        "New York City has strict rent stabilization on most pre-1974 buildings. Annual increases are regulated — verify unit coverage before projecting rent growth.",
    },
    climate: {
      title: "Coastal flood and hurricane surge risk",
      detail:
        "Waterfront and low-lying parcels in Brooklyn, Queens, and NJ face FEMA flood zones. Budget flood insurance for ground-floor and basement units.",
    },
    zips: [
      { zip: "11201", neighborhood: "Brooklyn Heights", investorScore: 65, averageRent: 3400 },
      { zip: "11211", neighborhood: "Williamsburg", investorScore: 68, averageRent: 3350 },
      { zip: "10025", neighborhood: "Upper West Side", investorScore: 62, averageRent: 3600 },
      { zip: "11372", neighborhood: "Jackson Heights", investorScore: 74, averageRent: 2800 },
      { zip: "10451", neighborhood: "South Bronx", investorScore: 76, averageRent: 2600 },
      { zip: "07030", neighborhood: "Hoboken NJ", investorScore: 70, averageRent: 3300 },
    ],
    bullish: [
      "Global financial hub drives premium rents and deep tenant pools.",
      "Outer boroughs and NJ suburbs offer the best cash-flow spreads.",
    ],
    bearish: [
      "Strict rent control limits investor returns on stabilized units.",
      "High property taxes reduce net returns after debt service.",
    ],
    neutral: [
      "Manhattan and brownstone Brooklyn prioritize appreciation over yield.",
    ],
  }),
  createMetro({
    id: "los-angeles-metro",
    name: "Los Angeles Metro",
    region: "LA / OC / IE",
    usRegion: "west-coast",
    zip: "90011",
    investorScore: 62,
    avg2Bed: 2950,
    rentGrowth: 1.8,
    vacancy: 5.1,
    rentControl: {
      title: "LA city rent stabilization on pre-1978 units",
      detail:
        "City of Los Angeles rent stabilization applies to most pre-1978 multifamily units. AB 1482 statewide caps also affect many properties — confirm coverage.",
    },
    climate: {
      title: "Wildfire and earthquake insurance costs",
      detail:
        "Southern California faces wildfire smoke, mudslide, and earthquake risk. Insurance premiums rose sharply — model as a primary expense line.",
    },
    zips: [
      { zip: "90011", neighborhood: "South LA", investorScore: 72, averageRent: 2400 },
      { zip: "90044", neighborhood: "Hyde Park", investorScore: 70, averageRent: 2350 },
      { zip: "90247", neighborhood: "Gardena", investorScore: 68, averageRent: 2550 },
      { zip: "92801", neighborhood: "Anaheim", investorScore: 66, averageRent: 2700 },
      { zip: "91710", neighborhood: "Chino", investorScore: 74, averageRent: 2300 },
      { zip: "92374", neighborhood: "Redlands", investorScore: 76, averageRent: 2100 },
    ],
    bullish: [
      "World-class long-term appreciation in supply-constrained coastal markets.",
      "Inland Empire offers the best investor cash-flow entry points.",
    ],
    bearish: [
      "Rent control limits cash-flow upside on older LA city stock.",
      "High insurance and property tax costs compress net operating income.",
    ],
    neutral: [
      "OC condos trade appreciation for thinner yields — match strategy to submarket.",
    ],
  }),
  createMetro({
    id: "boston-metro",
    name: "Boston Metro",
    region: "MA / NH",
    usRegion: "northeast",
    zip: "02119",
    investorScore: 71,
    avg2Bed: 2800,
    rentGrowth: 3.4,
    vacancy: 3.8,
    rentControl: null,
    climate: {
      title: "Winter weather and freeze damage risk",
      detail:
        "New England winters drive heating costs and pipe-freeze claims. Budget for snow removal and boiler maintenance in older triple-deckers.",
    },
    zips: [
      { zip: "02119", neighborhood: "Roxbury", investorScore: 74, averageRent: 2650 },
      { zip: "02121", neighborhood: "Dorchester", investorScore: 76, averageRent: 2600 },
      { zip: "02124", neighborhood: "Dorchester South", investorScore: 75, averageRent: 2550 },
      { zip: "02125", neighborhood: "Columbia Point", investorScore: 72, averageRent: 2700 },
      { zip: "02127", neighborhood: "South Boston", investorScore: 68, averageRent: 3100 },
      { zip: "02128", neighborhood: "East Boston", investorScore: 70, averageRent: 2900 },
    ],
    bullish: [
      "World-class universities drive year-round rental demand.",
      "No rent control in most Massachusetts municipalities.",
      "Strong appreciation in revitalizing Dorchester corridors.",
    ],
    bearish: [
      "High entry prices compress cash-on-cash returns.",
      "Older housing stock can require significant capex reserves.",
    ],
    neutral: [
      "Triple-deckers remain the classic Boston cash-flow play — verify unit legality.",
    ],
  }),
  createMetro({
    id: "chicago-metro",
    name: "Chicago Metro",
    region: "IL / IN",
    usRegion: "midwest",
    zip: "60608",
    investorScore: 66,
    avg2Bed: 1850,
    rentGrowth: 2.8,
    vacancy: 5.6,
    rentControl: null,
    climate: {
      title: "Freeze and lake-effect weather exposure",
      detail:
        "Chicago winters increase utility costs and maintenance on flat roofs and older masonry buildings.",
    },
    zips: [
      { zip: "60608", neighborhood: "Pilsen", investorScore: 70, averageRent: 1950 },
      { zip: "60609", neighborhood: "Back of the Yards", investorScore: 72, averageRent: 1750 },
      { zip: "60619", neighborhood: "Chatham", investorScore: 68, averageRent: 1800 },
      { zip: "60628", neighborhood: "Roseland", investorScore: 71, averageRent: 1650 },
      { zip: "60651", neighborhood: "Humboldt Park", investorScore: 69, averageRent: 1900 },
      { zip: "60707", neighborhood: "Elmwood Park", investorScore: 67, averageRent: 1850 },
    ],
    bullish: [
      "Best cash-flow profile among major Midwest metros.",
      "Illinois state law prohibits rent control — landlords retain pricing flexibility.",
    ],
    bearish: [
      "High Cook County property taxes eat into returns.",
      "Neighborhood selection is critical — block-level research required.",
    ],
    neutral: [
      "Two- to four-unit buildings remain the core Chicago investor strategy.",
    ],
  }),
  createMetro({
    id: "houston-metro",
    name: "Houston Metro",
    region: "TX",
    usRegion: "southwest",
    zip: "77007",
    investorScore: 77,
    avg2Bed: 1450,
    rentGrowth: 2.2,
    vacancy: 7.1,
    rentControl: null,
    climate: {
      title: "Hurricane and flood insurance exposure",
      detail:
        "Gulf Coast hurricanes and Harvey-era flood zones affect many submarkets. Verify FEMA maps and windstorm coverage costs before closing.",
    },
    zips: [
      { zip: "77007", neighborhood: "Heights", investorScore: 74, averageRent: 1650 },
      { zip: "77008", neighborhood: "Garden Oaks", investorScore: 73, averageRent: 1550 },
      { zip: "77009", neighborhood: "Northside", investorScore: 76, averageRent: 1400 },
      { zip: "77051", neighborhood: "South Houston", investorScore: 78, averageRent: 1250 },
      { zip: "77085", neighborhood: "Westbury", investorScore: 77, averageRent: 1300 },
      { zip: "77016", neighborhood: "Kashmere Gardens", investorScore: 79, averageRent: 1200 },
    ],
    bullish: [
      "No state income tax boosts landlord after-tax returns.",
      "No zoning laws create development flexibility rare in coastal metros.",
      "Energy sector employment supports baseline rental demand.",
    ],
    bearish: [
      "Elevated vacancy from new apartment construction pipeline.",
      "Flood insurance can surprise first-time Texas investors.",
    ],
    neutral: [
      "SFR in Inner Loop neighborhoods trades yield for appreciation.",
    ],
  }),
  createMetro({
    id: "philadelphia-metro",
    name: "Philadelphia Metro",
    region: "PA / NJ / DE",
    usRegion: "northeast",
    zip: "19121",
    investorScore: 74,
    avg2Bed: 1650,
    rentGrowth: 3.8,
    vacancy: 4.9,
    rentControl: null,
    climate: null,
    zips: [
      { zip: "19121", neighborhood: "Brewerytown", investorScore: 76, averageRent: 1700 },
      { zip: "19132", neighborhood: "Strawberry Mansion", investorScore: 75, averageRent: 1550 },
      { zip: "19134", neighborhood: "Port Richmond", investorScore: 77, averageRent: 1600 },
      { zip: "19140", neighborhood: "Nicetown", investorScore: 74, averageRent: 1500 },
      { zip: "19143", neighborhood: "Squirrel Hill West", investorScore: 73, averageRent: 1650 },
      { zip: "19148", neighborhood: "South Philly", investorScore: 72, averageRent: 1750 },
    ],
    bullish: [
      "Best value major East Coast city with lower basis than NYC or Boston.",
      "University City and hospital employment anchor tenant demand.",
      "Strong appreciation in gentrifying North and West Philly corridors.",
      "Pennsylvania has no rent control.",
    ],
    bearish: [
      "Property tax reassessments can shift quickly after renovation.",
    ],
    neutral: [
      "Rowhouse density supports multi-unit conversions — verify zoning.",
    ],
  }),
  createMetro({
    id: "dallas-metro",
    name: "Dallas Metro",
    region: "TX",
    usRegion: "southwest",
    zip: "75208",
    investorScore: 72,
    avg2Bed: 1550,
    rentGrowth: 1.4,
    vacancy: 8.2,
    rentControl: null,
    climate: {
      title: "Hail and severe storm insurance costs",
      detail:
        "North Texas hailstorms drive rising roof and auto claims — landlord insurance premiums reflect storm frequency.",
    },
    zips: [
      { zip: "75208", neighborhood: "Oak Cliff", investorScore: 74, averageRent: 1500 },
      { zip: "75211", neighborhood: "West Dallas", investorScore: 76, averageRent: 1400 },
      { zip: "75216", neighborhood: "South Dallas", investorScore: 75, averageRent: 1350 },
      { zip: "75217", neighborhood: "Pleasant Grove", investorScore: 77, averageRent: 1300 },
      { zip: "75227", neighborhood: "Mesquite", investorScore: 73, averageRent: 1450 },
      { zip: "75051", neighborhood: "Grand Prairie", investorScore: 71, averageRent: 1500 },
    ],
    bullish: [
      "No state income tax and corporate relocations drive job growth.",
      "Suburban submarkets offer the best risk-adjusted investor opportunities.",
    ],
    bearish: [
      "Oversupply warning — 8.2% vacancy is elevated for a major metro.",
      "Rent growth has cooled from 2022 peaks.",
    ],
    neutral: [
      "Dallas-Fort Worth sprawl rewards car-dependent SFR strategies.",
    ],
  }),
  createMetro({
    id: "austin-metro",
    name: "Austin Metro",
    region: "TX",
    usRegion: "southwest",
    zip: "78702",
    investorScore: 61,
    avg2Bed: 1820,
    rentGrowth: 0.8,
    vacancy: 8.2,
    rentControl: null,
    climate: {
      title: "Extreme heat and power-grid stress",
      detail:
        "Central Texas summers strain HVAC systems and utility grids. Budget for AC maintenance and consider backup power for multi-family.",
    },
    zips: [
      { zip: "78702", neighborhood: "East Austin", investorScore: 68, averageRent: 1900 },
      { zip: "78721", neighborhood: "MLK", investorScore: 70, averageRent: 1750 },
      { zip: "78741", neighborhood: "Southeast Austin", investorScore: 72, averageRent: 1650 },
      { zip: "78744", neighborhood: "Slaughter Lane", investorScore: 74, averageRent: 1600 },
      { zip: "78745", neighborhood: "South Congress", investorScore: 66, averageRent: 1850 },
      { zip: "78752", neighborhood: "North Loop", investorScore: 65, averageRent: 1800 },
    ],
    bullish: [
      "Tech sector employment remains a long-term demand driver.",
      "East Austin still offers value-add upside after correction.",
    ],
    bearish: [
      "Significant oversupply — 40,000+ units delivered 2023–2024.",
      "Rents flat to declining in many submarkets.",
      "Better near-term opportunity in Dallas or Houston right now.",
    ],
    neutral: [
      "Wait for absorption before deploying new capital at scale.",
    ],
  }),
  createMetro({
    id: "san-jose-metro",
    name: "San Jose Metro",
    region: "Silicon Valley, CA",
    usRegion: "west-coast",
    zip: "95112",
    investorScore: 64,
    avg2Bed: 3100,
    rentGrowth: 2.6,
    vacancy: 4.8,
    rentControl: {
      title: "San Jose rent control on pre-1979 units",
      detail:
        "San Jose limits annual rent increases on covered pre-1979 rental units. Confirm building age and exemption status before underwriting.",
    },
    climate: {
      title: "Wildfire smoke and earthquake risk",
      detail:
        "Bay Area wildfire seasons affect air quality and insurance. Seismic retrofit costs apply to many older buildings.",
    },
    zips: [
      { zip: "95112", neighborhood: "Downtown SJ", investorScore: 62, averageRent: 3000 },
      { zip: "95116", neighborhood: "Alum Rock", investorScore: 70, averageRent: 2800 },
      { zip: "95122", neighborhood: "East San Jose", investorScore: 72, averageRent: 2750 },
      { zip: "95127", neighborhood: "Hillview", investorScore: 68, averageRent: 2850 },
      { zip: "95128", neighborhood: "West San Jose", investorScore: 60, averageRent: 3200 },
      { zip: "95148", neighborhood: "East Foothills", investorScore: 66, averageRent: 2900 },
    ],
    bullish: [
      "Highest-paying tech jobs globally support premium rent tiers.",
      "East San Jose offers the best cash-flow spreads in the valley.",
    ],
    bearish: [
      "Rent control limits flexibility on older buildings.",
      "Very high entry prices — $800K+ average limits cash-on-cash.",
    ],
    neutral: [
      "ADU strategies increasingly common — verify local permitting.",
    ],
  }),
  createMetro({
    id: "san-francisco-metro",
    name: "San Francisco Metro",
    region: "SF / East Bay / Peninsula",
    usRegion: "west-coast",
    zip: "94103",
    investorScore: 58,
    avg2Bed: 3400,
    rentGrowth: 1.2,
    vacancy: 6.8,
    rentControl: {
      title: "Strictest rent control in the US",
      detail:
        "Pre-1979 buildings in SF and many East Bay cities are heavily regulated. Annual allowable increases are limited — model conservative rent growth.",
    },
    climate: {
      title: "Earthquake retrofit and fire insurance",
      detail:
        "Soft-story retrofit mandates and wildfire-driven insurance costs affect total ownership expense in the Bay Area.",
    },
    zips: [
      { zip: "94103", neighborhood: "SoMa", investorScore: 55, averageRent: 3500 },
      { zip: "94110", neighborhood: "Mission District", investorScore: 58, averageRent: 3300 },
      { zip: "94112", neighborhood: "Excelsior", investorScore: 62, averageRent: 3100 },
      { zip: "94134", neighborhood: "Visitacion Valley", investorScore: 64, averageRent: 2950 },
      { zip: "94601", neighborhood: "Oakland Fruitvale", investorScore: 68, averageRent: 2800 },
      { zip: "94603", neighborhood: "East Oakland", investorScore: 70, averageRent: 2600 },
    ],
    bullish: [
      "Oakland and East Bay submarkets offer better investor math than SF proper.",
      "Long-term tech employment supports rental demand recovery.",
    ],
    bearish: [
      "Strongest rent control in the US limits investor returns.",
      "Elevated vacancy from remote-work population shifts.",
      "Entry prices remain extremely high in core SF.",
    ],
    neutral: [
      "Focus on exempt newer construction or East Bay cash-flow plays.",
    ],
  }),
  createMetro({
    id: "seattle-metro",
    name: "Seattle Metro",
    region: "WA",
    usRegion: "west-coast",
    zip: "98108",
    investorScore: 69,
    avg2Bed: 2200,
    rentGrowth: 2.9,
    vacancy: 5.4,
    rentControl: null,
    climate: {
      title: "Rain and moisture maintenance costs",
      detail:
        "Pacific Northwest moisture drives roof, siding, and mold remediation costs. Budget reserves for drainage and waterproofing.",
    },
    zips: [
      { zip: "98108", neighborhood: "Georgetown", investorScore: 72, averageRent: 2100 },
      { zip: "98118", neighborhood: "Rainier Valley", investorScore: 74, averageRent: 2050 },
      { zip: "98125", neighborhood: "Lake City", investorScore: 70, averageRent: 2150 },
      { zip: "98133", neighborhood: "Shoreline", investorScore: 68, averageRent: 2200 },
      { zip: "98178", neighborhood: "Skyway", investorScore: 73, averageRent: 2000 },
      { zip: "98032", neighborhood: "Kent", investorScore: 76, averageRent: 1950 },
    ],
    bullish: [
      "No state income tax and no rent control statewide.",
      "Amazon and tech sector drive strong employment demand.",
      "South Seattle and Kent suburbs offer the best investor cash flow.",
    ],
    bearish: [
      "New apartment supply moderating rent growth in core Seattle.",
    ],
    neutral: [
      "Seattle proper favors appreciation; suburbs favor yield.",
    ],
  }),
  createMetro({
    id: "denver-metro",
    name: "Denver Metro",
    region: "CO",
    usRegion: "southwest",
    zip: "80203",
    investorScore: 65,
    avg2Bed: 1950,
    rentGrowth: 2.1,
    vacancy: 6.8,
    rentControl: {
      title: "Denver rent control capped at 3% annually",
      detail:
        "Denver enacted rent control in 2023 limiting annual increases to 3% on covered units. Verify whether a property qualifies for exemptions.",
    },
    climate: {
      title: "Hail and altitude weather extremes",
      detail:
        "Colorado hail drives insurance claims. Altitude and freeze-thaw cycles increase exterior maintenance costs.",
    },
    zips: [
      { zip: "80203", neighborhood: "Capitol Hill", investorScore: 63, averageRent: 2000 },
      { zip: "80204", neighborhood: "West Colfax", investorScore: 68, averageRent: 1850 },
      { zip: "80205", neighborhood: "Five Points", investorScore: 66, averageRent: 1900 },
      { zip: "80210", neighborhood: "University Hills", investorScore: 64, averageRent: 1950 },
      { zip: "80219", neighborhood: "Harvey Park", investorScore: 70, averageRent: 1800 },
      { zip: "80223", neighborhood: "Overland", investorScore: 69, averageRent: 1820 },
    ],
    bullish: [
      "Strong long-term appreciation from lifestyle-driven migration.",
      "Outdoor recreation economy supports tenant retention.",
    ],
    bearish: [
      "Rent control enacted 2023 caps increases at 3%.",
      "Cash flow tight at current price points.",
    ],
    neutral: [
      "Aurora and Adams County suburbs may offer better spreads than Denver proper.",
    ],
  }),
  createMetro({
    id: "el-paso-metro",
    name: "El Paso Metro",
    region: "TX / NM",
    usRegion: "southwest",
    zip: "79901",
    investorScore: 76,
    avg2Bed: 1100,
    rentGrowth: 4.1,
    vacancy: 4.2,
    rentControl: null,
    climate: {
      title: "Desert heat and border-market dynamics",
      detail:
        "Extreme summer heat increases cooling costs. Understand cross-border employment dynamics when underwriting tenant demand.",
    },
    zips: [
      { zip: "79901", neighborhood: "Downtown EP", investorScore: 72, averageRent: 1050 },
      { zip: "79902", neighborhood: "Kern Place", investorScore: 70, averageRent: 1150 },
      { zip: "79903", neighborhood: "Northeast EP", investorScore: 74, averageRent: 1080 },
      { zip: "79904", neighborhood: "Fort Bliss area", investorScore: 78, averageRent: 1020 },
      { zip: "79907", neighborhood: "Lower Valley", investorScore: 77, averageRent: 1000 },
      { zip: "79912", neighborhood: "West El Paso", investorScore: 75, averageRent: 1120 },
    ],
    bullish: [
      "Most affordable major US city with strong cash-on-cash potential.",
      "Fort Bliss military base creates massive stable tenant demand.",
      "4.1% rent growth is strong for this price point.",
      "Hidden gem for cash-flow-focused investors.",
    ],
    bearish: [
      "Appreciation historically trails national coastal markets.",
    ],
    neutral: [
      "Lower liquidity — plan longer hold periods for exit.",
    ],
  }),
  createMetro({
    id: "detroit-metro",
    name: "Detroit Metro",
    region: "MI",
    usRegion: "midwest",
    zip: "48201",
    investorScore: 70,
    avg2Bed: 1050,
    rentGrowth: 5.2,
    vacancy: 5.8,
    rentControl: null,
    climate: {
      title: "Winter freeze and legacy infrastructure",
      detail:
        "Detroit winters and aging water/sewer infrastructure can drive unexpected capex. Inspect basements and plumbing carefully.",
    },
    zips: [
      { zip: "48201", neighborhood: "Midtown", investorScore: 68, averageRent: 1200 },
      { zip: "48202", neighborhood: "New Center", investorScore: 70, averageRent: 1150 },
      { zip: "48205", neighborhood: "East English Village", investorScore: 74, averageRent: 1000 },
      { zip: "48207", neighborhood: "Lafayette Park", investorScore: 69, averageRent: 1180 },
      { zip: "48214", neighborhood: "Jefferson Chalmers", investorScore: 72, averageRent: 1050 },
      { zip: "48227", neighborhood: "Grandmont Rosedale", investorScore: 73, averageRent: 1020 },
    ],
    bullish: [
      "Highest cash-on-cash returns among major US cities at current basis.",
      "Renaissance Zone revitalization driving appreciation in core areas.",
      "Ford and GM tech investment creating new employment corridors.",
    ],
    bearish: [
      "Neighborhood selection critical — research vacancy and crime block-by-block.",
      "Legacy title and tax auction properties carry due-diligence risk.",
    ],
    neutral: [
      "Section 8 demand is strong — factor payment timeliness in screening.",
    ],
  }),
  createMetro({
    id: "las-vegas-metro",
    name: "Las Vegas Metro",
    region: "NV",
    usRegion: "southwest",
    zip: "89101",
    investorScore: 73,
    avg2Bed: 1650,
    rentGrowth: 3.2,
    vacancy: 5.9,
    rentControl: null,
    climate: {
      title: "Extreme desert heat and water constraints",
      detail:
        "Las Vegas summers exceed 110°F regularly. Pool maintenance, AC replacement, and rising water rates affect NOI on SFR portfolios.",
    },
    zips: [
      { zip: "89101", neighborhood: "Downtown LV", investorScore: 70, averageRent: 1550 },
      { zip: "89104", neighborhood: "East LV", investorScore: 74, averageRent: 1500 },
      { zip: "89107", neighborhood: "West LV", investorScore: 73, averageRent: 1520 },
      { zip: "89108", neighborhood: "Northwest LV", investorScore: 72, averageRent: 1580 },
      { zip: "89110", neighborhood: "Northeast LV", investorScore: 75, averageRent: 1480 },
      { zip: "89115", neighborhood: "North LV", investorScore: 76, averageRent: 1450 },
    ],
    bullish: [
      "No state income tax boosts landlord after-tax returns.",
      "Strong tourism and hospitality employment base.",
      "Raiders, Golden Knights, and F1 circuit diversifying the economy.",
      "Market diversifying beyond casino dependency.",
    ],
    bearish: [
      "Tourism downturns can spike vacancy in short-term corridors.",
    ],
    neutral: [
      "Henderson and Summerlin trade yield for school-district premiums.",
    ],
  }),
  createMetro({
    id: "portland-metro",
    name: "Portland Metro",
    region: "OR / WA",
    usRegion: "west-coast",
    zip: "97202",
    investorScore: 63,
    avg2Bed: 1750,
    rentGrowth: 1.8,
    vacancy: 6.4,
    rentControl: {
      title: "Oregon statewide rent control",
      detail:
        "Oregon caps annual rent increases at 7% or CPI+3% (whichever is lower) on most residential units. Factor capped growth into projections.",
    },
    climate: {
      title: "Wildfire smoke and seismic risk",
      detail:
        "Willamette Valley wildfire seasons affect air quality. Cascadia subduction zone seismic risk applies to older unreinforced buildings.",
    },
    zips: [
      { zip: "97202", neighborhood: "Sellwood", investorScore: 65, averageRent: 1800 },
      { zip: "97206", neighborhood: "Foster Powell", investorScore: 68, averageRent: 1720 },
      { zip: "97211", neighborhood: "Concordia", investorScore: 66, averageRent: 1750 },
      { zip: "97212", neighborhood: "Irvington", investorScore: 62, averageRent: 1850 },
      { zip: "97213", neighborhood: "Hollywood", investorScore: 64, averageRent: 1780 },
      { zip: "97214", neighborhood: "Buckman", investorScore: 63, averageRent: 1820 },
    ],
    bullish: [
      "Strong tech and outdoor-industry employment supports tenant demand.",
      "Beautiful city continues to attract domestic migration.",
    ],
    bearish: [
      "Oregon statewide rent control limits annual increase flexibility.",
      "Cash flow tight at current Portland price points.",
      "Vancouver WA (no income tax) is a better alternative across the river.",
    ],
    neutral: [
      "Multnomah County investor regulations evolving — stay current on compliance.",
    ],
  }),
];
