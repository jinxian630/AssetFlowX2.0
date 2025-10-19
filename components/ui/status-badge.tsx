// ============================================================================
// AssetFlowX - StatusBadge Component
// Status indicators with color mapping
// ============================================================================

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus, CredType } from "@/types/payments"

interface StatusBadgeProps {
  status: OrderStatus | CredType | string
  className?: string
}

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  PENDING: {
    label: "Pending",
    variant: "outline",
    className: "border-yellow-500 text-yellow-700 dark:text-yellow-400",
  },
  EXPIRED: {
    label: "Expired",
    variant: "outline",
    className: "border-gray-500 text-gray-700 dark:text-gray-400",
  },
  PAID: {
    label: "Paid",
    variant: "outline",
    className: "border-blue-500 text-blue-700 dark:text-blue-400",
  },
  SETTLED: {
    label: "Settled",
    variant: "outline",
    className: "border-green-500 text-green-700 dark:text-green-400",
  },
  REFUNDED: {
    label: "Refunded",
    variant: "outline",
    className: "border-red-500 text-red-700 dark:text-red-400",
  },
}

const credTypeConfig: Record<
  CredType,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  OPEN_BADGE: {
    label: "OpenBadge",
    variant: "outline",
    className: "border-purple-500 text-purple-700 dark:text-purple-400",
  },
  VC: {
    label: "VC",
    variant: "outline",
    className: "border-indigo-500 text-indigo-700 dark:text-indigo-400",
  },
  ERC1155: {
    label: "ERC-1155",
    variant: "outline",
    className: "border-cyan-500 text-cyan-700 dark:text-cyan-400",
  },
  SBT: {
    label: "SBT",
    variant: "outline",
    className: "border-orange-500 text-orange-700 dark:text-orange-400",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Try order status first
  const orderConfig = orderStatusConfig[status as OrderStatus]
  if (orderConfig) {
    return (
      <Badge
        variant={orderConfig.variant}
        className={cn(orderConfig.className, className)}
      >
        {orderConfig.label}
      </Badge>
    )
  }

  // Try credential type
  const credConfig = credTypeConfig[status as CredType]
  if (credConfig) {
    return (
      <Badge
        variant={credConfig.variant}
        className={cn(credConfig.className, className)}
      >
        {credConfig.label}
      </Badge>
    )
  }

  // Fallback for unknown status
  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  )
}
