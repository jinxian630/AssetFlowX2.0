"use client"

import { useEffect, useState } from "react"
import { ArrowDownLeft, ArrowUpRight, Minus, RefreshCw, PanelRightOpen } from "lucide-react"
import { FlowData } from "@/lib/types"
import { NetflowChart } from "@/components/netflow-chart"
import { CounterpartiesTable } from "@/components/counterparties-table"
import { LoadingKPI, LoadingChart, LoadingTable } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/components/kpi-card"
import { RangeTabs, type TimeRange } from "@/components/range-tabs"
import { FlowsFilters, type FlowType, type ChainFilter } from "@/components/flows-filters"
import { DeskDrawer } from "@/components/desk-drawer"

export default function FlowsPage() {
  const [flowData, setFlowData] = useState<FlowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deskOpen, setDeskOpen] = useState(false)

  // Filters - default values, RangeTabs and FlowsFilters will sync to URL
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [flowType, setFlowType] = useState<FlowType>("all")
  const [chain, setChain] = useState<ChainFilter>("all")
  const [counterparty, setCounterparty] = useState<string | undefined>(undefined)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/flows")

      if (!response.ok) {
        throw new Error("Failed to fetch flow data")
      }

      const data = await response.json()
      setFlowData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setTimeRange("30d")
    setFlowType("all")
    setChain("all")
    setCounterparty(undefined)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Flows</h1>
          <p className="text-muted-foreground mt-1">
            Track inflows and outflows across all chains and counterparties
          </p>
        </div>
        <ErrorState
          title="Failed to load flow data"
          message={error}
          onRetry={fetchData}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Flows</h1>
          <p className="text-muted-foreground mt-1">
            Track inflows and outflows across all chains and counterparties
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RangeTabs value={timeRange} onValueChange={setTimeRange} />
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            disabled={loading}
            aria-label="Refresh data"
            className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDeskOpen(true)}
            aria-label="Open desk drawer"
            className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4">
        <FlowsFilters
          timeRange={timeRange}
          flowType={flowType}
          chain={chain}
          counterparty={counterparty}
          onTimeRangeChange={setTimeRange}
          onFlowTypeChange={setFlowType}
          onChainChange={setChain}
          onCounterpartyChange={setCounterparty}
          onResetFilters={resetFilters}
        />
      </div>

      {/* Flow KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
            <LoadingKPI />
            <LoadingKPI />
            <LoadingKPI />
          </>
        ) : flowData ? (
          <>
            <KpiCard
              label="Inflow"
              value={`$${flowData.inflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={ArrowDownLeft}
            />
            <KpiCard
              label="Outflow"
              value={`$${flowData.outflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={ArrowUpRight}
            />
            <KpiCard
              label="Net Flow"
              value={`${flowData.netflow >= 0 ? '+' : ''}$${flowData.netflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={flowData.netflow >= 0 ? ArrowDownLeft : Minus}
              delta={{
                value: 12.5,
                label: "vs last period"
              }}
            />
          </>
        ) : null}
      </div>

      {/* Net Flow Chart */}
      {loading ? (
        <LoadingChart />
      ) : flowData ? (
        <div className="card p-6">
          <NetflowChart data={flowData.history} />
        </div>
      ) : null}

      {/* Counterparties Table */}
      {loading ? (
        <LoadingTable />
      ) : flowData ? (
        <CounterpartiesTable counterparties={flowData.counterparties} />
      ) : null}

      {/* Desk Drawer */}
      <DeskDrawer open={deskOpen} onOpenChange={setDeskOpen} />
    </div>
  )
}
