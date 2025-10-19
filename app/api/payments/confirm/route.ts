// ============================================================================
// AssetFlowX - Payment Confirmation API Route
// POST /api/payments/confirm - Confirm payment with transaction hash
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { ordersStore, idempotencyStore } from "@/lib/payments-mock-store"
import type { ConfirmPaymentRequest, ConfirmPaymentResponse } from "@/types/payments"

export async function POST(request: NextRequest) {
  try {
    // Check for idempotency key
    const idempotencyKey = request.headers.get("Idempotency-Key")
    if (idempotencyKey) {
      const cached = idempotencyStore.get(idempotencyKey)
      if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
        return NextResponse.json(cached.response)
      }
    }

    const body = (await request.json()) as ConfirmPaymentRequest

    // Get order
    const order = ordersStore.get(body.orderId)
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Validate order status
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: `Order is already ${order.status}` },
        { status: 400 }
      )
    }

    // Check if expired
    if (order.expiresAt && new Date(order.expiresAt) < new Date()) {
      order.status = "EXPIRED"
      order.updatedAt = new Date().toISOString()
      ordersStore.set(order.id, order)

      return NextResponse.json(
        { error: "Order has expired" },
        { status: 400 }
      )
    }

    // Update order to PAID
    order.status = "PAID"
    order.onchainTx = body.txHash
    order.updatedAt = new Date().toISOString()
    ordersStore.set(order.id, order)

    const response: ConfirmPaymentResponse = {
      status: "PAID",
      onchainTx: body.txHash,
    }

    // Cache for idempotency
    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, {
        response,
        timestamp: Date.now(),
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("POST /api/payments/confirm error:", error)
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    )
  }
}
