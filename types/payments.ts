// ============================================================================
// AssetFlowX - Payments & Settlement Module
// Type Definitions
// ============================================================================

// Chain identifiers (mock chains for frontend-only implementation)
export type ChainId = "base-sepolia" | "polygon-amoy" | "solana-devnet"

// Token types supported in the system
export type TokenType = "USDC" | "USDT" | "ETH"

// Order lifecycle states
export type OrderStatus =
  | "PENDING"      // Order created, awaiting payment
  | "EXPIRED"      // Payment deadline passed
  | "PAID"         // Payment confirmed on-chain
  | "SETTLED"      // Funds released to instructor
  | "REFUNDED"     // Order refunded

// Credential types
export type CredType =
  | "OPEN_BADGE"   // Off-chain OpenBadges v2/v3
  | "VC"           // Off-chain Verifiable Credential (W3C)
  | "ERC1155"      // On-chain ERC-1155 NFT
  | "SBT"          // On-chain Soulbound Token (non-transferable)

// ============================================================================
// Orders & Payments
// ============================================================================

export interface Order {
  id: string                    // ord_xxx
  courseId: string              // course_xxx
  userId: string                // u_xxx
  chain: ChainId
  token: TokenType
  price: string                 // String to avoid float precision issues, e.g., "99.00"
  platformFeeBps: number        // Basis points (10000 = 100%), e.g., 1000 = 10%
  status: OrderStatus
  onchainTx?: string            // Transaction hash (if PAID/SETTLED)
  createdAt: string             // ISO 8601 timestamp
  updatedAt: string             // ISO 8601 timestamp
  expiresAt?: string            // ISO 8601 timestamp (for PENDING orders)
}

export interface PayIntent {
  to: string                    // Vault/escrow address (mock)
  token: TokenType
  amount: string                // String representation, e.g., "99.00"
  data?: string                 // Optional calldata for contract interaction
}

export interface CreateOrderRequest {
  courseId: string
  token: TokenType
  chain: ChainId
}

export interface CreateOrderResponse {
  orderId: string
  payIntent: PayIntent
  expiresAt: string             // ISO 8601 timestamp (typically now + 15 minutes)
}

export interface ConfirmPaymentRequest {
  orderId: string
  txHash: string                // Transaction hash from wallet
}

export interface ConfirmPaymentResponse {
  status: OrderStatus           // Should be "PAID"
  onchainTx: string
}

// ============================================================================
// Settlements
// ============================================================================

export interface Settlement {
  orderId: string
  instructorShare: string       // String currency, e.g., "89.10"
  platformShare: string         // String currency, e.g., "9.90"
  releasedAt?: string | null    // ISO 8601 timestamp (null if not yet released)
}

export interface ReleaseSettlementRequest {
  orderId: string
}

export interface ReleaseSettlementResponse {
  status: OrderStatus           // Should be "SETTLED"
  settlement: Settlement
}

// ============================================================================
// Credentials
// ============================================================================

export interface CredentialSummary {
  id: string                    // cred_xxx
  userId: string                // u_xxx
  courseId: string              // course_xxx
  courseName: string            // Human-readable course name
  type: CredType
  issuedAt: string              // ISO 8601 timestamp

  // Off-chain specific
  verifyUrl?: string            // URL for off-chain verification

  // On-chain specific
  chain?: ChainId
  contract?: string             // Contract address
  tokenId?: string              // Token ID
  txHash?: string               // Issuance transaction hash
}

export interface CredentialDetail extends CredentialSummary {
  issuer: string                // Issuer name or DID
  recipient: string             // Recipient name or wallet address
  skills: string[]              // List of skills earned

  // Off-chain: OpenBadge or VC assertion JSON
  assertion?: Record<string, unknown>

  // On-chain: tokenURI metadata
  metadata?: {
    name: string
    description: string
    image: string
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }
}

export interface IssueCredentialRequest {
  userId: string
  courseId: string
  mode: CredType
}

export interface IssueCredentialResponse {
  credentialId: string
  type: CredType

  // Off-chain response
  verifyUrl?: string

  // On-chain response
  contract?: string
  tokenId?: string
  txHash?: string
}

export interface VerifyCredentialRequest {
  // Method 1: By credential ID
  credentialId?: string

  // Method 2: By off-chain URL
  url?: string

  // Method 3: On-chain verification
  contract?: string
  tokenId?: string
  wallet?: string               // Optional: verify ownership
}

export interface VerifyCredentialResponse {
  valid: boolean
  type: CredType
  details: {
    issuer: string
    recipient: string
    issuedAt: string
    courseName: string
    skills: string[]

    // On-chain specific
    owner?: string              // Current token owner (if on-chain)
    chain?: ChainId
    txHash?: string
  }
}

// ============================================================================
// Pagination & Filtering
// ============================================================================

export interface PaginationParams {
  page?: number                 // Default: 1
  limit?: number                // Default: 10
}

export interface OrderFilters extends PaginationParams {
  status?: OrderStatus | OrderStatus[]
  token?: TokenType
  chain?: ChainId
  startDate?: string            // ISO 8601
  endDate?: string              // ISO 8601
}

export interface CredentialFilters extends PaginationParams {
  type?: CredType | CredType[]
  chain?: ChainId
  courseId?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// Idempotency (for POST requests)
// ============================================================================

export interface IdempotencyStore {
  [key: string]: {
    response: unknown
    timestamp: number
  }
}

// ============================================================================
// Mock Data Helpers
// ============================================================================

export interface MockCourse {
  id: string
  name: string
  price: string
}

export interface MockUser {
  id: string
  name: string
  wallet?: string
}
