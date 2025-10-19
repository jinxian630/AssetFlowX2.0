"use client"

// ============================================================================
// Phase 2 Component Testing Page
// Test all new UI components and utilities
// ============================================================================

import { useState } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { CopyButton, CopyText } from "@/components/ui/copy-button"
import { ExplorerLink, ExplorerText } from "@/components/ui/explorer-link"
import { Button } from "@/components/ui/button"
import { fakeWallet } from "@/lib/fakeWallet"
import { formatCurrency, formatCompact, formatPercentage, calculateFeeSplit } from "@/lib/number"
import { formatDate, formatRelativeTime, formatShortDate, getTimeRemaining } from "@/lib/date"
import { DollarSign, TrendingUp, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

export default function TestPhase2Page() {
  const [walletResult, setWalletResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const testFakeWallet = async () => {
    setIsLoading(true)
    setWalletResult("Testing FakeWallet...")

    try {
      // Test connect
      const { address } = await fakeWallet.connect()
      setWalletResult(`Connected: ${address}`)
      toast.success("Wallet connected!")

      // Test approveOrPermit
      const { approvalHash } = await fakeWallet.approveOrPermit({
        to: "0xVault123",
        token: "USDC",
        amount: "99.00",
      })
      setWalletResult(`Approved: ${approvalHash}`)
      toast.success("Approval confirmed!")

      // Test transfer
      const { txHash } = await fakeWallet.transfer({
        to: "0xVault123",
        token: "USDC",
        amount: "99.00",
      })
      setWalletResult(`Transaction: ${txHash}`)
      toast.success("Payment successful!")
    } catch (error) {
      setWalletResult(`Error: ${error}`)
      toast.error(error instanceof Error ? error.message : "Failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* PageHeading Test */}
      <PageHeading
        title="Phase 2 Component Test"
        description="Testing all UI foundation components and utilities"
        action={
          <Button variant="outline" onClick={() => toast.info("Action button clicked!")}>
            Test Action
          </Button>
        }
      />

      {/* StatCard Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">StatCard Components</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Sales"
            value={formatCurrency("12345.67")}
            icon={DollarSign}
            change={{ value: 12.5, label: "from last month" }}
          />
          <StatCard
            title="Active Orders"
            value={formatCompact(1234)}
            icon={ShoppingCart}
          />
          <StatCard
            title="Growth Rate"
            value={formatPercentage(0.234)}
            icon={TrendingUp}
            change={{ value: -5.2, label: "vs last week" }}
          />
        </div>
      </div>

      {/* StatusBadge Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">StatusBadge Components</h2>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="PENDING" />
          <StatusBadge status="PAID" />
          <StatusBadge status="SETTLED" />
          <StatusBadge status="REFUNDED" />
          <StatusBadge status="EXPIRED" />
          <StatusBadge status="OPEN_BADGE" />
          <StatusBadge status="VC" />
          <StatusBadge status="ERC1155" />
          <StatusBadge status="SBT" />
        </div>
      </div>

      {/* CopyButton Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">CopyButton & CopyText</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Inline copy button:</span>
            <CopyButton text="0xAbCdEf1234567890" label="Address" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">CopyText component:</p>
            <CopyText text="0xAbCdEf1234567890123456789012345678901234" label="Transaction Hash" />
          </div>
        </div>
      </div>

      {/* ExplorerLink Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">ExplorerLink Components</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ExplorerLink
              txHash="0xfake1234567890"
              chain="base-sepolia"
              label="View on BaseScan"
            />
            <ExplorerLink
              address="0xVault1234567890"
              chain="polygon-amoy"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">ExplorerText component:</p>
            <ExplorerText
              txHash="0xfake1234567890abcdef1234567890abcdef1234567890abcdef"
              chain="base-sepolia"
            />
          </div>
        </div>
      </div>

      {/* Number Utilities Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Number Formatting Utilities</h2>
        <div className="grid gap-2 text-sm">
          <div>
            <code>formatCurrency("1234.56")</code> → <strong>{formatCurrency("1234.56")}</strong>
          </div>
          <div>
            <code>formatCompact(1234567)</code> → <strong>{formatCompact(1234567)}</strong>
          </div>
          <div>
            <code>formatPercentage(0.1234)</code> → <strong>{formatPercentage(0.1234)}</strong>
          </div>
          <div>
            <code>calculateFeeSplit("99.00", 1000)</code> →{" "}
            <strong>{JSON.stringify(calculateFeeSplit("99.00", 1000))}</strong>
          </div>
        </div>
      </div>

      {/* Date Utilities Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Date Formatting Utilities</h2>
        <div className="grid gap-2 text-sm">
          <div>
            <code>formatDate(now)</code> → <strong>{formatDate(new Date().toISOString())}</strong>
          </div>
          <div>
            <code>formatShortDate(now)</code> → <strong>{formatShortDate(new Date().toISOString())}</strong>
          </div>
          <div>
            <code>formatRelativeTime(2h ago)</code> →{" "}
            <strong>{formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())}</strong>
          </div>
          <div>
            <code>getTimeRemaining(+15min)</code> →{" "}
            <strong>{getTimeRemaining(new Date(Date.now() + 15 * 60 * 1000).toISOString())}</strong>
          </div>
        </div>
      </div>

      {/* FakeWallet Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">FakeWallet Implementation</h2>
        <div className="space-y-4">
          <Button onClick={testFakeWallet} disabled={isLoading}>
            {isLoading ? "Processing..." : "Test FakeWallet Flow"}
          </Button>
          {walletResult && (
            <div className="rounded-lg border bg-muted p-4">
              <p className="font-mono text-sm">{walletResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Test */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => toast.success("Success toast!")}>Success</Button>
          <Button onClick={() => toast.error("Error toast!")}>Error</Button>
          <Button onClick={() => toast.info("Info toast!")}>Info</Button>
          <Button onClick={() => toast.warning("Warning toast!")}>Warning</Button>
        </div>
      </div>
    </div>
  )
}
