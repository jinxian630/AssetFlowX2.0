"use client"

// ============================================================================
// AssetFlowX - FlowsBarChart Component
// Stacked bar chart showing token inflow/outflow
// ============================================================================

import { BarChart } from "@tremor/react"
import { colorsBrandFlow, fmtCurrency } from "@/lib/chart-theme"
import type { Order, TokenType } from "@/types/payments"

interface FlowsBarChartProps {
  orders: Order[]
}

interface FlowData {
  token: string
  inflow: number
  outflow: number
}

export function FlowsBarChart({ orders }: FlowsBarChartProps) {
  const data = aggregateFlowsByToken(orders)

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Token Flows</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Inflow vs outflow by token type
        </p>
      </div>

      {data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No token flow data available
        </div>
      ) : (
        <BarChart
          className="h-80 [&_.recharts-cartesian-axis-tick-value]:text-xs md:[&_.recharts-cartesian-axis-tick-value]:text-sm"
          data={data}
          index="token"
          categories={["inflow", "outflow"]}
          colors={colorsBrandFlow as unknown as string[]}
          valueFormatter={fmtCurrency}
          stack={true}
          showLegend={true}
          showTooltip={true}
          showAnimation={true}
          aria-label="Stacked bar chart showing token inflows and outflows"
        />
      )}
    </div>
  )
}

function aggregateFlowsByToken(orders: Order[]): FlowData[] {
  // Handle null/undefined orders
  if (!orders || !Array.isArray(orders)) {
    return []
  }

  const flows = new Map<TokenType, { inflow: number; outflow: number }>()

  orders.forEach((order) => {
    const token = order.token
    const amount = parseFloat(order.price)
    const existing = flows.get(token) || { inflow: 0, outflow: 0 }

    // Simplified logic: PAID/SETTLED = inflow, REFUNDED = outflow
    if (order.status === "PAID" || order.status === "SETTLED") {
      existing.inflow += amount
    } else if (order.status === "REFUNDED") {
      existing.outflow += amount
    }

    flows.set(token, existing)
  })

  // Convert to array
  return Array.from(flows.entries()).map(([token, { inflow, outflow }]) => ({
    token,
    inflow,
    outflow,
  }))
}
