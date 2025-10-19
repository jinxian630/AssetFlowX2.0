"use client"

// ============================================================================
// AssetFlowX - ClaimCredential Component
// Claim credential after completing a course
// ============================================================================

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, CheckCircle2, XCircle, Award } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { mockCourses } from "@/lib/payments-mock-store"
import type { CredType } from "@/types/payments"

type ClaimState = "idle" | "claiming" | "success" | "error"

interface ClaimCredentialProps {
  userId?: string
  courseId?: string
  onSuccess?: (credentialId: string) => void
}

export function ClaimCredential({
  userId = "u_alice",
  courseId,
  onSuccess,
}: ClaimCredentialProps) {
  const router = useRouter()
  const [state, setState] = useState<ClaimState>("idle")
  const [error, setError] = useState<string>("")
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courseId || mockCourses[0].id
  )
  const [selectedType, setSelectedType] = useState<CredType>("OPEN_BADGE")

  const credentialTypes: { value: CredType; label: string; description: string }[] = [
    {
      value: "OPEN_BADGE",
      label: "OpenBadge",
      description: "Off-chain, W3C OpenBadges v2/v3 format",
    },
    {
      value: "VC",
      label: "Verifiable Credential",
      description: "Off-chain, W3C Verifiable Credential",
    },
    {
      value: "ERC1155",
      label: "ERC-1155 NFT",
      description: "On-chain, transferable NFT on Base Sepolia",
    },
    {
      value: "SBT",
      label: "Soulbound Token",
      description: "On-chain, non-transferable token",
    },
  ]

  const handleClaim = async () => {
    try {
      setState("claiming")
      setError("")

      toast.info("Issuing credential...")

      const response = await api.credentials.issue({
        userId,
        courseId: selectedCourseId,
        mode: selectedType,
      })

      setState("success")
      toast.success("Credential issued successfully!")

      if (onSuccess) {
        onSuccess(response.credentialId)
      }

      // Redirect to credential detail page after a short delay
      setTimeout(() => {
        router.push(`/credentials/${response.credentialId}`)
      }, 1500)
    } catch (err) {
      setState("error")
      const errorMessage = err instanceof Error ? err.message : "Failed to issue credential"
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const getButtonContent = () => {
    switch (state) {
      case "idle":
        return (
          <>
            <Award className="h-4 w-4 mr-2" />
            Claim Credential
          </>
        )
      case "claiming":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Issuing credential...
          </>
        )
      case "success":
        return (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Credential issued!
          </>
        )
      case "error":
        return (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Failed to issue
          </>
        )
    }
  }

  const isLoading = state === "claiming"
  const isComplete = state === "success"
  const hasError = state === "error"

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Claim Your Credential</h3>

        <div className="space-y-4">
          {/* Course Selection */}
          {!courseId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Course</label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Credential Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Credential Type</label>
            <Select
              value={selectedType}
              onValueChange={(v) => setSelectedType(v as CredType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {credentialTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {credentialTypes.find((t) => t.value === selectedType)?.description}
            </p>
          </div>

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={isLoading || isComplete}
            size="lg"
            className="w-full"
            variant={hasError ? "destructive" : isComplete ? "default" : "default"}
          >
            {getButtonContent()}
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {hasError && (
            <Button
              onClick={() => {
                setState("idle")
                setError("")
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <p className="text-muted-foreground">
          <strong>Note:</strong> This is a demo credential issuance. In production, credentials
          would only be issued after course completion verification.
        </p>
      </div>
    </div>
  )
}
