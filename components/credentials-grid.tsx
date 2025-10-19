"use client"

// ============================================================================
// AssetFlowX - CredentialsGrid Component
// Grid display for credentials with card layout
// ============================================================================

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ExplorerText } from "@/components/ui/explorer-link"
import { CopyButton } from "@/components/ui/copy-button"
import { formatDate } from "@/lib/date"
import { Award, ExternalLink, FileCheck, Shield, Sparkles } from "lucide-react"
import type { CredentialSummary } from "@/types/payments"

interface CredentialsGridProps {
  credentials: CredentialSummary[]
  onCredentialClick: (credential: CredentialSummary) => void
}

export function CredentialsGrid({
  credentials,
  onCredentialClick,
}: CredentialsGridProps) {
  if (credentials.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No credentials found</p>
      </div>
    )
  }

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "OPEN_BADGE":
        return <Award className="h-5 w-5" />
      case "VC":
        return <FileCheck className="h-5 w-5" />
      case "ERC1155":
        return <Sparkles className="h-5 w-5" />
      case "SBT":
        return <Shield className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {credentials.map((credential) => {
        const isOnChain = credential.type === "ERC1155" || credential.type === "SBT"

        return (
          <Card
            key={credential.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCredentialClick(credential)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-primary">
                  {getCredentialIcon(credential.type)}
                  <StatusBadge status={credential.type} />
                </div>
                {isOnChain && credential.chain && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {credential.chain}
                  </span>
                )}
              </div>

              {/* Course Name */}
              <div>
                <h3 className="font-semibold text-lg line-clamp-2">
                  {credential.courseName}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Issued {formatDate(credential.issuedAt)}
                </p>
              </div>

              {/* Credential ID */}
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                  {credential.id}
                </code>
                <CopyButton text={credential.id} size="sm" />
              </div>

              {/* Details based on type */}
              {isOnChain ? (
                <>
                  {credential.tokenId && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Token ID: </span>
                      <span className="font-mono">{credential.tokenId}</span>
                    </div>
                  )}
                  {credential.txHash && (
                    <div className="text-sm">
                      <ExplorerText
                        txHash={credential.txHash}
                        chain={credential.chain!}
                        truncate
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {credential.verifyUrl && (
                    <a
                      href={credential.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Verify Credential
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </>
              )}

              {/* View Details Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onCredentialClick(credential)
                }}
              >
                View Details
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
