"use client"

// ============================================================================
// AssetFlowX - FlowsFilters Component
// Filter chips for Flows page with URL sync
// ============================================================================

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type FlowType = "inflow" | "outflow" | "net" | "all"
export type ChainFilter = "base-sepolia" | "polygon-amoy" | "solana-devnet" | "all"

import type { TimeRange } from "@/components/range-tabs"

interface FlowsFiltersProps {
  timeRange: TimeRange
  flowType: FlowType
  chain: ChainFilter
  counterparty?: string
  onTimeRangeChange: (range: TimeRange) => void
  onFlowTypeChange: (type: FlowType) => void
  onChainChange: (chain: ChainFilter) => void
  onCounterpartyChange: (counterparty: string | undefined) => void
  onResetFilters: () => void
}

export function FlowsFilters({
  timeRange,
  flowType,
  chain,
  counterparty,
  onTimeRangeChange,
  onFlowTypeChange,
  onChainChange,
  onCounterpartyChange,
  onResetFilters,
}: FlowsFiltersProps) {
  const hasActiveFilters =
    timeRange !== "30d" ||
    flowType !== "all" ||
    chain !== "all" ||
    counterparty !== undefined

  const removeFilter = (filterType: "timeRange" | "flowType" | "chain" | "counterparty") => {
    switch (filterType) {
      case "timeRange":
        onTimeRangeChange("30d")
        break
      case "flowType":
        onFlowTypeChange("all")
        break
      case "chain":
        onChainChange("all")
        break
      case "counterparty":
        onCounterpartyChange(undefined)
        break
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Filters:</span>

      {/* Time Range Chip */}
      {timeRange !== "30d" && (
        <Badge
          variant="secondary"
          className="gap-1.5 pr-1 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-xs font-medium">
            {timeRange === "24h" ? "Last 24 hours" : timeRange === "7d" ? "Last 7 days" : "All time"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter("timeRange")}
            aria-label="Remove time range filter"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Flow Type Chip */}
      {flowType !== "all" && (
        <Badge
          variant="secondary"
          className={cn(
            "gap-1.5 pr-1 focus-visible:ring-2 focus-visible:ring-ring",
            flowType === "inflow" && "bg-flow-inflow/10 text-flow-inflow border-flow-inflow/20",
            flowType === "outflow" && "bg-flow-outflow/10 text-flow-outflow border-flow-outflow/20",
            flowType === "net" && "bg-flow-net/10 text-flow-net border-flow-net/20"
          )}
        >
          <span className="text-xs font-medium capitalize">{flowType}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter("flowType")}
            aria-label="Remove flow type filter"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Chain Chip */}
      {chain !== "all" && (
        <Badge
          variant="secondary"
          className="gap-1.5 pr-1 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-xs font-medium">
            {chain === "base-sepolia" && "Base Sepolia"}
            {chain === "polygon-amoy" && "Polygon Amoy"}
            {chain === "solana-devnet" && "Solana Devnet"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter("chain")}
            aria-label="Remove chain filter"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Counterparty Chip */}
      {counterparty && (
        <Badge
          variant="secondary"
          className="gap-1.5 pr-1 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-xs font-medium font-mono">
            {counterparty.slice(0, 6)}...{counterparty.slice(-4)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter("counterparty")}
            aria-label="Remove counterparty filter"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Reset All Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="h-7 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Reset all filters"
        >
          <X className="h-3 w-3 mr-1" />
          Reset
        </Button>
      )}
    </div>
  )
}
