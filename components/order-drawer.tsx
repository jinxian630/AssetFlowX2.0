"use client"

// ============================================================================
// AssetFlowX - OrderDrawer Component
// Slide-out panel for detailed order view
// ============================================================================

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { CopyButton, CopyText } from "@/components/ui/copy-button"
import { ExplorerLink } from "@/components/ui/explorer-link"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, calculateFeeSplit } from "@/lib/number"
import { formatDate } from "@/lib/date"
import { X, Copy } from "lucide-react"
import type { Order } from "@/types/payments"

interface OrderDrawerProps {
  order: Order | null
  onClose: () => void
}

export function OrderDrawer({ order, onClose }: OrderDrawerProps) {
  if (!order) return null

  const { platformFee, instructorShare } = calculateFeeSplit(
    order.price,
    order.platformFeeBps
  )

  const handleCopyAll = () => {
    const orderData = JSON.stringify(order, null, 2)
    navigator.clipboard.writeText(orderData)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Order Details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {order.id}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-2">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <Separator />

          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Information</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground">Course ID</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {order.courseId}
                  </code>
                  <CopyButton text={order.courseId} size="sm" />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground">User ID</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {order.userId}
                  </code>
                  <CopyButton text={order.userId} size="sm" />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground">Chain</label>
                <p className="mt-1 font-medium">{order.chain}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Token</label>
                <p className="mt-1 font-medium">{order.token}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Created</label>
                <p className="mt-1 font-medium">{formatDate(order.createdAt)}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Updated</label>
                <p className="mt-1 font-medium">{formatDate(order.updatedAt)}</p>
              </div>

              {order.expiresAt && (
                <div className="col-span-2">
                  <label className="text-muted-foreground">Expires At</label>
                  <p className="mt-1 font-medium">{formatDate(order.expiresAt)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Breakdown</h3>

            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course Price</span>
                <span className="font-medium">{formatCurrency(order.price)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Platform Fee ({order.platformFeeBps / 100}%)
                </span>
                <span className="font-medium">{formatCurrency(platformFee)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Instructor Share</span>
                <span className="font-medium">{formatCurrency(instructorShare)}</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatCurrency(order.price)}</span>
              </div>
            </div>
          </div>

          {/* Transaction */}
          {order.onchainTx && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Transaction</h3>
                <div className="space-y-2">
                  <CopyText text={order.onchainTx} label="Transaction Hash" truncate={false} />
                  <ExplorerLink
                    txHash={order.onchainTx}
                    chain={order.chain}
                    variant="outline"
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Raw JSON */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Raw Data</h3>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>

            <pre className="rounded-lg border bg-muted p-4 text-xs overflow-auto max-h-96">
              {JSON.stringify(order, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  )
}
