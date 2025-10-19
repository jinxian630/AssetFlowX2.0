"use client"

import { Card, AreaChart } from "@tremor/react"
import { colorsNetflow, fmtCurrencyK } from "@/lib/chart-theme"

interface NetflowChartProps {
  data: Array<{ date: string; inflow: number; outflow: number; netflow: number }>
}

export function NetflowChart({ data }: NetflowChartProps) {
  const chartdata = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    "Inflow": item.inflow,
    "Outflow": item.outflow,
    "Net Flow": item.netflow
  }))

  return (
    <Card className="card border-0 shadow-none p-0">
      <h3 className="font-semibold text-lg mb-4">Net Flow Over Time</h3>
      <AreaChart
        className="h-80 [&_.recharts-cartesian-axis-tick-value]:text-xs md:[&_.recharts-cartesian-axis-tick-value]:text-sm"
        data={chartdata}
        index="date"
        categories={["Inflow", "Outflow", "Net Flow"]}
        colors={colorsNetflow as unknown as string[]}
        valueFormatter={fmtCurrencyK}
        yAxisWidth={65}
        showLegend={true}
        showTooltip={true}
        showAnimation={true}
        aria-label="Area chart showing inflow, outflow, and net flow over time"
      />
    </Card>
  )
}
