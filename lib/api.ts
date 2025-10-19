// ============================================================================
// AssetFlowX - Typed API Client with Zod Validation
// Development-only runtime validation for API responses
// ============================================================================

import { z } from "zod"
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderFilters,
  PaginatedResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  ReleaseSettlementRequest,
  ReleaseSettlementResponse,
  IssueCredentialRequest,
  IssueCredentialResponse,
  CredentialSummary,
  CredentialDetail,
  CredentialFilters,
  VerifyCredentialRequest,
  VerifyCredentialResponse,
} from "@/types/payments"

// ============================================================================
// Zod Schemas for Runtime Validation (Development Only)
// ============================================================================

const OrderStatusSchema = z.enum([
  "PENDING",
  "EXPIRED",
  "PAID",
  "SETTLED",
  "REFUNDED",
])

const ChainIdSchema = z.enum(["base-sepolia", "polygon-amoy", "solana-devnet"])
const TokenTypeSchema = z.enum(["USDC", "USDT", "ETH"])
const CredTypeSchema = z.enum(["OPEN_BADGE", "VC", "ERC1155", "SBT"])

const PayIntentSchema = z.object({
  to: z.string(),
  token: TokenTypeSchema,
  amount: z.string(),
  data: z.string().optional(),
})

const OrderSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  userId: z.string(),
  chain: ChainIdSchema,
  token: TokenTypeSchema,
  price: z.string(),
  platformFeeBps: z.number(),
  status: OrderStatusSchema,
  onchainTx: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string().optional(),
})

const CreateOrderResponseSchema = z.object({
  orderId: z.string(),
  payIntent: PayIntentSchema,
  expiresAt: z.string(),
})

const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

const PaginatedOrdersSchema = z.object({
  data: z.array(OrderSchema),
  pagination: PaginationSchema,
})

const ConfirmPaymentResponseSchema = z.object({
  status: OrderStatusSchema,
  onchainTx: z.string(),
})

const SettlementSchema = z.object({
  orderId: z.string(),
  instructorShare: z.string(),
  platformShare: z.string(),
  releasedAt: z.string().nullable(),
})

const ReleaseSettlementResponseSchema = z.object({
  status: OrderStatusSchema,
  settlement: SettlementSchema,
})

const IssueCredentialResponseSchema = z.object({
  credentialId: z.string(),
  type: CredTypeSchema,
  verifyUrl: z.string().optional(),
  contract: z.string().optional(),
  tokenId: z.string().optional(),
  txHash: z.string().optional(),
})

const CredentialSummarySchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  courseName: z.string(),
  type: CredTypeSchema,
  issuedAt: z.string(),
  verifyUrl: z.string().optional(),
  chain: ChainIdSchema.optional(),
  contract: z.string().optional(),
  tokenId: z.string().optional(),
  txHash: z.string().optional(),
})

const CredentialDetailSchema = CredentialSummarySchema.extend({
  issuer: z.string(),
  recipient: z.string(),
  skills: z.array(z.string()),
  assertion: z.record(z.unknown()).optional(),
  metadata: z
    .object({
      name: z.string(),
      description: z.string(),
      image: z.string(),
      attributes: z.array(
        z.object({
          trait_type: z.string(),
          value: z.string(),
        })
      ),
    })
    .optional(),
})

const PaginatedCredentialsSchema = z.object({
  data: z.array(CredentialSummarySchema),
  pagination: PaginationSchema,
})

const VerifyCredentialResponseSchema = z.object({
  valid: z.boolean(),
  type: CredTypeSchema,
  details: z.object({
    issuer: z.string(),
    recipient: z.string(),
    issuedAt: z.string(),
    courseName: z.string(),
    skills: z.array(z.string()),
    owner: z.string().optional(),
    chain: ChainIdSchema.optional(),
    txHash: z.string().optional(),
  }),
})

// ============================================================================
// API Client Configuration
// ============================================================================

const isDevelopment = process.env.NODE_ENV === "development"

class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "APIError"
  }
}

async function fetchAPI<T>(
  url: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new APIError(
      response.status,
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  const data = await response.json()

  // Validate in development only
  if (isDevelopment && schema) {
    const result = schema.safeParse(data)
    if (!result.success) {
      console.error("API Response Validation Error:", result.error)
      console.error("Response data:", data)
      throw new Error(
        `API response validation failed: ${result.error.message}`
      )
    }
  }

  return data
}

// ============================================================================
// Orders API
// ============================================================================

export const ordersAPI = {
  /**
   * Create a new order
   */
  create: async (
    request: CreateOrderRequest,
    idempotencyKey?: string
  ): Promise<CreateOrderResponse> => {
    return fetchAPI(
      "/api/orders",
      {
        method: "POST",
        body: JSON.stringify(request),
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      },
      CreateOrderResponseSchema
    )
  },

  /**
   * List orders with optional filters
   */
  list: async (
    filters?: OrderFilters
  ): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams()
    if (filters?.status) {
      const statusValue = Array.isArray(filters.status) ? filters.status.join(",") : filters.status
      params.set("status", statusValue)
    }
    if (filters?.token) params.set("token", filters.token)
    if (filters?.chain) params.set("chain", filters.chain)
    if (filters?.startDate) params.set("startDate", filters.startDate)
    if (filters?.endDate) params.set("endDate", filters.endDate)
    if (filters?.page) params.set("page", filters.page.toString())
    if (filters?.limit) params.set("limit", filters.limit.toString())

    const queryString = params.toString()
    const url = queryString ? `/api/orders?${queryString}` : "/api/orders"

    return fetchAPI(url, {}, PaginatedOrdersSchema)
  },

  /**
   * Get order by ID
   */
  getById: async (orderId: string): Promise<Order> => {
    return fetchAPI(`/api/orders/${orderId}`, {}, OrderSchema)
  },
}

// ============================================================================
// Payments API
// ============================================================================

export const paymentsAPI = {
  /**
   * Confirm payment with transaction hash
   */
  confirm: async (
    request: ConfirmPaymentRequest,
    idempotencyKey?: string
  ): Promise<ConfirmPaymentResponse> => {
    return fetchAPI(
      "/api/payments/confirm",
      {
        method: "POST",
        body: JSON.stringify(request),
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      },
      ConfirmPaymentResponseSchema
    )
  },
}

// ============================================================================
// Settlements API
// ============================================================================

export const settlementsAPI = {
  /**
   * Release settlement for a PAID order
   */
  release: async (
    request: ReleaseSettlementRequest,
    idempotencyKey?: string
  ): Promise<ReleaseSettlementResponse> => {
    return fetchAPI(
      "/api/settlements/release",
      {
        method: "POST",
        body: JSON.stringify(request),
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      },
      ReleaseSettlementResponseSchema
    )
  },
}

// ============================================================================
// Credentials API
// ============================================================================

export const credentialsAPI = {
  /**
   * Issue a new credential
   */
  issue: async (
    request: IssueCredentialRequest,
    idempotencyKey?: string
  ): Promise<IssueCredentialResponse> => {
    return fetchAPI(
      "/api/credentials",
      {
        method: "POST",
        body: JSON.stringify(request),
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      },
      IssueCredentialResponseSchema
    )
  },

  /**
   * List credentials with optional filters
   */
  list: async (
    filters?: CredentialFilters
  ): Promise<PaginatedResponse<CredentialSummary>> => {
    const params = new URLSearchParams()
    if (filters?.type) {
      const typeValue = Array.isArray(filters.type) ? filters.type.join(",") : filters.type
      params.set("type", typeValue)
    }
    if (filters?.chain) params.set("chain", filters.chain)
    if (filters?.courseId) params.set("courseId", filters.courseId)
    if (filters?.page) params.set("page", filters.page.toString())
    if (filters?.limit) params.set("limit", filters.limit.toString())

    const queryString = params.toString()
    const url = queryString ? `/api/credentials?${queryString}` : "/api/credentials"

    return fetchAPI(url, {}, PaginatedCredentialsSchema)
  },

  /**
   * Get credential by ID with full details
   */
  getById: async (credentialId: string): Promise<CredentialDetail> => {
    return fetchAPI(`/api/credentials/${credentialId}`, {}, CredentialDetailSchema)
  },

  /**
   * Verify a credential
   */
  verify: async (
    request: VerifyCredentialRequest
  ): Promise<VerifyCredentialResponse> => {
    return fetchAPI(
      "/api/credentials/verify",
      {
        method: "POST",
        body: JSON.stringify(request),
      },
      VerifyCredentialResponseSchema
    )
  },
}

// ============================================================================
// Export Unified API Client
// ============================================================================

export const api = {
  orders: ordersAPI,
  payments: paymentsAPI,
  settlements: settlementsAPI,
  credentials: credentialsAPI,
}

export { APIError }
