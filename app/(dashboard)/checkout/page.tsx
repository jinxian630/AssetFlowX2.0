"use client"

// ============================================================================
// AssetFlowX - Checkout Page
// Course selection and crypto payment flow
// ============================================================================

import { useState } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { CheckoutButton } from "@/components/checkout-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { mockCourses } from "@/lib/payments-mock-store"
import { formatCurrency, calculateFeeSplit } from "@/lib/number"
import type { ChainId, TokenType } from "@/types/payments"
import { ShoppingCart, Coins, Network } from "lucide-react"

const tokens: TokenType[] = ["USDC", "USDT", "ETH"]
const chains: { id: ChainId; name: string }[] = [
  { id: "base-sepolia", name: "Base Sepolia" },
  { id: "polygon-amoy", name: "Polygon Amoy" },
  { id: "solana-devnet", name: "Solana Devnet" },
]

export default function CheckoutPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(mockCourses[0].id)
  const [selectedToken, setSelectedToken] = useState<TokenType>("USDC")
  const [selectedChain, setSelectedChain] = useState<ChainId>("base-sepolia")

  const selectedCourse = mockCourses.find((c) => c.id === selectedCourseId)
  const price = selectedCourse?.price || "0.00"
  const platformFeeBps = 1000 // 10%

  const { platformFee, instructorShare } = calculateFeeSplit(price, platformFeeBps)

  return (
    <div className="space-y-6">
      <PageHeading
        title="Checkout"
        description="Select a course and complete your purchase with crypto"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Selection */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Select Course
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} - {formatCurrency(course.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Payment Token
                </label>
                <Select value={selectedToken} onValueChange={(v) => setSelectedToken(v as TokenType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Blockchain
                </label>
                <Select value={selectedChain} onValueChange={(v) => setSelectedChain(v as ChainId)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary & Checkout */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium">{selectedCourse?.name}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">{formatCurrency(price)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (10%)</span>
                <span className="font-medium">{formatCurrency(platformFee)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Instructor Share</span>
                <span className="font-medium">{formatCurrency(instructorShare)}</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatCurrency(price)}</span>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Payment Method</span>
                <span>
                  {selectedToken} on {chains.find((c) => c.id === selectedChain)?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Complete Purchase</h2>

            <CheckoutButton
              courseId={selectedCourseId}
              courseName={selectedCourse?.name || ""}
              price={price}
              token={selectedToken}
              chain={selectedChain}
            />

            <p className="text-xs text-muted-foreground mt-4 text-center">
              This is a demo using a mock wallet. No real funds will be transferred.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
