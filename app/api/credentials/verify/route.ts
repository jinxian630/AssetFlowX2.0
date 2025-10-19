// ============================================================================
// AssetFlowX - Credential Verification API Route
// POST /api/credentials/verify - Verify credential by ID, URL, or on-chain
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { credentialsStore, getCourseById } from "@/lib/payments-mock-store"
import type {
  VerifyCredentialRequest,
  VerifyCredentialResponse,
} from "@/types/payments"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VerifyCredentialRequest

    // Method 1: Verify by credential ID
    if (body.credentialId) {
      const credential = credentialsStore.get(body.credentialId)

      if (!credential) {
        return NextResponse.json({
          valid: false,
          type: "OPEN_BADGE" as const,
          details: {
            issuer: "Unknown",
            recipient: "Unknown",
            issuedAt: "",
            courseName: "Unknown",
            skills: [],
          },
        } as VerifyCredentialResponse)
      }

      const response: VerifyCredentialResponse = {
        valid: true,
        type: credential.type,
        details: {
          issuer: credential.issuer,
          recipient: credential.recipient,
          issuedAt: credential.issuedAt,
          courseName: credential.courseName,
          skills: credential.skills,
          ...(credential.chain && {
            chain: credential.chain,
            owner: credential.recipient,
            txHash: credential.txHash,
          }),
        },
      }

      return NextResponse.json(response)
    }

    // Method 2: Verify by URL (off-chain)
    if (body.url) {
      // Mock URL verification - in real app would fetch and validate
      const urlPattern = /\/([^/]+)\/([^/]+)$/
      const match = body.url.match(urlPattern)

      if (!match) {
        return NextResponse.json({
          valid: false,
          type: "OPEN_BADGE" as const,
          details: {
            issuer: "Unknown",
            recipient: "Unknown",
            issuedAt: "",
            courseName: "Unknown",
            skills: [],
          },
        } as VerifyCredentialResponse)
      }

      const [, typeSlug, credId] = match
      const credential = credentialsStore.get(credId)

      if (!credential || !credential.verifyUrl?.includes(credId)) {
        return NextResponse.json({
          valid: false,
          type: typeSlug.toUpperCase() as any,
          details: {
            issuer: "Unknown",
            recipient: "Unknown",
            issuedAt: "",
            courseName: "Unknown",
            skills: [],
          },
        } as VerifyCredentialResponse)
      }

      const response: VerifyCredentialResponse = {
        valid: true,
        type: credential.type,
        details: {
          issuer: credential.issuer,
          recipient: credential.recipient,
          issuedAt: credential.issuedAt,
          courseName: credential.courseName,
          skills: credential.skills,
        },
      }

      return NextResponse.json(response)
    }

    // Method 3: Verify on-chain (contract + tokenId)
    if (body.contract && body.tokenId) {
      // Mock on-chain verification
      const credentials = Array.from(credentialsStore.values()).filter(
        (c) =>
          c.contract?.toLowerCase() === body.contract?.toLowerCase() &&
          c.tokenId === body.tokenId
      )

      if (credentials.length === 0) {
        return NextResponse.json({
          valid: false,
          type: "ERC1155" as const,
          details: {
            issuer: "Unknown",
            recipient: "Unknown",
            issuedAt: "",
            courseName: "Unknown",
            skills: [],
          },
        } as VerifyCredentialResponse)
      }

      const credential = credentials[0]

      // If wallet is provided, verify ownership
      let ownerMatch = true
      if (body.wallet) {
        ownerMatch =
          credential.recipient.toLowerCase() === body.wallet.toLowerCase()
      }

      const response: VerifyCredentialResponse = {
        valid: ownerMatch,
        type: credential.type,
        details: {
          issuer: credential.issuer,
          recipient: credential.recipient,
          issuedAt: credential.issuedAt,
          courseName: credential.courseName,
          skills: credential.skills,
          owner: credential.recipient,
          chain: credential.chain,
          txHash: credential.txHash,
        },
      }

      return NextResponse.json(response)
    }

    // No valid verification method provided
    return NextResponse.json(
      { error: "Must provide credentialId, url, or contract+tokenId" },
      { status: 400 }
    )
  } catch (error) {
    console.error("POST /api/credentials/verify error:", error)
    return NextResponse.json(
      { error: "Failed to verify credential" },
      { status: 500 }
    )
  }
}
