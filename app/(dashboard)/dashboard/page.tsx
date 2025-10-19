"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { PortfolioData, FlowData } from "@/lib/types"
import { PortfolioChart } from "@/components/portfolio-chart"
import { FlowChart } from "@/components/flow-chart"
import { TokensTable } from "@/components/tokens-table"
import { LoadingKPI, LoadingChart, LoadingTable } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"

export default function DashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [flowData, setFlowData] = useState<FlowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("30d")

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [portfolioRes, flowRes] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/flows")
      ])

      if (!portfolioRes.ok || !flowRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const portfolio = await portfolioRes.json()
      const flows = await flowRes.json()

      setPortfolioData(portfolio)
      setFlowData(flows)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter history based on time range
  const getFilteredHistory = () => {
    if (!portfolioData) return []
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    return portfolioData.history.slice(-days)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your asset flows and portfolio performance
          </p>
        </div>
        <ErrorState
          title="Failed to load dashboard"
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your asset flows and portfolio performance
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Time Range Tabs */}
      <div className="flex gap-2">
        {(["24h", "7d", "30d", "all"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {range === "all" ? "All Time" : range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
            <LoadingKPI />
            <LoadingKPI />
            <LoadingKPI />
          </>
        ) : portfolioData ? (
          <>
            <StatCard
              title="Total Assets"
              value={
                `$${portfolioData.totalAssets.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              }
              icon={TrendingUp}
            />

            <StatCard
              title="PnL (24h)"
              value={
                `${portfolioData.pnl24h >= 0 ? "+" : ""}$${portfolioData.pnl24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              }
              icon={portfolioData.pnl24h >= 0 ? TrendingUp : TrendingDown}
              change={{
                value: Number(((portfolioData.pnl24h / portfolioData.totalAssets) * 100).toFixed(2)),
                label: "change",
              }}
            />

            <StatCard
              title="Net Flow (7d)"
              value={
                `${portfolioData.netflow7d >= 0 ? "+" : ""}$${portfolioData.netflow7d.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              }
              icon={portfolioData.netflow7d >= 0 ? TrendingUp : TrendingDown}
            />
          </>
        ) : null}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <>
            <LoadingChart />
            <LoadingChart />
          </>
        ) : portfolioData && flowData ? (
          <>
            <div className="card p-6">
              <PortfolioChart data={getFilteredHistory()} />
            </div>
            <div className="card p-6">
              <FlowChart data={flowData.byChain} />
            </div>
          </>
        ) : null}
      </div>

      {/* Top Tokens Table */}
      {loading ? (
        <LoadingTable />
      ) : portfolioData ? (
        <TokensTable tokens={portfolioData.topTokens} />
      ) : null}
    </div>
  )
}
