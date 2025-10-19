"use client"

// ============================================================================
// AssetFlowX - Payments Dashboard
// Phase 5: KPIs, charts, and recent activity
// ============================================================================

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeading } from "@/components/ui/page-heading"
import { RangeTabs, type TimeRange } from "@/components/range-tabs"
import { KpiCard } from "@/components/kpi-card"
import { OrdersLineChart } from "@/components/orders-line-chart"
import { FlowsBarChart } from "@/components/flows-bar-chart"
import { RecentOrdersWidget } from "@/components/recent-orders-widget"
import { RecentCredentialsWidget } from "@/components/recent-credentials-widget"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { DollarSign, ShoppingBag, Clock } from "lucide-react"
import type { Order, CredentialSummary } from "@/types/payments"

function DashboardContent() {
  const searchParams = useSearchParams()
  const [range, setRange] = useState<TimeRange>(
    (searchParams.get("range") as TimeRange) || "7d"
  )
  const [orders, setOrders] = useState<Order[]>([])
  const [credentials, setCredentials] = useState<CredentialSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Fetch orders with high limit to get all for client-side filtering
      const ordersResponse = await api.orders.list({ limit: 1000 })
      setOrders(ordersResponse.data)

      // Fetch credentials
      const credentialsResponse = await api.credentials.list({ limit: 100 })
      setCredentials(credentialsResponse.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter orders by range
  const filteredOrders = filterOrdersByRange(orders, range)

  // Compute KPIs
  const kpis = computeKPIs(filteredOrders)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Payments Dashboard"
          description="Analytics and insights for payment orders and credentials"
        />
        <RangeTabs value={range} onValueChange={setRange} />
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </>
        ) : (
          <>
            <KpiCard
              label="Total Sales"
              value={`$${kpis.totalSales.toLocaleString()}`}
              icon={DollarSign}
              delta={kpis.salesDelta}
            />
            <KpiCard
              label="24h Orders"
              value={kpis.orders24h.toString()}
              icon={ShoppingBag}
              delta={kpis.ordersDelta}
            />
            <KpiCard
              label="Pending Settlements"
              value={kpis.pendingSettlements.toString()}
              icon={Clock}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </>
        ) : (
          <>
            <OrdersLineChart orders={filteredOrders} range={range} />
            <FlowsBarChart orders={filteredOrders} />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </>
        ) : (
          <>
            <RecentOrdersWidget orders={orders} maxRows={8} />
            <RecentCredentialsWidget credentials={credentials} maxItems={6} />
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

function filterOrdersByRange(orders: Order[], range: TimeRange): Order[] {
  const now = new Date()
  const cutoff = new Date()

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
      return orders
  }

  return orders.filter((order) => new Date(order.createdAt) >= cutoff)
}

function computeKPIs(orders: Order[]) {
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Total Sales: sum of orders with status PAID, SETTLED, or REFUNDED
  const totalSales = orders
    .filter((o) => ["PAID", "SETTLED", "REFUNDED"].includes(o.status))
    .reduce((sum, o) => sum + parseFloat(o.price), 0)

  // Previous period sales for delta
  const previousPeriodSales = orders
    .filter(
      (o) =>
        ["PAID", "SETTLED", "REFUNDED"].includes(o.status) &&
        new Date(o.createdAt) < lastWeek
    )
    .reduce((sum, o) => sum + parseFloat(o.price), 0)

  const salesDelta =
    previousPeriodSales > 0
      ? {
          value: ((totalSales - previousPeriodSales) / previousPeriodSales) * 100,
          label: "vs last period",
        }
      : undefined

  // 24h Orders: count of orders created in last 24 hours
  const orders24h = orders.filter((o) => new Date(o.createdAt) >= yesterday).length

  // Previous 24h for delta
  const twoDaysAgo = new Date(yesterday.getTime() - 24 * 60 * 60 * 1000)
  const previousOrders24h = orders.filter(
    (o) => new Date(o.createdAt) >= twoDaysAgo && new Date(o.createdAt) < yesterday
  ).length

  const ordersDelta =
    previousOrders24h > 0
      ? {
          value: ((orders24h - previousOrders24h) / previousOrders24h) * 100,
          label: "vs previous 24h",
        }
      : undefined

  // Pending Settlements: count of orders with status PAID
  const pendingSettlements = orders.filter((o) => o.status === "PAID").length

  return {
    totalSales,
    salesDelta,
    orders24h,
    ordersDelta,
    pendingSettlements,
  }
}

export default function PaymentsDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )
}
