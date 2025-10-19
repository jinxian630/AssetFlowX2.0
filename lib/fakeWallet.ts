// ============================================================================
// AssetFlowX - FakeWallet Implementation
// Mock wallet for frontend-only development (no real blockchain interaction)
// ============================================================================

import type { PayIntent } from "@/types/payments"

/**
 * Simulated delay for mock blockchain operations
 * @param min - Minimum delay in ms
 * @param max - Maximum delay in ms
 */
function randomDelay(min: number = 500, max: number = 2000): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Generate a deterministic fake transaction hash
 * @param input - Input string to hash
 * @returns Fake transaction hash
 */
function generateFakeTxHash(input: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const hash = `${input}${timestamp}${random}`

  // Create a simple hash from the combined string
  let hashValue = 0
  for (let i = 0; i < hash.length; i++) {
    hashValue = (hashValue << 5) - hashValue + hash.charCodeAt(i)
    hashValue |= 0 // Convert to 32-bit integer
  }

  // Convert to hex and pad to 64 characters
  const hexHash = Math.abs(hashValue).toString(16).padStart(16, '0')
  return `0x${hexHash}${random}`.padEnd(66, '0').slice(0, 66)
}

/**
 * Mock wallet address
 */
const MOCK_WALLET_ADDRESS = "0xMockUser1234567890abcdef1234567890abcdef"

/**
 * FakeWallet API
 */
export const fakeWallet = {
  /**
   * Connect wallet (simulates user approval)
   * @returns Promise with connected wallet address
   */
  async connect(): Promise<{ address: string }> {
    console.log("🔗 FakeWallet: Connecting...")
    await randomDelay(800, 1500)

    // Simulate 10% chance of user rejecting connection
    if (Math.random() < 0.1) {
      throw new Error("User rejected wallet connection")
    }

    console.log("✅ FakeWallet: Connected to", MOCK_WALLET_ADDRESS)
    return { address: MOCK_WALLET_ADDRESS }
  },

  /**
   * Approve or permit token spending (simulates ERC-20 approval or permit signature)
   * @param payIntent - Payment intent with token and amount
   * @returns Promise with approval transaction hash
   */
  async approveOrPermit(payIntent: PayIntent): Promise<{ approvalHash: string }> {
    console.log("📝 FakeWallet: Requesting approval for", payIntent.amount, payIntent.token)
    await randomDelay(1000, 2500)

    // Simulate 5% chance of user rejecting approval
    if (Math.random() < 0.05) {
      throw new Error("User rejected token approval")
    }

    const approvalHash = generateFakeTxHash(`approve_${payIntent.token}_${payIntent.amount}`)
    console.log("✅ FakeWallet: Approval confirmed", approvalHash)

    return { approvalHash }
  },

  /**
   * Transfer tokens (simulates actual payment transaction)
   * @param payIntent - Payment intent with recipient, token, and amount
   * @returns Promise with transaction hash
   */
  async transfer(payIntent: PayIntent): Promise<{ txHash: string }> {
    console.log("💸 FakeWallet: Sending", payIntent.amount, payIntent.token, "to", payIntent.to)
    await randomDelay(1500, 3000)

    // Simulate 5% chance of transaction failure
    if (Math.random() < 0.05) {
      throw new Error("Transaction failed: insufficient gas")
    }

    const txHash = generateFakeTxHash(
      `transfer_${payIntent.to}_${payIntent.token}_${payIntent.amount}_${payIntent.data || ""}`
    )
    console.log("✅ FakeWallet: Transaction confirmed", txHash)

    return { txHash }
  },

  /**
   * Get current wallet address (if connected)
   * @returns Wallet address or null
   */
  getAddress(): string | null {
    return MOCK_WALLET_ADDRESS
  },

  /**
   * Check if wallet is connected
   * @returns True if connected
   */
  isConnected(): boolean {
    return true // In mock mode, always connected
  },

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    console.log("🔌 FakeWallet: Disconnected")
    await randomDelay(100, 300)
  },

  /**
   * Simulate full payment flow (connect + approve + transfer)
   * @param payIntent - Payment intent
   * @returns Promise with all transaction hashes
   */
  async fullPaymentFlow(payIntent: PayIntent): Promise<{
    address: string
    approvalHash: string
    txHash: string
  }> {
    console.log("🚀 FakeWallet: Starting full payment flow")

    const { address } = await this.connect()
    const { approvalHash } = await this.approveOrPermit(payIntent)
    const { txHash } = await this.transfer(payIntent)

    console.log("✅ FakeWallet: Payment flow complete")

    return { address, approvalHash, txHash }
  },
}

/**
 * Export individual functions for convenience
 */
export const { connect, approveOrPermit, transfer, getAddress, isConnected, disconnect, fullPaymentFlow } = fakeWallet
