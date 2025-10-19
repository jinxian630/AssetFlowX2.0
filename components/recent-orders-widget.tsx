"use client"

// ============================================================================
// AssetFlowX - RecentOrdersWidget Component
// Compact table of recent orders (8 rows max)
// ============================================================================

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { CopyButton } from "@/components/ui/copy-button"
import { ExplorerLink } from "@/components/ui/explorer-link"
import { formatDistanceToNow } from "date-fns"
import type { Order } from "@/types/payments"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface RecentOrdersWidgetProps {
  orders: Order[]
  maxRows?: number
}

export function RecentOrdersWidget({ orders, maxRows = 8 }: RecentOrdersWidgetProps) {
  const recent = orders.slice(0, maxRows)

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Latest {maxRows} payment orders
          </p>
        </div>
        <Link
          href="/orders"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          aria-label="View all orders"
        >
          View all
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No recent orders
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Order ID</TableHead>
                <TableHead scope="col">Amount</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Time</TableHead>
                <TableHead scope="col" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[120px]" title={order.id}>
                        {order.id.slice(0, 8)}...
                      </span>
                      <CopyButton text={order.id} label="Order ID" />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {order.price} {order.token}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.onchainTx && (
                      <ExplorerLink
                        txHash={order.onchainTx}
                        chain={order.chain}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
