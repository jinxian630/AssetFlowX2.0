// ============================================================================
// AssetFlowX - Payments Module Mock Data Store
// In-memory storage for development (frontend-only)
// ============================================================================

import type {
  Order,
  CredentialDetail,
  Settlement,
  IdempotencyStore,
  MockCourse,
  MockUser,
} from "@/types/payments"

// ============================================================================
// In-Memory Stores
// ============================================================================

export const ordersStore: Map<string, Order> = new Map()
export const credentialsStore: Map<string, CredentialDetail> = new Map()
export const settlementsStore: Map<string, Settlement> = new Map()
export const idempotencyStore: Map<string, IdempotencyStore[string]> = new Map()

// ============================================================================
// Mock Reference Data
// ============================================================================

export const mockCourses: MockCourse[] = [
  { id: "course_web3_101", name: "Web3 Fundamentals", price: "99.00" },
  { id: "course_solidity_adv", name: "Advanced Solidity", price: "199.00" },
  { id: "course_defi_master", name: "DeFi Mastery", price: "299.00" },
  { id: "course_nft_art", name: "NFT Art & Marketplaces", price: "149.00" },
  { id: "course_dao_governance", name: "DAO Governance", price: "179.00" },
]

export const mockUsers: MockUser[] = [
  { id: "u_alice", name: "Alice Johnson", wallet: "0xAlice1234567890abcdef" },
  { id: "u_bob", name: "Bob Smith", wallet: "0xBob1234567890abcdef" },
  { id: "u_charlie", name: "Charlie Davis", wallet: "0xCharlie1234567890abcdef" },
]

// ============================================================================
// Seed Data - Orders
// ============================================================================

const seedOrders: Order[] = [
  // PENDING orders
  {
    id: "ord_pending_1",
    courseId: "course_web3_101",
    userId: "u_alice",
    chain: "base-sepolia",
    token: "USDC",
    price: "99.00",
    platformFeeBps: 1000, // 10%
    status: "PENDING",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min from now
  },
  {
    id: "ord_pending_2",
    courseId: "course_nft_art",
    userId: "u_bob",
    chain: "polygon-amoy",
    token: "USDT",
    price: "149.00",
    platformFeeBps: 1000,
    status: "PENDING",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
  },

  // PAID orders
  {
    id: "ord_paid_1",
    courseId: "course_solidity_adv",
    userId: "u_alice",
    chain: "base-sepolia",
    token: "USDC",
    price: "199.00",
    platformFeeBps: 1000,
    status: "PAID",
    onchainTx: "0xfakepaid1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord_paid_2",
    courseId: "course_defi_master",
    userId: "u_bob",
    chain: "polygon-amoy",
    token: "ETH",
    price: "299.00",
    platformFeeBps: 1000,
    status: "PAID",
    onchainTx: "0xfakepaid2abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord_paid_3",
    courseId: "course_web3_101",
    userId: "u_charlie",
    chain: "base-sepolia",
    token: "USDC",
    price: "99.00",
    platformFeeBps: 1000,
    status: "PAID",
    onchainTx: "0xfakepaid3xyz123xyz123xyz123xyz123xyz123xyz123xyz123xyz123xyz123xyz1",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },

  // SETTLED orders
  {
    id: "ord_settled_1",
    courseId: "course_dao_governance",
    userId: "u_alice",
    chain: "polygon-amoy",
    token: "USDC",
    price: "179.00",
    platformFeeBps: 1000,
    status: "SETTLED",
    onchainTx: "0xfakesettled1abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // settled 5 days ago
  },
  {
    id: "ord_settled_2",
    courseId: "course_nft_art",
    userId: "u_charlie",
    chain: "base-sepolia",
    token: "ETH",
    price: "149.00",
    platformFeeBps: 1000,
    status: "SETTLED",
    onchainTx: "0xfakesettled2def456def456def456def456def456def456def456def456def456def4",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // settled 8 days ago
  },

  // REFUNDED orders
  {
    id: "ord_refunded_1",
    courseId: "course_solidity_adv",
    userId: "u_bob",
    chain: "base-sepolia",
    token: "USDC",
    price: "199.00",
    platformFeeBps: 1000,
    status: "REFUNDED",
    onchainTx: "0xfakerefund1ghi789ghi789ghi789ghi789ghi789ghi789ghi789ghi789ghi789gh",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // refunded 12 days ago
  },
  {
    id: "ord_refunded_2",
    courseId: "course_defi_master",
    userId: "u_charlie",
    chain: "polygon-amoy",
    token: "USDT",
    price: "299.00",
    platformFeeBps: 1000,
    status: "REFUNDED",
    onchainTx: "0xfakerefund2jkl012jkl012jkl012jkl012jkl012jkl012jkl012jkl012jkl012jk",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // refunded 18 days ago
  },

  // EXPIRED order
  {
    id: "ord_expired_1",
    courseId: "course_web3_101",
    userId: "u_bob",
    chain: "solana-devnet",
    token: "USDC",
    price: "99.00",
    platformFeeBps: 1000,
    status: "EXPIRED",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // expired
  },
]

// ============================================================================
// Seed Data - Credentials
// ============================================================================

const seedCredentials: CredentialDetail[] = [
  // OpenBadge (off-chain)
  {
    id: "cred_badge_001",
    userId: "u_alice",
    courseId: "course_dao_governance",
    courseName: "DAO Governance",
    type: "OPEN_BADGE",
    issuedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    verifyUrl: "https://verify.assetflowx.example/badge/cred_badge_001",
    issuer: "AssetFlowX Academy",
    recipient: "Alice Johnson",
    skills: ["DAO Structure", "Voting Mechanisms", "Treasury Management"],
    assertion: {
      "@context": "https://w3id.org/openbadges/v2",
      type: "Assertion",
      id: "https://assetflowx.example/assertions/cred_badge_001",
      badge: {
        type: "BadgeClass",
        name: "DAO Governance Specialist",
        description: "Completed DAO Governance course with excellence",
        image: "https://assetflowx.example/badges/dao.png",
        criteria: "Complete all modules and pass final assessment",
        issuer: "AssetFlowX Academy",
      },
      recipient: { identity: "u_alice" },
      issuedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },

  // Verifiable Credential (off-chain)
  {
    id: "cred_vc_002",
    userId: "u_bob",
    courseId: "course_defi_master",
    courseName: "DeFi Mastery",
    type: "VC",
    issuedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    verifyUrl: "https://verify.assetflowx.example/vc/cred_vc_002",
    issuer: "did:web:assetflowx.example",
    recipient: "Bob Smith",
    skills: ["Liquidity Pools", "Yield Farming", "Flash Loans", "DEX Architecture"],
    assertion: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", "CourseCompletionCredential"],
      issuer: "did:web:assetflowx.example",
      issuanceDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      credentialSubject: {
        id: "u_bob",
        courseName: "DeFi Mastery",
        completionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        grade: "A+",
      },
    },
  },

  // ERC1155 (on-chain)
  {
    id: "cred_erc1155_003",
    userId: "u_charlie",
    courseId: "course_nft_art",
    courseName: "NFT Art & Marketplaces",
    type: "ERC1155",
    issuedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    chain: "base-sepolia",
    contract: "0xFakeERC1155Contract1234567890abcdef1234567890",
    tokenId: "42",
    txHash: "0xfakemint1155abc123abc123abc123abc123abc123abc123abc123abc123abc123abc",
    issuer: "AssetFlowX Academy",
    recipient: "0xCharlie1234567890abcdef",
    skills: ["NFT Standards", "IPFS", "Smart Contract Design", "Marketplace Integration"],
    metadata: {
      name: "NFT Art & Marketplaces Graduate",
      description: "Completed comprehensive NFT course covering ERC-721, ERC-1155, and marketplace development",
      image: "https://assetflowx.example/nft-metadata/42.png",
      attributes: [
        { trait_type: "Course", value: "NFT Art & Marketplaces" },
        { trait_type: "Level", value: "Advanced" },
        { trait_type: "Grade", value: "A" },
        { trait_type: "Completion Date", value: "2025-10-09" },
      ],
    },
  },

  // ERC1155 (another one)
  {
    id: "cred_erc1155_004",
    userId: "u_alice",
    courseId: "course_web3_101",
    courseName: "Web3 Fundamentals",
    type: "ERC1155",
    issuedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    chain: "polygon-amoy",
    contract: "0xFakeERC1155Contract9876543210fedcba9876543210",
    tokenId: "101",
    txHash: "0xfakemint1155def456def456def456def456def456def456def456def456def456def",
    issuer: "AssetFlowX Academy",
    recipient: "0xAlice1234567890abcdef",
    skills: ["Blockchain Basics", "Wallets", "dApps", "Smart Contracts Intro"],
    metadata: {
      name: "Web3 Fundamentals Certificate",
      description: "Entry-level Web3 knowledge certification",
      image: "https://assetflowx.example/nft-metadata/101.png",
      attributes: [
        { trait_type: "Course", value: "Web3 Fundamentals" },
        { trait_type: "Level", value: "Beginner" },
        { trait_type: "Grade", value: "B+" },
        { trait_type: "Completion Date", value: "2025-10-02" },
      ],
    },
  },

  // Soulbound Token (on-chain, non-transferable)
  {
    id: "cred_sbt_005",
    userId: "u_bob",
    courseId: "course_solidity_adv",
    courseName: "Advanced Solidity",
    type: "SBT",
    issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    chain: "base-sepolia",
    contract: "0xFakeSBTContract1234567890abcdef1234567890abcd",
    tokenId: "7",
    txHash: "0xfakemintsbtghi789ghi789ghi789ghi789ghi789ghi789ghi789ghi789ghi789gh",
    issuer: "AssetFlowX Academy",
    recipient: "0xBob1234567890abcdef",
    skills: ["Advanced Patterns", "Gas Optimization", "Security Best Practices", "Upgradability"],
    metadata: {
      name: "Advanced Solidity Master",
      description: "Soulbound token certifying mastery of advanced Solidity development",
      image: "https://assetflowx.example/sbt-metadata/7.png",
      attributes: [
        { trait_type: "Course", value: "Advanced Solidity" },
        { trait_type: "Level", value: "Expert" },
        { trait_type: "Grade", value: "A+" },
        { trait_type: "Completion Date", value: "2025-10-14" },
        { trait_type: "Non-Transferable", value: "true" },
      ],
    },
  },
]

// ============================================================================
// Seed Data - Settlements
// ============================================================================

const seedSettlements: Settlement[] = [
  {
    orderId: "ord_settled_1",
    instructorShare: "161.10", // 179 - 17.90 (10%)
    platformShare: "17.90",
    releasedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    orderId: "ord_settled_2",
    instructorShare: "134.10", // 149 - 14.90 (10%)
    platformShare: "14.90",
    releasedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// ============================================================================
// Initialize Stores
// ============================================================================

export function initializeStores() {
  // Clear existing data
  ordersStore.clear()
  credentialsStore.clear()
  settlementsStore.clear()

  // Populate orders
  seedOrders.forEach((order) => {
    ordersStore.set(order.id, order)
  })

  // Populate credentials
  seedCredentials.forEach((cred) => {
    credentialsStore.set(cred.id, cred)
  })

  // Populate settlements
  seedSettlements.forEach((settlement) => {
    settlementsStore.set(settlement.orderId, settlement)
  })
}

// Initialize on module load
initializeStores()

// ============================================================================
// Helper Functions
// ============================================================================

export function getCourseById(id: string): MockCourse | undefined {
  return mockCourses.find((c) => c.id === id)
}

export function getUserById(id: string): MockUser | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateCredentialId(type: string): string {
  const prefix = type.toLowerCase().replace("_", "")
  return `cred_${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

export function calculateSettlement(price: string, platformFeeBps: number): Settlement {
  const priceNum = parseFloat(price)
  const platformShareNum = (priceNum * platformFeeBps) / 10000
  const instructorShareNum = priceNum - platformShareNum

  return {
    orderId: "", // Will be set by caller
    platformShare: platformShareNum.toFixed(2),
    instructorShare: instructorShareNum.toFixed(2),
    releasedAt: null,
  }
}
