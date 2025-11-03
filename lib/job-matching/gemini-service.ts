// ============================================================================
// AssetFlowX - Gemini Service for Job Matching
// AI-powered resume to job position matching using Gemini 2.5 Flash
// ============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai"
import type { JobPosition, ResumeAnalysis, JobMatchResult } from "@/types/job-matching"
import type { CredentialSummary } from "@/types/payments"

// Initialize Gemini client
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please configure it in .env.local"
    )
  }
  
  return new GoogleGenerativeAI(apiKey)
}

// Parse JSON response from Gemini
function parseGeminiResponse(text: string): any {
  try {
    let cleaned = text.trim()
    
    // Remove markdown code blocks if present
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }
    
    // Try to parse JSON
    try {
      return JSON.parse(cleaned)
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the text
      console.warn("Direct JSON parse failed, attempting to extract JSON:", parseError)
      
      // Try to find JSON object in the text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0])
        } catch (e) {
          console.error("Failed to parse extracted JSON:", jsonMatch[0])
          throw e
        }
      }
      
      throw parseError
    }
  } catch (error) {
    console.error("Failed to parse Gemini response. Text length:", text.length)
    console.error("Response preview:", text.substring(0, 500))
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Build prompt for job matching
function buildJobMatchingPrompt(
  resumeText: string,
  jobPosition: JobPosition,
  userCredentials?: CredentialSummary[]
): string {
  const credentialsInfo = userCredentials && userCredentials.length > 0
    ? `\n**User Credentials (from credential tracking):**\n${userCredentials.map(c => `- ${c.courseName} (${c.type})`).join("\n")}`
    : ""

  return `Analyze resume against job position. Return ONLY valid JSON.

**Job:** ${jobPosition.title} at ${jobPosition.company}
**Requirements:** ${jobPosition.requirements.join("; ")}
**Skills:** ${jobPosition.skills.join(", ")}
**Experience:** ${jobPosition.experience}

**Resume:**
${resumeText}

${credentialsInfo}

**Required JSON:**
{
  "qualified": boolean,
  "matchScore": number (0-100),
  "analysis": {
    "skillsMatch": number (0-100),
    "experienceMatch": number (0-100),
    "educationMatch": number (0-100),
    "overallMatch": number (0-100)
  },
  "missingRequirements": ["array"],
  "matchedSkills": ["array"],
  "recommendation": "string",
  "companyDocuments": ["optional array"]
}

**Scoring Guidelines (CRITICAL - Follow Exactly):**

**Skills Match (0-100):**
- Count required skills found in resume
- Formula: (found skills / total required skills) × 100
- Round to nearest whole number
- Example: 4 out of 7 skills = 57%, 5 out of 8 skills = 63%

**Experience Match (0-100):**
- Parse years/level from resume and compare to job requirement
- Exact match or exceeds = 100
- Within 1 year = 85, within 2 years = 70, within 3 years = 50, 3+ years short = 0
- No experience shown = 0

**Education Match (0-100):**
- Required degree present = 100
- Similar/related degree = 75
- Partial education = 50
- No relevant education = 0
- If job doesn't specify education requirement, use 100

**Overall Match (0-100):**
- MUST use exact formula: (skillsMatch × 0.4) + (experienceMatch × 0.4) + (educationMatch × 0.2)
- Calculate precisely and round to 2 decimal places
- Example: (57 × 0.4) + (5 × 0.4) + (40 × 0.2) = 22.8 + 2.0 + 8.0 = 32.8%

**Qualified Threshold:**
- overallMatch >= 70 = TRUE
- overallMatch < 70 = FALSE
- Be strict with this threshold

**Critical Instructions:**
1. Count skills precisely - be exact, don't estimate
2. Use the EXACT formulas provided above - no approximations
3. Apply scoring consistently across all candidates
4. Consider user credentials as additional evidence of skills/education
5. Be objective - don't inflate or deflate scores
6. Return ONLY valid JSON, no markdown formatting or code blocks
7. If uncertain about a requirement, default to NOT having it

**JSON Response Requirements:**
- All scores must be numbers between 0-100
- Arrays must contain strings only
- No null values except in companyDocuments (optional field)
- Ensure JSON is valid and parseable

Analyze the resume now. Use precise calculations. Return ONLY the JSON response:`
}

// Analyze resume and match against job position
export async function matchResumeToJob(
  resumeText: string,
  jobPosition: JobPosition,
  userCredentials?: CredentialSummary[]
): Promise<JobMatchResult> {
  try {
    const genAI = getGeminiClient()
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash"
    
    // Use consistent generation config for reproducible results
    const generationConfig = {
      temperature: 0.1, // Low temperature for consistent, deterministic outputs
      topP: 0.95, // Higher topP for more reliable completion
      topK: 50, // Slightly higher for better completion
      maxOutputTokens: 4096, // Increased for complete JSON responses
    }
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig 
    })
    
    const prompt = buildJobMatchingPrompt(resumeText, jobPosition, userCredentials)
    
    const geminiResult = await model.generateContent(prompt)
    const response = await geminiResult.response
    const text = response.text()
    
    // Parse and validate response
    const parsed = parseGeminiResponse(text)
    
    // Validate structure
    if (typeof parsed.qualified !== "boolean") {
      throw new Error("Invalid qualified field in AI response")
    }
    
    if (typeof parsed.matchScore !== "number" || parsed.matchScore < 0 || parsed.matchScore > 100) {
      throw new Error("Invalid matchScore in AI response")
    }
    
    // Calculate and normalize scores
    const skillsMatch = Math.round((parsed.analysis?.skillsMatch || 0) * 100) / 100
    const experienceMatch = Math.round((parsed.analysis?.experienceMatch || 0) * 100) / 100
    const educationMatch = Math.round((parsed.analysis?.educationMatch || 0) * 100) / 100
    
    // Recalculate overall match to ensure consistency with formula
    // Formula: (skillsMatch × 0.4) + (experienceMatch × 0.4) + (educationMatch × 0.2)
    const calculatedOverallMatch = Math.round(
      (skillsMatch * 0.4 + experienceMatch * 0.4 + educationMatch * 0.2) * 100
    ) / 100
    
    // Use calculated overall match, fallback to AI if within reasonable tolerance
    const overallMatch = Math.abs(calculatedOverallMatch - (parsed.analysis?.overallMatch || 0)) < 5
      ? calculatedOverallMatch
      : calculatedOverallMatch
    
    // Ensure all arrays exist and build result
    const matchResult: JobMatchResult = {
      qualified: calculatedOverallMatch >= 70, // Enforce consistent qualified threshold
      matchScore: calculatedOverallMatch, // Use calculated score
      analysis: {
        skillsMatch,
        experienceMatch,
        educationMatch,
        overallMatch,
      },
      missingRequirements: Array.isArray(parsed.missingRequirements) ? parsed.missingRequirements : [],
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      recommendation: parsed.recommendation || "No recommendation provided",
      companyDocuments: Array.isArray(parsed.companyDocuments) ? parsed.companyDocuments : undefined,
    }
    
    return matchResult
  } catch (error) {
    console.error("Gemini job matching error:", error)
    
    // Fallback result
    return {
      qualified: false,
      matchScore: 0,
      analysis: {
        skillsMatch: 0,
        experienceMatch: 0,
        educationMatch: 0,
        overallMatch: 0,
      },
      missingRequirements: ["Unable to analyze resume"],
      matchedSkills: [],
      recommendation: error instanceof Error 
        ? `Analysis failed: ${error.message}. Please try again or contact support.`
        : "Analysis failed. Please try again.",
    }
  }
}

// Extract text from uploaded file (PDF, DOCX, TXT)
// Note: This function is kept for backward compatibility, but actual parsing
// is now handled by the /api/resume/parse endpoint for better performance and security
export async function extractResumeText(file: File): Promise<string> {
  // For text files, extract directly
  if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
    return await file.text()
  }
  
  // For PDF and DOCX, send to API endpoint
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/resume/parse", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to parse file")
  }

  const data = await response.json()
  return data.text
}


