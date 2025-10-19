"use client"

// ============================================================================
// AssetFlowX - Orders Page
// View and manage all orders with filters and detailed drawer
// ============================================================================

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { OrdersTable } from "@/components/orders-table"
import { OrdersFilters } from "@/components/orders-filters"
import { OrderDrawer } from "@/components/order-drawer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Download, RefreshCw } from "lucide-react"
import type { Order, OrderStatus, TokenType, ChainId } from "@/types/payments"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [releasingSettlement, setReleasingSettlement] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL")
  const [tokenFilter, setTokenFilter] = useState<TokenType | "ALL">("ALL")
  const [chainFilter, setChainFilter] = useState<ChainId | "ALL">("ALL")

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.orders.list()
      setOrders(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...orders]

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }

    if (tokenFilter !== "ALL") {
      filtered = filtered.filter((o) => o.token === tokenFilter)
    }

    if (chainFilter !== "ALL") {
      filtered = filtered.filter((o) => o.chain === chainFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, statusFilter, tokenFilter, chainFilter])

  // Handle release settlement
  const handleReleaseSettlement = async (orderId: string) => {
    try {
      setReleasingSettlement(orderId)
      await api.settlements.release({ orderId })

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "SETTLED" as OrderStatus, updatedAt: new Date().toISOString() }
            : order
        )
      )

      toast.success("Settlement released successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to release settlement"
      toast.error(errorMessage)
    } finally {
      setReleasingSettlement(null)
    }
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Order ID", "Course ID", "User ID", "Chain", "Token", "Price", "Status", "Tx Hash", "Created", "Updated"]
    const rows = filteredOrders.map((order) => [
      order.id,
      order.courseId,
      order.userId,
      order.chain,
      order.token,
      order.price,
      order.status,
      order.onchainTx || "",
      order.createdAt,
      order.updatedAt,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("CSV exported successfully!")
  }

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter("ALL")
    setTokenFilter("ALL")
    setChainFilter("ALL")
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Orders"
        description={`Viewing ${filteredOrders.length} of ${orders.length} orders`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredOrders.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <OrdersFilters
        statusFilter={statusFilter}
        tokenFilter={tokenFilter}
        chainFilter={chainFilter}
        onStatusChange={setStatusFilter}
        onTokenChange={setTokenFilter}
        onChainChange={setChainFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchOrders}>
            Try Again
          </Button>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !error && (
        <OrdersTable
          orders={filteredOrders}
          onOrderClick={setSelectedOrder}
          onReleaseSettlement={handleReleaseSettlement}
          isReleasingSettlement={releasingSettlement}
        />
      )}

      {/* Order Drawer */}
      {selectedOrder && (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
