"use client"

// ============================================================================
// AssetFlowX - Verify Page
// Verify credentials by ID, URL, or On-chain
// ============================================================================

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeading } from "@/components/ui/page-heading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { api } from "@/lib/api"
import { formatDate } from "@/lib/date"
import { toast } from "sonner"
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { VerifyCredentialResponse } from "@/types/payments"

export default function VerifyPage() {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerifyCredentialResponse | null>(null)
  const [error, setError] = useState<string>("")

  // Form states
  const [credentialId, setCredentialId] = useState("")
  const [verifyUrl, setVerifyUrl] = useState("")
  const [contract, setContract] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [wallet, setWallet] = useState("")

  const handleVerifyById = async () => {
    if (!credentialId.trim()) {
      toast.error("Please enter a credential ID")
      return
    }

    try {
      setIsVerifying(true)
      setError("")
      setVerificationResult(null)

      toast.info("Verifying credential...")

      const response = await api.credentials.verify({ credentialId })
      setVerificationResult(response)

      if (response.valid) {
        toast.success("Credential is valid!")
      } else {
        toast.error("Credential is invalid")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyByUrl = async () => {
    if (!verifyUrl.trim()) {
      toast.error("Please enter a verification URL")
      return
    }

    try {
      setIsVerifying(true)
      setError("")
      setVerificationResult(null)

      toast.info("Verifying credential...")

      const response = await api.credentials.verify({ url: verifyUrl })
      setVerificationResult(response)

      if (response.valid) {
        toast.success("Credential is valid!")
      } else {
        toast.error("Credential is invalid")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyOnChain = async () => {
    if (!contract.trim() || !tokenId.trim()) {
      toast.error("Please enter contract address and token ID")
      return
    }

    try {
      setIsVerifying(true)
      setError("")
      setVerificationResult(null)

      toast.info("Verifying on-chain credential...")

      const response = await api.credentials.verify({
        contract,
        tokenId,
        wallet: wallet.trim() || undefined,
      })

      setVerificationResult(response)

      if (response.valid) {
        toast.success("Credential is valid!")
      } else {
        toast.error("Credential is invalid")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  const renderVerificationResult = () => {
    if (!verificationResult && !error) return null

    return (
      <div className="mt-6 rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          {verificationResult?.valid ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="font-semibold text-lg text-green-700 dark:text-green-400">
                Valid Credential
              </h3>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-500" />
              <h3 className="font-semibold text-lg text-red-700 dark:text-red-400">
                Invalid Credential
              </h3>
            </>
          )}
        </div>

        {verificationResult?.valid && (
          <>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <label className="text-muted-foreground">Type</label>
                <div className="mt-1">
                  <StatusBadge status={verificationResult.type} />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground">Course</label>
                <p className="mt-1 font-medium">{verificationResult.details.courseName}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Issuer</label>
                <p className="mt-1 font-medium">{verificationResult.details.issuer}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Recipient</label>
                <p className="mt-1 font-medium">{verificationResult.details.recipient}</p>
              </div>

              <div>
                <label className="text-muted-foreground">Issued At</label>
                <p className="mt-1 font-medium">
                  {formatDate(verificationResult.details.issuedAt)}
                </p>
              </div>

              {verificationResult.details.chain && (
                <div>
                  <label className="text-muted-foreground">Chain</label>
                  <p className="mt-1 font-medium">{verificationResult.details.chain}</p>
                </div>
              )}

              {verificationResult.details.owner && (
                <div className="col-span-2">
                  <label className="text-muted-foreground">Current Owner</label>
                  <p className="mt-1 font-mono text-xs">{verificationResult.details.owner}</p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <label className="text-muted-foreground text-sm">Skills Earned</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {verificationResult.details.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Verify Credentials"
        description="Verify the authenticity of credentials by ID, URL, or on-chain data"
      />

      <Tabs defaultValue="id" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="id">By Credential ID</TabsTrigger>
          <TabsTrigger value="url">By URL</TabsTrigger>
          <TabsTrigger value="onchain">On-Chain</TabsTrigger>
        </TabsList>

        {/* Verify by ID */}
        <TabsContent value="id" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credential-id">Credential ID</Label>
              <Input
                id="credential-id"
                placeholder="cred_badge_001"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyById()}
              />
              <p className="text-xs text-muted-foreground">
                Enter the unique credential identifier (e.g., cred_badge_001, cred_vc_002)
              </p>
            </div>

            <Button
              onClick={handleVerifyById}
              disabled={isVerifying}
              className="w-full"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify Credential
                </>
              )}
            </Button>
          </div>

          {renderVerificationResult()}
        </TabsContent>

        {/* Verify by URL */}
        <TabsContent value="url" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-url">Verification URL</Label>
              <Input
                id="verify-url"
                placeholder="https://verify.assetflowx.example/badge/cred_badge_001"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyByUrl()}
              />
              <p className="text-xs text-muted-foreground">
                Enter the verification URL provided with the off-chain credential
              </p>
            </div>

            <Button
              onClick={handleVerifyByUrl}
              disabled={isVerifying}
              className="w-full"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify Credential
                </>
              )}
            </Button>
          </div>

          {renderVerificationResult()}
        </TabsContent>

        {/* Verify On-Chain */}
        <TabsContent value="onchain" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract">Contract Address</Label>
              <Input
                id="contract"
                placeholder="0xFakeERC1155Contract1234567890abcdef1234567890"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token-id">Token ID</Label>
              <Input
                id="token-id"
                placeholder="42"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address (Optional)</Label>
              <Input
                id="wallet"
                placeholder="0xYourWalletAddress..."
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Verify that a specific wallet owns the credential
              </p>
            </div>

            <Button
              onClick={handleVerifyOnChain}
              disabled={isVerifying}
              className="w-full"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify On-Chain
                </>
              )}
            </Button>
          </div>

          {renderVerificationResult()}
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <p className="text-muted-foreground">
          <strong>Verification Methods:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
          <li>
            <strong>By ID:</strong> Verify using the unique credential identifier
          </li>
          <li>
            <strong>By URL:</strong> Verify off-chain credentials using their verification URL
          </li>
          <li>
            <strong>On-Chain:</strong> Verify NFT-based credentials by contract and token ID
          </li>
        </ul>
      </div>
    </div>
  )
}
