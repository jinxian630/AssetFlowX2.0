// ============================================================================
// AssetFlowX - Job Matching Page
// AI-powered resume to job position matching with credential tracking
// ============================================================================

"use client"

import { useState, useEffect } from "react"
import { JobCard } from "@/components/job-card"
import { JobMatchResultDialog } from "@/components/job-match-result-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Sparkles, Briefcase } from "lucide-react"
import { api } from "@/lib/api"
import type { JobPosition, JobMatchResult } from "@/types/job-matching"
import type { CredentialSummary } from "@/types/payments"

export default function JobMatchingPage() {
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null)
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null)
  const [userCredentials, setUserCredentials] = useState<CredentialSummary[]>([])

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoadingJobs(true)
        const response = await fetch("/api/job-matching")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch jobs (${response.status})`)
        }
        const data = await response.json()
        setJobs(data.jobs || [])
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
        toast.error(error instanceof Error ? error.message : "Failed to load job positions")
      } finally {
        setIsLoadingJobs(false)
      }
    }

    fetchJobs()
  }, [])

  // Fetch user credentials
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await api.credentials.list({ limit: 100 })
        setUserCredentials(response.data)
      } catch (error) {
        console.error("Failed to fetch credentials:", error)
        // Continue without credentials
      }
    }

    fetchCredentials()
  }, [])

  // Handle job application
  const handleApply = async (jobId: string) => {
    // In a real application, this would fetch the user's resume from their profile
    // For now, we'll use a placeholder resume text
    const mockResumeText = `
      Professional Summary:
      Experienced software developer with 5+ years in web development.

      Skills:
      - JavaScript, TypeScript, React, Next.js
      - Web3.js, Ethers.js, Solidity
      - Node.js, Python
      - UI/UX Design, Tailwind CSS

      Experience:
      - Senior Developer at Tech Company (3 years)
      - Full Stack Developer at Startup (2 years)

      Education:
      - BS in Computer Science
    `

    try {
      setApplyingJobId(jobId)
      const job = jobs.find((j) => j.id === jobId)
      setSelectedJob(job || null)

      toast.info("AI is analyzing your qualifications...", {
        description: "This may take a few seconds",
      })

      const response = await fetch("/api/job-matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: mockResumeText.trim(),
          jobPositionId: jobId,
          userCredentials: userCredentials.map((c) => c.id),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.details
          ? `${error.error}: ${error.details}`
          : error.error || "Failed to submit application"
        throw new Error(errorMessage)
      }

      const data = await response.json()

      setMatchResult(data.matchResult)

      if (data.qualified) {
        toast.success(data.message || "Application submitted successfully!")
      } else {
        toast.warning(data.message || "Application submitted - Please review requirements")
      }

      setShowResultDialog(true)
    } catch (error) {
      console.error("Job application error:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application"
      )
    } finally {
      setApplyingJobId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Job Matching</h1>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Browse available positions and apply with one click. AI will analyze your qualifications instantly.
        </p>
      </div>

      {/* Job Cards Grid */}
      {isLoadingJobs ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              isApplying={applyingJobId === job.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs available</h3>
          <p className="text-muted-foreground">Check back later for new opportunities</p>
        </div>
      )}

      {/* Result Dialog */}
      {matchResult && selectedJob && (
        <JobMatchResultDialog
          open={showResultDialog}
          onOpenChange={setShowResultDialog}
          result={matchResult}
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
        />
      )}
    </div>
  )
}

