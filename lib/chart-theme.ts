// Centralized chart theming for Tremor/Recharts

export const chartColors = {
  inflow: "emerald",
  outflow: "rose",
  net: "amber",
  primary: "violet",
  secondary: "fuchsia",
} as const

export const colorsFlowByChain = [chartColors.inflow, chartColors.outflow] as const
export const colorsNetflow = [chartColors.inflow, chartColors.outflow, chartColors.net] as const
export const colorsBrandFlow = [chartColors.primary, chartColors.secondary] as const

export const fmtCurrency = (v: number) => `$${v.toLocaleString()}`
export const fmtCurrencyK = (v: number) => `$${(v / 1_000).toFixed(0)}K`
export const fmtCurrencyM = (v: number) => `$${(v / 1_000_000).toFixed(2)}M`

