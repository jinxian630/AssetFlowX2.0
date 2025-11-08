// ============================================================================
// AssetFlowX - Job Card Component
// Displays job position with company icon and direct apply functionality
// ============================================================================

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Clock, Building2 } from "lucide-react"
import type { JobPosition } from "@/types/job-matching"

interface JobCardProps {
  job: JobPosition
  onApply: (jobId: string) => void
  isApplying?: boolean
}

export function JobCard({ job, onApply, isApplying = false }: JobCardProps) {
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-6 space-y-4">
        {/* Header with Company Icon */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl border border-primary/10">
            {job.companyLogo || "🏢"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-sm">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>

        {/* Job Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{job.experience}</span>
          </div>
          {job.location && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{job.skills.length - 4}
            </Badge>
          )}
        </div>

        {/* Apply Button */}
        <Button
          onClick={() => onApply(job.id)}
          disabled={isApplying}
          className="w-full"
          size="lg"
        >
          {isApplying ? "Applying..." : "Apply Now"}
        </Button>
      </div>

      {/* Hover Accent */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  )
}
