// ============================================================================
// AssetFlowX - Settlement Release API Route
// POST /api/settlements/release - Release settlement for PAID order
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import {
  ordersStore,
  settlementsStore,
  idempotencyStore,
  calculateSettlement,
} from "@/lib/payments-mock-store"
import type {
  ReleaseSettlementRequest,
  ReleaseSettlementResponse,
} from "@/types/payments"

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

    const body = (await request.json()) as ReleaseSettlementRequest

    // Get order
    const order = ordersStore.get(body.orderId)
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Validate order status
    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: `Cannot release settlement for order with status ${order.status}` },
        { status: 400 }
      )
    }

    // Calculate settlement
    const settlement = calculateSettlement(order.price, order.platformFeeBps)
    settlement.orderId = order.id
    settlement.releasedAt = new Date().toISOString()

    // Update order to SETTLED
    order.status = "SETTLED"
    order.updatedAt = new Date().toISOString()
    ordersStore.set(order.id, order)

    // Store settlement
    settlementsStore.set(order.id, settlement)

    const response: ReleaseSettlementResponse = {
      status: "SETTLED",
      settlement,
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
    console.error("POST /api/settlements/release error:", error)
    return NextResponse.json(
      { error: "Failed to release settlement" },
      { status: 500 }
    )
  }
}
