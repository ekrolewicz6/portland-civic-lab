export const DEFAULTS = {
  medianHomeValue: 581_500,
  medianRent: 1_655,
  renterHouseholds: 139_100,
  neededUnits: 120_560,
  taxRatePerThousand: 26.9449,
  residentialCpr: 0.481,
  multifamilyCpr: 0.472,
  capRate: 0.05,
} as const;

export function fmtMoney(value: number, maximumFractionDigits = 0): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(maximumFractionDigits).replace(/\.0$/, "")}M`;
  }
  return `${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits })}`;
}

export function fmtPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function annualTax(rmv: number, avRatio: number, taxRate: number = DEFAULTS.taxRatePerThousand): number {
  return (rmv * avRatio / 1_000) * taxRate;
}

export function taxBasisScenario({
  rmv,
  legacyRatio,
  corridorRatio,
  cpr = DEFAULTS.residentialCpr,
  taxRate = DEFAULTS.taxRatePerThousand,
  capRate = DEFAULTS.capRate,
}: {
  rmv: number;
  legacyRatio: number;
  corridorRatio: number;
  cpr?: number;
  taxRate?: number;
  capRate?: number;
}) {
  const legacyTax = annualTax(rmv, legacyRatio, taxRate);
  const cprTax = annualTax(rmv, cpr, taxRate);
  const minimumFloorTax = annualTax(rmv, corridorRatio, taxRate);
  const corridorTax = Math.max(legacyTax, minimumFloorTax);
  const fullTax = annualTax(rmv, 1, taxRate);
  const annualAdvantageVsCpr = cprTax - legacyTax;
  const annualIncreaseToCorridor = Math.max(0, minimumFloorTax - legacyTax);

  return {
    legacyTax,
    cprTax,
    corridorTax,
    fullTax,
    annualAdvantageVsCpr,
    capitalizedAdvantageVsCpr: annualAdvantageVsCpr / capRate,
    annualIncreaseToCorridor,
    capitalizedCorridorTransfer: annualIncreaseToCorridor / capRate,
    bars: [
      { name: "Older capped", value: Math.round(legacyTax), fill: "#b85c3a" },
      { name: "New/heavily changed", value: Math.round(cprTax), fill: "#4a7f9e" },
      { name: "Minimum floor package", value: Math.round(corridorTax), fill: "#c8956c" },
      { name: "Full value", value: Math.round(fullTax), fill: "#1a3a2a" },
    ],
  };
}

export function scarcityScenario({
  monthlyRent,
  scarcityPremium,
  households,
}: {
  monthlyRent: number;
  scarcityPremium: number;
  households: number;
}) {
  const annualRent = monthlyRent * 12;
  const perHousehold = annualRent * scarcityPremium;
  const aggregate = perHousehold * households;
  return {
    annualRent,
    perHousehold,
    aggregate,
    rows: [0.05, 0.1, 0.15, 0.2].map((premium) => ({
      premium: fmtPct(premium, 0),
      perHousehold: Math.round(annualRent * premium),
      aggregate: Math.round(annualRent * premium * households),
    })),
  };
}

export function mortgagePayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  return principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
}

export function buyerScarcityScenario({
  homeValue,
  scarcityPremium,
  annualRate = 0.065,
  years = 30,
}: {
  homeValue: number;
  scarcityPremium: number;
  annualRate?: number;
  years?: number;
}) {
  const extraPrincipal = homeValue * scarcityPremium;
  const monthly = mortgagePayment(extraPrincipal, annualRate, years);
  return {
    extraPrincipal,
    monthly,
    annual: monthly * 12,
  };
}

export function projectFeasibility({
  projectCost,
  units,
  carryRate,
  delayMonths,
  sdcPerUnit,
  ihAnnualGap,
  yieldRate,
  annualTaxPerUnit,
}: {
  projectCost: number;
  units: number;
  carryRate: number;
  delayMonths: number;
  sdcPerUnit: number;
  ihAnnualGap: number;
  yieldRate: number;
  annualTaxPerUnit: number;
}) {
  const delayCost = projectCost * carryRate * (delayMonths / 12);
  const delayPerUnit = delayCost / units;
  const ihCapitalizedPerUnit = (ihAnnualGap / DEFAULTS.capRate) / units;
  const oneTimeCostPerUnit = delayPerUnit + sdcPerUnit + ihCapitalizedPerUnit;
  const monthlyThresholdFromOneTime = oneTimeCostPerUnit * yieldRate / 12;
  const monthlyThresholdFromTax = annualTaxPerUnit / 12;
  return {
    delayCost,
    delayPerUnit,
    ihCapitalizedPerUnit,
    oneTimeCostPerUnit,
    monthlyThresholdFromOneTime,
    monthlyThresholdFromTax,
    monthlyThresholdTotal: monthlyThresholdFromOneTime + monthlyThresholdFromTax,
    stack: [
      { name: "Delay", value: Math.round(delayPerUnit), fill: "#b85c3a" },
      { name: "SDC", value: Math.round(sdcPerUnit), fill: "#4a7f9e" },
      { name: "IH gap", value: Math.round(ihCapitalizedPerUnit), fill: "#c8956c" },
    ],
  };
}

export function reformRevenue(additionalAv: number, taxRate: number = DEFAULTS.taxRatePerThousand) {
  const annual = additionalAv / 1_000 * taxRate;
  return {
    annual,
    allocation: [
      { name: "Infrastructure / SDC backfill", value: annual * 0.26, fill: "#4a7f9e" },
      { name: "Tenant Stability Fund", value: annual * 0.22, fill: "#3d7a5a" },
      { name: "Affordable housing gap funding", value: annual * 0.22, fill: "#c8956c" },
      { name: "Permit modernization", value: annual * 0.08, fill: "#7fa88e" },
      { name: "Hardship circuit breaker", value: annual * 0.11, fill: "#64748b" },
      { name: "Public land housing fund", value: annual * 0.11, fill: "#b85c3a" },
    ],
  };
}
