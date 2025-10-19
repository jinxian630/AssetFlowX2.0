"use client"

// ============================================================================
// AssetFlowX - OrdersLineChart Component
// Tremor line chart showing orders over time (count or amount)
// ============================================================================

import { useState } from "react"
import { LineChart } from "@tremor/react"
import { Button } from "@/components/ui/button"
import type { Order } from "@/types/payments"

interface OrdersLineChartProps {
  orders: Order[]
  range: "24h" | "7d" | "30d" | "all"
}

type Metric = "count" | "amount"

interface DataPoint {
  date: string
  count: number
  amount: number
}

export function OrdersLineChart({ orders, range }: OrdersLineChartProps) {
  const [metric, setMetric] = useState<Metric>("count")

  // Aggregate orders by date
  const data = aggregateOrdersByDate(orders, range)

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Orders Over Time</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {metric === "count" ? "Number of orders" : "Total value in USD"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={metric === "count" ? "default" : "outline"}
            size="sm"
            onClick={() => setMetric("count")}
            aria-label="Show order count"
          >
            Count
          </Button>
          <Button
            variant={metric === "amount" ? "default" : "outline"}
            size="sm"
            onClick={() => setMetric("amount")}
            aria-label="Show order amount"
          >
            Amount
          </Button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No order data available
        </div>
      ) : (
        <LineChart
          className="h-80 [&_.recharts-cartesian-axis-tick-value]:text-xs md:[&_.recharts-cartesian-axis-tick-value]:text-sm"
          data={data}
          index="date"
          categories={[metric]}
          colors={["purple"]}
          valueFormatter={(value) =>
            metric === "amount" ? `$${value.toLocaleString()}` : value.toString()
          }
          showLegend={true}
          showTooltip={true}
          showAnimation={true}
          aria-label={`Line chart showing ${metric === "count" ? "order count" : "order amounts"} over time`}
        />
      )}
    </div>
  )
}

function aggregateOrdersByDate(orders: Order[], range: "24h" | "7d" | "30d" | "all"): DataPoint[] {
  // Handle null/undefined orders
  if (!orders || !Array.isArray(orders)) {
    return []
  }

  const now = new Date()
  const cutoff = new Date()

  // Determine date range
  switch (range) {
    case "24h":
      cutoff.setHours(now.getHours() - 24)
      break
    case "7d":
      cutoff.setDate(now.getDate() - 7)
      break
    case "30d":
      cutoff.setDate(now.getDate() - 30)
      break
    case "all":
      cutoff.setFullYear(2000) // All time
      break
  }

  // Filter orders
  const filtered = orders.filter((order) => new Date(order.createdAt) >= cutoff)

  // Group by date
  const grouped = new Map<string, DataPoint>()

  filtered.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0]
    const existing = grouped.get(date) || { date, count: 0, amount: 0 }

    existing.count += 1
    existing.amount += parseFloat(order.price)

    grouped.set(date, existing)
  })

  // Convert to array and sort
  return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date))
}
