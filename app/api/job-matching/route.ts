// ============================================================================
// AssetFlowX - Job Matching API Route
// POST /api/job-matching - Match resume to job position using AI
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { matchResumeToJob } from "@/lib/job-matching/gemini-service"
import { getJobById } from "@/lib/job-matching/mock-jobs"
import { credentialsStore } from "@/lib/payments-mock-store"
import type { JobMatchRequest, JobMatchResponse } from "@/types/job-matching"
import type { CredentialSummary } from "@/types/payments"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JobMatchRequest

    // Check for API key configuration early
    if (!process.env.GENERATIVE_LANGUAGE_API_KEY) {
      return NextResponse.json(
        { 
          error: "AI service is not configured",
          details: "Generative Language API Key (GENERATIVE_LANGUAGE_API_KEY) environment variable is not set. Please configure it in .env.local"
        },
        { status: 503 }
      )
    }

    // Validate request
    if (!body.resumeText || !body.resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      )
    }

    if (!body.jobPositionId) {
      return NextResponse.json(
        { error: "Job position ID is required" },
        { status: 400 }
      )
    }

    // Get job position
    const jobPosition = getJobById(body.jobPositionId)
    if (!jobPosition) {
      return NextResponse.json(
        { error: "Job position not found" },
        { status: 404 }
      )
    }

    // Get user credentials if provided
    let userCredentials: CredentialSummary[] | undefined
    if (body.userCredentials && body.userCredentials.length > 0) {
      userCredentials = body.userCredentials
        .map((id) => {
          const cred = credentialsStore.get(id)
          if (cred) {
            return {
              id: cred.id,
              userId: cred.userId,
              courseId: cred.courseId,
              courseName: cred.courseName,
              type: cred.type,
              issuedAt: cred.issuedAt,
              verifyUrl: cred.verifyUrl,
              chain: cred.chain,
              contract: cred.contract,
              tokenId: cred.tokenId,
              txHash: cred.txHash,
            } as CredentialSummary
          }
          return null
        })
        .filter((c): c is CredentialSummary => c !== null)
    }

    // Match resume to job using AI
    const matchResult = await matchResumeToJob(
      body.resumeText,
      jobPosition,
      userCredentials
    )

    // Check if the result indicates a configuration error (API key missing)
    // This happens when the service returns a fallback result due to missing API key
    if (
      matchResult.matchScore === 0 &&
      matchResult.analysis.overallMatch === 0 &&
      (matchResult.recommendation?.includes("GENERATIVE_LANGUAGE_API_KEY") || 
       matchResult.recommendation?.includes("GEMINI_API_KEY") || 
       matchResult.recommendation?.includes("Generative Language API Key"))
    ) {
      return NextResponse.json(
        {
          error: "AI service is not configured",
          details: "Generative Language API Key (GENERATIVE_LANGUAGE_API_KEY) environment variable is not set. Please configure it in .env.local"
        },
        { status: 503 }
      )
    }

    // Prepare response
    const response: JobMatchResponse = {
      qualified: matchResult.qualified,
      matchResult,
      message: matchResult.qualified
        ? `Congratulations! Your resume has been sent to ${jobPosition.company}.`
        : `You are not available for this position. Please go through the company documents to improve your qualifications.`,
      resumeSent: matchResult.qualified, // Auto-send if qualified
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Job matching API error:", error)
    
    // Check if it's a configuration error
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    if (errorMessage.includes("GENERATIVE_LANGUAGE_API_KEY") || 
        errorMessage.includes("GEMINI_API_KEY") || 
        errorMessage.includes("Generative Language API Key")) {
      return NextResponse.json(
        {
          error: "AI service is not configured",
          details: "Generative Language API Key (GENERATIVE_LANGUAGE_API_KEY) environment variable is not set. Please configure it in .env.local"
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      {
        error: "Failed to match resume to job position",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

// GET - List all available job positions
export async function GET() {
  try {
    const { getAllJobs } = await import("@/lib/job-matching/mock-jobs")
    const jobs = getAllJobs()
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch job positions",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

