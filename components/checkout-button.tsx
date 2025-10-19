"use client"

// ============================================================================
// AssetFlowX - CheckoutButton Component
// Payment flow state machine with FakeWallet integration
// ============================================================================

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { fakeWallet } from "@/lib/fakeWallet"
import { api } from "@/lib/api"
import type { ChainId, TokenType, PayIntent } from "@/types/payments"

type CheckoutState =
  | "idle"
  | "creatingOrder"
  | "awaitingWallet"
  | "confirmingTx"
  | "success"
  | "error"
  | "expired"

interface CheckoutButtonProps {
  courseId: string
  courseName: string
  price: string
  token: TokenType
  chain: ChainId
  disabled?: boolean
}

export function CheckoutButton({
  courseId,
  courseName,
  price,
  token,
  chain,
  disabled,
}: CheckoutButtonProps) {
  const router = useRouter()
  const [state, setState] = useState<CheckoutState>("idle")
  const [error, setError] = useState<string>("")

  const handleCheckout = async () => {
    try {
      // Reset state
      setState("creatingOrder")
      setError("")

      // Step 1: Create order
      toast.info("Creating order...")
      const orderResponse = await api.orders.create({
        courseId,
        token,
        chain,
      })

      const { orderId, payIntent, expiresAt } = orderResponse

      // Check if already expired (shouldn't happen, but just in case)
      if (new Date(expiresAt) < new Date()) {
        setState("expired")
        toast.error("Order expired. Please try again.")
        return
      }

      // Step 2: Connect wallet
      setState("awaitingWallet")
      toast.info("Connecting wallet...")
      await fakeWallet.connect()

      // Step 3: Approve token spending
      toast.info(`Approving ${token} spend...`)
      await fakeWallet.approveOrPermit(payIntent)

      // Step 4: Transfer payment
      toast.info("Processing payment...")
      const { txHash } = await fakeWallet.transfer(payIntent)

      // Step 5: Confirm payment on backend
      setState("confirmingTx")
      toast.info("Confirming transaction...")
      await api.payments.confirm({
        orderId,
        txHash,
      })

      // Success!
      setState("success")
      toast.success(`Successfully purchased ${courseName}!`)

      // Redirect to orders page after a short delay
      setTimeout(() => {
        router.push("/orders")
      }, 1500)
    } catch (err) {
      setState("error")
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const getButtonContent = () => {
    switch (state) {
      case "idle":
        return (
          <>
            Pay ${price} with {token}
          </>
        )
      case "creatingOrder":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Creating order...
          </>
        )
      case "awaitingWallet":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Approve in wallet...
          </>
        )
      case "confirmingTx":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Confirming transaction...
          </>
        )
      case "success":
        return (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Payment successful!
          </>
        )
      case "error":
        return (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Payment failed
          </>
        )
      case "expired":
        return (
          <>
            <Clock className="h-4 w-4 mr-2" />
            Order expired
          </>
        )
    }
  }

  const isLoading = ["creatingOrder", "awaitingWallet", "confirmingTx"].includes(
    state
  )
  const isComplete = state === "success"
  const hasError = state === "error" || state === "expired"

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={disabled || isLoading || isComplete}
        size="lg"
        className="w-full"
        variant={hasError ? "destructive" : isComplete ? "default" : "default"}
      >
        {getButtonContent()}
      </Button>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {hasError && (
        <Button
          onClick={() => {
            setState("idle")
            setError("")
          }}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
