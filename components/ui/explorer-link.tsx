// ============================================================================
// AssetFlowX - ExplorerLink Component
// Links to blockchain explorer (mock URLs in this implementation)
// ============================================================================

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChainId } from "@/types/payments"

interface ExplorerLinkProps {
  txHash?: string
  address?: string
  chain?: ChainId
  label?: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

/**
 * Get mock explorer URL for a given chain
 */
function getExplorerUrl(chain?: ChainId): string {
  const baseUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://explorer.example/mock"

  if (!chain) {
    return baseUrl
  }

  const chainUrls: Record<ChainId, string> = {
    "base-sepolia": "https://sepolia.basescan.org",
    "polygon-amoy": "https://amoy.polygonscan.com",
    "solana-devnet": "https://explorer.solana.com?cluster=devnet",
  }

  return chainUrls[chain] || baseUrl
}

/**
 * Build full explorer URL for transaction or address
 */
function buildExplorerUrl(
  chain: ChainId | undefined,
  txHash?: string,
  address?: string
): string {
  const baseUrl = getExplorerUrl(chain)

  if (txHash) {
    return `${baseUrl}/tx/${txHash}`
  }

  if (address) {
    return `${baseUrl}/address/${address}`
  }

  return baseUrl
}

export function ExplorerLink({
  txHash,
  address,
  chain,
  label,
  className,
  variant = "ghost",
  size = "sm",
}: ExplorerLinkProps) {
  const url = buildExplorerUrl(chain, txHash, address)
  const displayLabel = label || (txHash ? "View Transaction" : address ? "View Address" : "Explorer")

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      asChild
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        {displayLabel}
        <ExternalLink className="h-3 w-3" />
      </a>
    </Button>
  )
}

/**
 * ExplorerText - Shows hash/address with truncation and link
 */
interface ExplorerTextProps {
  txHash?: string
  address?: string
  chain?: ChainId
  truncate?: boolean
  className?: string
}

export function ExplorerText({
  txHash,
  address,
  chain,
  truncate = true,
  className,
}: ExplorerTextProps) {
  const text = txHash || address || ""
  const displayText = truncate && text.length > 16
    ? `${text.slice(0, 6)}...${text.slice(-4)}`
    : text

  const url = buildExplorerUrl(chain, txHash, address)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 font-mono text-sm text-primary hover:underline",
        className
      )}
      title={text}
    >
      {displayText}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}
