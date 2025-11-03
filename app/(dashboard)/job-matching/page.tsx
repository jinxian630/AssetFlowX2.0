// ============================================================================
// AssetFlowX - Job Matching Page
// AI-powered resume to job position matching with credential tracking
// ============================================================================

"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { ResumeUpload } from "@/components/resume-upload"
import { JobMatchResultDialog } from "@/components/job-match-result-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Sparkles, Briefcase, FileText, Award } from "lucide-react"
import { api } from "@/lib/api"
import type { JobPosition, JobMatchResult } from "@/types/job-matching"
import type { CredentialSummary } from "@/types/payments"

export default function JobMatchingPage() {
  const [resumeText, setResumeText] = useState("")
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [isMatching, setIsMatching] = useState(false)
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
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
        if (data.jobs && data.jobs.length > 0) {
          setSelectedJobId(data.jobs[0].id)
        }
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

  // Handle job matching
  const handleMatch = async () => {
    if (!resumeText.trim()) {
      toast.error("Please upload or paste your resume")
      return
    }

    if (!selectedJobId) {
      toast.error("Please select a job position")
      return
    }

    try {
      setIsMatching(true)
      toast.info("AI is analyzing your resume...", {
        description: "This may take a few seconds",
      })

      const response = await fetch("/api/job-matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobPositionId: selectedJobId,
          userCredentials: userCredentials.map((c) => c.id),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to match resume")
      }

      const data = await response.json()

      setMatchResult(data.matchResult)

      if (data.qualified) {
        toast.success(data.message || "Your resume has been sent!")
      } else {
        toast.warning(data.message || "You are not available for this position")
      }

      setShowResultDialog(true)
    } catch (error) {
      console.error("Job matching error:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to match resume"
      )
    } finally {
      setIsMatching(false)
    }
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Job Matching</h1>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-muted-foreground">
          AI-powered resume matching with credential tracking. Get instant feedback on your qualifications.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Resume Upload */}
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Resume
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload your resume file or paste the text content
            </p>
          </div>

          <ResumeUpload
            resumeText={resumeText}
            onResumeTextChange={setResumeText}
          />
        </Card>

        {/* Right Column - Job Selection */}
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Select Job Position
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose the position you want to apply for
            </p>
          </div>

          {isLoadingJobs ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job position" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedJob && (
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedJob.company}</p>
                  </div>
                  <p className="text-sm">{selectedJob.description}</p>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Required Skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.skills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-primary/10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                      {selectedJob.skills.length > 5 && (
                        <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                          +{selectedJob.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Experience: {selectedJob.experience}</p>
                    {selectedJob.location && <p>Location: {selectedJob.location}</p>}
                    {selectedJob.salary && <p>Salary: {selectedJob.salary}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Credentials Info */}
          {userCredentials.length > 0 && (
            <div className="rounded-lg border bg-primary/5 border-primary/20 p-4">
              <div className="flex items-start gap-2">
                <Award className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1">
                    Your Credentials ({userCredentials.length})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your credentials will be included in the AI analysis
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Match Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleMatch}
          disabled={!resumeText.trim() || !selectedJobId || isMatching}
          size="lg"
          className="min-w-[200px]"
        >
          {isMatching ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Match My Resume
            </>
          )}
        </Button>
      </div>

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

