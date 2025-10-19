// ============================================================================
// AssetFlowX - Credential Detail API Route
// GET /api/credentials/[id] - Get credential by ID with full details
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { credentialsStore } from "@/lib/payments-mock-store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const credential = credentialsStore.get(id)

    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(credential)
  } catch (error) {
    console.error(`GET /api/credentials/[id] error:`, error)
    return NextResponse.json(
      { error: "Failed to fetch credential" },
      { status: 500 }
    )
  }
}
