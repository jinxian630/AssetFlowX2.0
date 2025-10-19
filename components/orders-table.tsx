"use client"

// ============================================================================
// AssetFlowX - OrdersTable Component
// Sortable table for orders list
// ============================================================================

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ExplorerText } from "@/components/ui/explorer-link"
import { CopyButton } from "@/components/ui/copy-button"
import { formatCurrency } from "@/lib/number"
import { formatRelativeTime } from "@/lib/date"
import { getCourseById } from "@/lib/payments-mock-store"
import { ArrowUpDown } from "lucide-react"
import type { Order } from "@/types/payments"

interface OrdersTableProps {
  orders: Order[]
  onOrderClick: (order: Order) => void
  onReleaseSettlement?: (orderId: string) => void
  isReleasingSettlement?: string | null
}

export function OrdersTable({
  orders,
  onOrderClick,
  onReleaseSettlement,
  isReleasingSettlement,
}: OrdersTableProps) {
  const [sortField, setSortField] = useState<keyof Order>("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Order) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return 0
  })

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort("id")}>
                Order ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Course</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort("token")}>
                Payment
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Chain</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort("status")}>
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort("updatedAt")}>
                Updated
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => {
            const course = getCourseById(order.courseId)
            const canReleaseSettlement = order.status === "PAID"
            const isReleasing = isReleasingSettlement === order.id

            return (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onOrderClick(order)}
              >
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="max-w-[120px] truncate" title={order.id}>
                      {order.id}
                    </span>
                    <CopyButton text={order.id} size="sm" />
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  {course?.name || order.courseId}
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatCurrency(order.price)}
                    </div>
                    <div className="text-muted-foreground">{order.token}</div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {order.chain}
                  </span>
                </TableCell>

                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>

                <TableCell>
                  {order.onchainTx ? (
                    <ExplorerText
                      txHash={order.onchainTx}
                      chain={order.chain}
                      truncate
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {formatRelativeTime(order.updatedAt)}
                </TableCell>

                <TableCell className="text-right">
                  {canReleaseSettlement && onReleaseSettlement && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onReleaseSettlement(order.id)
                      }}
                      disabled={isReleasing}
                    >
                      {isReleasing ? "Releasing..." : "Release"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
