"use client"

// ============================================================================
// AssetFlowX - RecentCredentialsWidget Component
// List of recent credentials (6 items max)
// ============================================================================

import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { CredentialSummary, CredType } from "@/types/payments"
import Link from "next/link"
import { ExternalLink, Award, Shield } from "lucide-react"

interface RecentCredentialsWidgetProps {
  credentials: CredentialSummary[]
  maxItems?: number
}

export function RecentCredentialsWidget({
  credentials,
  maxItems = 6,
}: RecentCredentialsWidgetProps) {
  const recent = credentials.slice(0, maxItems)

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recent Credentials</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Latest {maxItems} issued credentials
          </p>
        </div>
        <Link
          href="/credentials"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          aria-label="View all credentials"
        >
          View all
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No credentials issued yet
        </div>
      ) : (
        <div className="space-y-4">
          {recent.map((credential) => (
            <Link
              key={credential.id}
              href={`/credentials/${credential.id}`}
              className="block p-4 rounded-xl border hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`View credential ${credential.id} for ${credential.courseName}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                    {credential.type === "SBT" || credential.type === "ERC1155" ? (
                      <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    ) : (
                      <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate" title={credential.courseName}>
                      {credential.courseName}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                      {credential.id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(credential.issuedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <CredTypeBadge type={credential.type} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CredTypeBadge({ type }: { type: CredType }) {
  const variants: Record<CredType, { label: string; variant: "default" | "secondary" | "outline" }> = {
    OPEN_BADGE: { label: "Badge", variant: "secondary" },
    VC: { label: "VC", variant: "secondary" },
    ERC1155: { label: "NFT", variant: "default" },
    SBT: { label: "SBT", variant: "default" },
  }

  const { label, variant } = variants[type]

  return (
    <Badge variant={variant} className="flex-shrink-0">
      {label}
    </Badge>
  )
}
