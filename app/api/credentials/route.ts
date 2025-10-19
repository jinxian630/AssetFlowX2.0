// ============================================================================
// AssetFlowX - Credentials API Routes
// POST /api/credentials - Issue new credential
// GET /api/credentials - List credentials with filters
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import {
  credentialsStore,
  idempotencyStore,
  generateCredentialId,
  getCourseById,
  getUserById,
} from "@/lib/payments-mock-store"
import type {
  IssueCredentialRequest,
  IssueCredentialResponse,
  CredentialSummary,
  CredentialFilters,
  PaginatedResponse,
  CredentialDetail,
} from "@/types/payments"

// ============================================================================
// POST /api/credentials - Issue credential
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

    const body = (await request.json()) as IssueCredentialRequest

    // Validate course and user
    const course = getCourseById(body.courseId)
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    const user = getUserById(body.userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Generate credential ID
    const credentialId = generateCredentialId(body.mode)
    const now = new Date().toISOString()

    // Create credential based on type
    let credential: CredentialDetail

    if (body.mode === "OPEN_BADGE" || body.mode === "VC") {
      // Off-chain credential
      credential = {
        id: credentialId,
        userId: body.userId,
        courseId: body.courseId,
        courseName: course.name,
        type: body.mode,
        issuedAt: now,
        verifyUrl: `https://verify.assetflowx.example/${body.mode.toLowerCase()}/${credentialId}`,
        issuer: body.mode === "VC" ? "did:web:assetflowx.example" : "AssetFlowX Academy",
        recipient: user.name,
        skills: ["Mock Skill 1", "Mock Skill 2", "Mock Skill 3"],
        assertion:
          body.mode === "OPEN_BADGE"
            ? {
                "@context": "https://w3id.org/openbadges/v2",
                type: "Assertion",
                id: `https://assetflowx.example/assertions/${credentialId}`,
                badge: {
                  type: "BadgeClass",
                  name: `${course.name} Certificate`,
                  description: `Completed ${course.name} with excellence`,
                  image: `https://assetflowx.example/badges/${body.courseId}.png`,
                  criteria: "Complete all modules and pass final assessment",
                  issuer: "AssetFlowX Academy",
                },
                recipient: { identity: body.userId },
                issuedOn: now,
              }
            : {
                "@context": ["https://www.w3.org/2018/credentials/v1"],
                type: ["VerifiableCredential", "CourseCompletionCredential"],
                issuer: "did:web:assetflowx.example",
                issuanceDate: now,
                credentialSubject: {
                  id: body.userId,
                  courseName: course.name,
                  completionDate: now,
                  grade: "A",
                },
              },
      }
    } else {
      // On-chain credential (ERC1155 or SBT)
      const mockTokenId = Math.floor(Math.random() * 1000).toString()
      const mockTxHash = `0xfakemint${body.mode.toLowerCase()}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`

      credential = {
        id: credentialId,
        userId: body.userId,
        courseId: body.courseId,
        courseName: course.name,
        type: body.mode,
        issuedAt: now,
        chain: "base-sepolia", // Mock chain
        contract: `0xMock${body.mode}Contract${Math.random().toString(36).substr(2, 9)}`,
        tokenId: mockTokenId,
        txHash: mockTxHash,
        issuer: "AssetFlowX Academy",
        recipient: user.wallet || user.name,
        skills: ["Mock Skill 1", "Mock Skill 2", "Mock Skill 3"],
        metadata: {
          name: `${course.name} Certificate`,
          description: `${body.mode} credential for completing ${course.name}`,
          image: `https://assetflowx.example/nft-metadata/${mockTokenId}.png`,
          attributes: [
            { trait_type: "Course", value: course.name },
            { trait_type: "Level", value: "Advanced" },
            { trait_type: "Grade", value: "A" },
            { trait_type: "Completion Date", value: now.split("T")[0] },
            ...(body.mode === "SBT"
              ? [{ trait_type: "Non-Transferable", value: "true" }]
              : []),
          ],
        },
      }
    }

    // Store credential
    credentialsStore.set(credentialId, credential)

    // Prepare response
    const response: IssueCredentialResponse =
      body.mode === "OPEN_BADGE" || body.mode === "VC"
        ? {
            credentialId,
            type: body.mode,
            verifyUrl: credential.verifyUrl,
          }
        : {
            credentialId,
            type: body.mode,
            contract: credential.contract,
            tokenId: credential.tokenId,
            txHash: credential.txHash,
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
    console.error("POST /api/credentials error:", error)
    return NextResponse.json(
      { error: "Failed to issue credential" },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET /api/credentials - List credentials with filters
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters
    const filters: CredentialFilters = {
      type: searchParams.get("type") as any,
      chain: searchParams.get("chain") as any,
      courseId: searchParams.get("courseId") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    }

    // Get all credentials
    let credentials = Array.from(credentialsStore.values())

    // Apply filters
    if (filters.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type]
      credentials = credentials.filter((c) => types.includes(c.type))
    }

    if (filters.chain) {
      credentials = credentials.filter((c) => c.chain === filters.chain)
    }

    if (filters.courseId) {
      credentials = credentials.filter((c) => c.courseId === filters.courseId)
    }

    // Sort by issuedAt descending (newest first)
    credentials.sort(
      (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
    )

    // Pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const total = credentials.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCredentials = credentials.slice(startIndex, endIndex)

    // Convert to summary format (exclude assertion/metadata for list view)
    const summaries: CredentialSummary[] = paginatedCredentials.map((c) => ({
      id: c.id,
      userId: c.userId,
      courseId: c.courseId,
      courseName: c.courseName,
      type: c.type,
      issuedAt: c.issuedAt,
      verifyUrl: c.verifyUrl,
      chain: c.chain,
      contract: c.contract,
      tokenId: c.tokenId,
      txHash: c.txHash,
    }))

    const response: PaginatedResponse<CredentialSummary> = {
      data: summaries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("GET /api/credentials error:", error)
    return NextResponse.json(
      { error: "Failed to fetch credentials" },
      { status: 500 }
    )
  }
}
