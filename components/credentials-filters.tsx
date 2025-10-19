"use client"

// ============================================================================
// AssetFlowX - CredentialsFilters Component
// Filter controls for credentials list
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
import type { CredType, ChainId } from "@/types/payments"

interface CredentialsFiltersProps {
  typeFilter: CredType | "ALL"
  chainFilter: ChainId | "ALL"
  onTypeChange: (value: CredType | "ALL") => void
  onChainChange: (value: ChainId | "ALL") => void
  onClearFilters: () => void
}

export function CredentialsFilters({
  typeFilter,
  chainFilter,
  onTypeChange,
  onChainChange,
  onClearFilters,
}: CredentialsFiltersProps) {
  const hasActiveFilters = typeFilter !== "ALL" || chainFilter !== "ALL"

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Type Filter */}
      <div className="flex-1 min-w-[200px]">
        <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as CredType | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="OPEN_BADGE">Open Badge</SelectItem>
            <SelectItem value="VC">Verifiable Credential</SelectItem>
            <SelectItem value="ERC1155">ERC-1155 NFT</SelectItem>
            <SelectItem value="SBT">Soulbound Token</SelectItem>
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
