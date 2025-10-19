"use client"

import { Card, LineChart } from "@tremor/react"

interface PortfolioChartProps {
  data: Array<{ date: string; value: number }>
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const chartdata = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    "Portfolio Value": item.value
  }))

  return (
    <Card className="card border-0 shadow-none p-0">
      <h3 className="font-semibold text-lg mb-4">Portfolio History</h3>
      <LineChart
        className="h-64"
        data={chartdata}
        index="date"
        categories={["Portfolio Value"]}
        colors={["violet"]}
        valueFormatter={(value) => `$${(value / 1000000).toFixed(2)}M`}
        yAxisWidth={65}
        showAnimation={true}
      />
    </Card>
  )
}
