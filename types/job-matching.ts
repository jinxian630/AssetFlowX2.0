// ============================================================================
// AssetFlowX - Job Matching Types
// Type definitions for AI-powered resume to job matching
// ============================================================================

export interface JobPosition {
  id: string
  title: string
  company: string
  companyLogo?: string // Company logo URL or icon name
  description: string
  requirements: string[]
  skills: string[]
  experience: string // e.g., "2-5 years"
  location?: string
  salary?: string
  companyDocuments?: string[] // URLs or document IDs for company training materials
}

export interface ResumeAnalysis {
  skills: string[]
  experience: string
  education: string[]
  certifications: string[]
  summary: string
}

export interface JobMatchResult {
  qualified: boolean
  matchScore: number // 0-100
  analysis: {
    skillsMatch: number // 0-100
    experienceMatch: number // 0-100
    educationMatch: number // 0-100
    overallMatch: number // 0-100
  }
  missingRequirements: string[]
  matchedSkills: string[]
  recommendation: string
  companyDocuments?: string[] // Documents to review if not qualified
}

export interface JobMatchRequest {
  resumeText: string
  jobPositionId: string
  userCredentials?: string[] // Credential IDs from user's credential tracking
}

export interface JobMatchResponse {
  qualified: boolean
  matchResult: JobMatchResult
  message: string
  resumeSent?: boolean // If qualified and auto-submitted
}

