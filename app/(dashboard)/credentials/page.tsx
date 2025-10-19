"use client"

// ============================================================================
// AssetFlowX - Credentials Page
// View and manage all credentials with filters and grid display
// ============================================================================

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeading } from "@/components/ui/page-heading"
import { CredentialsGrid } from "@/components/credentials-grid"
import { CredentialsFilters } from "@/components/credentials-filters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"
import type { CredentialSummary, CredType, ChainId } from "@/types/payments"

export default function CredentialsPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<CredentialSummary[]>([])
  const [filteredCredentials, setFilteredCredentials] = useState<CredentialSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  // Filters
  const [typeFilter, setTypeFilter] = useState<CredType | "ALL">("ALL")
  const [chainFilter, setChainFilter] = useState<ChainId | "ALL">("ALL")

  // Fetch credentials
  const fetchCredentials = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await api.credentials.list()
      setCredentials(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch credentials"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...credentials]

    if (typeFilter !== "ALL") {
      filtered = filtered.filter((c) => c.type === typeFilter)
    }

    if (chainFilter !== "ALL") {
      filtered = filtered.filter((c) => c.chain === chainFilter)
    }

    setFilteredCredentials(filtered)
  }, [credentials, typeFilter, chainFilter])

  // Navigate to credential detail page
  const handleCredentialClick = (credential: CredentialSummary) => {
    router.push(`/credentials/${credential.id}`)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setTypeFilter("ALL")
    setChainFilter("ALL")
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Credentials"
        description={`Viewing ${filteredCredentials.length} of ${credentials.length} credentials`}
        action={
          <Button variant="outline" size="sm" onClick={fetchCredentials}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      />

      {/* Filters */}
      <CredentialsFilters
        typeFilter={typeFilter}
        chainFilter={chainFilter}
        onTypeChange={setTypeFilter}
        onChainChange={setChainFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchCredentials}>
            Try Again
          </Button>
        </div>
      )}

      {/* Credentials Grid */}
      {!isLoading && !error && (
        <CredentialsGrid
          credentials={filteredCredentials}
          onCredentialClick={handleCredentialClick}
        />
      )}
    </div>
  )
}
