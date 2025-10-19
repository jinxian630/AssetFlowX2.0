// ============================================================================
// AssetFlowX - Orders API Routes
// POST /api/orders - Create new order
// GET /api/orders - List orders with filters
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import {
  ordersStore,
  idempotencyStore,
  generateOrderId,
  getCourseById,
} from "@/lib/payments-mock-store"
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderFilters,
  PaginatedResponse,
} from "@/types/payments"

// ============================================================================
// POST /api/orders - Create new order
// ============================================================================

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

    const body = (await request.json()) as CreateOrderRequest

    // Validate course exists
    const course = getCourseById(body.courseId)
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Create new order
    const orderId = generateOrderId()
    const now = new Date().toISOString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min expiry

    const order: Order = {
      id: orderId,
      courseId: body.courseId,
      userId: "u_alice", // Mock user - in real app would come from auth
      chain: body.chain,
      token: body.token,
      price: course.price,
      platformFeeBps: 1000, // 10%
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
      expiresAt,
    }

    ordersStore.set(orderId, order)

    // Prepare response
    const response: CreateOrderResponse = {
      orderId,
      payIntent: {
        to: "0xMockVaultAddress1234567890abcdef1234567890", // Mock vault
        token: body.token,
        amount: course.price,
        data: `0x${orderId}`, // Mock calldata
      },
      expiresAt,
    }

    // Cache for idempotency
    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, {
        response,
        timestamp: Date.now(),
      })
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("POST /api/orders error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET /api/orders - List orders with filters
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters
    const filters: OrderFilters = {
      status: searchParams.get("status") as any,
      token: searchParams.get("token") as any,
      chain: searchParams.get("chain") as any,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    }

    // Get all orders
    let orders = Array.from(ordersStore.values())

    // Apply filters
    if (filters.status) {
      const statuses = Array.isArray(filters.status)
        ? filters.status
        : [filters.status]
      orders = orders.filter((o) => statuses.includes(o.status))
    }

    if (filters.token) {
      orders = orders.filter((o) => o.token === filters.token)
    }

    if (filters.chain) {
      orders = orders.filter((o) => o.chain === filters.chain)
    }

    if (filters.startDate) {
      orders = orders.filter((o) => o.createdAt >= filters.startDate!)
    }

    if (filters.endDate) {
      orders = orders.filter((o) => o.createdAt <= filters.endDate!)
    }

    // Sort by createdAt descending (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = orders.slice(startIndex, endIndex)

    const response: PaginatedResponse<Order> = {
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
