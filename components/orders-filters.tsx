"use client"

// ============================================================================
// AssetFlowX - OrdersFilters Component
// Filter controls for orders list
// ============================================================================

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { OrderStatus, TokenType, ChainId } from "@/types/payments"

interface OrdersFiltersProps {
  statusFilter: OrderStatus | "ALL"
  tokenFilter: TokenType | "ALL"
  chainFilter: ChainId | "ALL"
  onStatusChange: (value: OrderStatus | "ALL") => void
  onTokenChange: (value: TokenType | "ALL") => void
  onChainChange: (value: ChainId | "ALL") => void
  onClearFilters: () => void
}

export function OrdersFilters({
  statusFilter,
  tokenFilter,
  chainFilter,
  onStatusChange,
  onTokenChange,
  onChainChange,
  onClearFilters,
}: OrdersFiltersProps) {
  const hasActiveFilters =
    statusFilter !== "ALL" || tokenFilter !== "ALL" || chainFilter !== "ALL"

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter */}
      <div className="flex-1 min-w-[200px]">
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as OrderStatus | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="SETTLED">Settled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Token Filter */}
      <div className="flex-1 min-w-[150px]">
        <Select value={tokenFilter} onValueChange={(v) => onTokenChange(v as TokenType | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Tokens</SelectItem>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="USDT">USDT</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chain Filter */}
      <div className="flex-1 min-w-[200px]">
        <Select value={chainFilter} onValueChange={(v) => onChainChange(v as ChainId | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Chains</SelectItem>
            <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
            <SelectItem value="polygon-amoy">Polygon Amoy</SelectItem>
            <SelectItem value="solana-devnet">Solana Devnet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
