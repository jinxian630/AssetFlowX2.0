// ============================================================================
// AssetFlowX - Job Match Result Dialog
// Displays AI analysis results with qualification status
// ============================================================================

"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, FileText, ExternalLink, Sparkles } from "lucide-react"
import type { JobMatchResult } from "@/types/job-matching"

interface JobMatchResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: JobMatchResult
  jobTitle: string
  companyName: string
}

export function JobMatchResultDialog({
  open,
  onOpenChange,
  result,
  jobTitle,
  companyName,
}: JobMatchResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {result.qualified ? (
              <>
                <div className="rounded-full bg-green-500/10 p-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <DialogTitle className="text-green-600 dark:text-green-400">
                    You Are Qualified!
                  </DialogTitle>
                  <DialogDescription>
                    Your resume has been sent to {companyName}
                  </DialogDescription>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full bg-yellow-500/10 p-2">
                  <XCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <DialogTitle className="text-yellow-600 dark:text-yellow-400">
                    Not Available for This Position
                  </DialogTitle>
                  <DialogDescription>
                    Please review the company documents to improve your qualifications
                  </DialogDescription>
                </div>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Match Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Match Score</span>
              <span className="text-lg font-bold">{result.matchScore}%</span>
            </div>
            <Progress value={result.matchScore} className="h-3" />
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Skills Match</p>
              <div className="flex items-center gap-2">
                <Progress value={result.analysis.skillsMatch} className="h-2 flex-1" />
                <span className="text-sm font-medium">{result.analysis.skillsMatch}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Experience</p>
              <div className="flex items-center gap-2">
                <Progress value={result.analysis.experienceMatch} className="h-2 flex-1" />
                <span className="text-sm font-medium">{result.analysis.experienceMatch}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Education</p>
              <div className="flex items-center gap-2">
                <Progress value={result.analysis.educationMatch} className="h-2 flex-1" />
                <span className="text-sm font-medium">{result.analysis.educationMatch}%</span>
              </div>
            </div>
          </div>

          {/* Matched Skills */}
          {result.matchedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map((skill, idx) => (
                  <Badge key={idx} variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Requirements */}
          {result.missingRequirements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Missing Requirements</h4>
              <ul className="space-y-1">
                {result.missingRequirements.map((req, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Documents (if not qualified) */}
          {!result.qualified && result.companyDocuments && result.companyDocuments.length > 0 && (
            <div className="rounded-lg border bg-yellow-500/5 border-yellow-500/20 p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-2">Please Go Through Company Documents</h4>
                  <ul className="space-y-2">
                    {result.companyDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{doc}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6"
                          onClick={() => {
                            // In production, this would open the document
                            console.log("Open document:", doc)
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendation */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium mb-2">AI Recommendation</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {result.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {result.qualified && (
              <Button onClick={() => {
                // In production, this would navigate to application status
                onOpenChange(false)
              }}>
                View Application Status
              </Button>
            )}
            {!result.qualified && (
              <Button variant="default" onClick={() => {
                // Navigate to company documents or courses
                onOpenChange(false)
              }}>
                Review Documents
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

