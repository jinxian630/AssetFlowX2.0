// ============================================================================
// AssetFlowX - Order Detail API Route
// GET /api/orders/[id] - Get order by ID
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { ordersStore } from "@/lib/payments-mock-store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = ordersStore.get(id)

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(`GET /api/orders/[id] error:`, error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}
