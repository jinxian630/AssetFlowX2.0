"use client"

// ============================================================================
// AssetFlowX - Credential Detail Page
// Full detail view for a single credential
// ============================================================================

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { CopyText } from "@/components/ui/copy-button"
import { ExplorerLink } from "@/components/ui/explorer-link"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { formatDate } from "@/lib/date"
import { toast } from "sonner"
import { ArrowLeft, Copy, Award, FileCheck, Sparkles, Shield, ExternalLink } from "lucide-react"
import type { CredentialDetail } from "@/types/payments"

interface CredentialDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CredentialDetailPage({ params }: CredentialDetailPageProps) {
  const router = useRouter()
  const [credential, setCredential] = useState<CredentialDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [credentialId, setCredentialId] = useState<string>("")

  useEffect(() => {
    const loadParams = async () => {
      const { id } = await params
      setCredentialId(id)
    }
    loadParams()
  }, [params])

  // Fetch credential details
  useEffect(() => {
    if (!credentialId) return

    const fetchCredential = async () => {
      try {
        setIsLoading(true)
        setError("")
        const response = await api.credentials.getById(credentialId)
        setCredential(response)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch credential"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredential()
  }, [credentialId])

  const handleCopyAll = () => {
    if (!credential) return
    const credData = JSON.stringify(credential, null, 2)
    navigator.clipboard.writeText(credData)
    toast.success("Credential data copied!")
  }

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "OPEN_BADGE":
        return <Award className="h-6 w-6" />
      case "VC":
        return <FileCheck className="h-6 w-6" />
      case "ERC1155":
        return <Sparkles className="h-6 w-6" />
      case "SBT":
        return <Shield className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !credential) {
    return (
      <div className="space-y-6">
        <PageHeading title="Credential Not Found" description="" />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error || "Credential not found"}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/credentials")}
          >
            Back to Credentials
          </Button>
        </div>
      </div>
    )
  }

  const isOnChain = credential.type === "ERC1155" || credential.type === "SBT"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <PageHeading
        title="Credential Details"
        description={credential.courseName}
        action={
          <div className="flex items-center gap-2 text-primary">
            {getCredentialIcon(credential.type)}
            <StatusBadge status={credential.type} />
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Basic Information */}
        <div className="space-y-6">
          {/* Credential Info Card */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Credential Information</h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-muted-foreground">Credential ID</label>
                <CopyText text={credential.id} truncate={false} />
              </div>

              <Separator />

              <div>
                <label className="text-muted-foreground">Type</label>
                <p className="mt-1 font-medium">{credential.type}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Issuer</label>
                <p className="mt-1 font-medium">{credential.issuer}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Recipient</label>
                <p className="mt-1 font-medium">{credential.recipient}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Issued At</label>
                <p className="mt-1 font-medium">{formatDate(credential.issuedAt)}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Course</label>
                <p className="mt-1 font-medium">{credential.courseName}</p>
              </div>
            </div>
          </div>

          {/* Skills Earned */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Skills Earned</h3>
            <div className="flex flex-wrap gap-2">
              {credential.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Type-Specific Details */}
        <div className="space-y-6">
          {/* On-chain or Off-chain Details */}
          {isOnChain ? (
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-lg">On-Chain Details</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-muted-foreground">Chain</label>
                  <p className="mt-1 font-medium">{credential.chain}</p>
                </div>

                <Separator />

                <div>
                  <label className="text-muted-foreground">Contract Address</label>
                  <CopyText text={credential.contract || ""} truncate={false} />
                </div>

                <div>
                  <label className="text-muted-foreground">Token ID</label>
                  <p className="mt-1 font-mono">{credential.tokenId}</p>
                </div>

                <Separator />

                <div>
                  <label className="text-muted-foreground">Transaction Hash</label>
                  <CopyText text={credential.txHash || ""} truncate={false} />
                </div>

                <ExplorerLink
                  txHash={credential.txHash || ""}
                  chain={credential.chain!}
                  variant="outline"
                  className="w-full"
                />

                {credential.metadata && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-muted-foreground">NFT Metadata</label>
                      <div className="mt-2 space-y-2">
                        <p className="font-medium">{credential.metadata.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {credential.metadata.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {credential.metadata.attributes.map((attr, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="text-muted-foreground">{attr.trait_type}:</span>
                              <br />
                              <span className="font-medium">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-lg">Off-Chain Details</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-muted-foreground">Verification URL</label>
                  <a
                    href={credential.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 text-primary hover:underline"
                  >
                    {credential.verifyUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <Separator />

                {credential.assertion && (
                  <div>
                    <label className="text-muted-foreground">Assertion Data</label>
                    <pre className="mt-2 rounded-lg border bg-muted p-3 text-xs overflow-auto max-h-64">
                      {JSON.stringify(credential.assertion, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw JSON */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Raw Data</h3>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>
            <pre className="rounded-lg border bg-muted p-4 text-xs overflow-auto max-h-96">
              {JSON.stringify(credential, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
