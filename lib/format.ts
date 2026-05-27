export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyDetailed(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatPercentOneDecimal(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCashFlow(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${formatCurrencyDetailed(value)}/mo`;
}
