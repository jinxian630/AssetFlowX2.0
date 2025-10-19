"use client"

import { useEffect, useState } from "react"
import { Plus, RefreshCw } from "lucide-react"
import { Alert, AlertEvent } from "@/lib/types"
import { AlertRuleCard } from "@/components/alert-rule-card"
import { NewAlertDialog } from "@/components/new-alert-dialog"
import { AlertEventsTable } from "@/components/alert-events-table"
import { LoadingKPI } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [events, setEvents] = useState<AlertEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [alertsRes, eventsRes] = await Promise.all([
        fetch("/api/alerts"),
        fetch("/api/alerts?type=events")
      ])

      if (!alertsRes.ok || !eventsRes.ok) {
        throw new Error("Failed to fetch alert data")
      }

      const alertsData = await alertsRes.json()
      const eventsData = await eventsRes.json()

      setAlerts(alertsData.data)
      setEvents(eventsData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch("/api/alerts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, enabled })
      })

      if (!response.ok) {
        throw new Error("Failed to update alert")
      }

      const updated = await response.json()

      // Update local state
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? updated : alert))
      )
    } catch (err) {
      console.error("Error toggling alert:", err)
      // Could show a toast notification here
    }
  }

  const handleCreateAlert = async (newAlert: Omit<Alert, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAlert)
      })

      if (!response.ok) {
        throw new Error("Failed to create alert")
      }

      const created = await response.json()

      // Add to local state
      setAlerts((prev) => [created, ...prev])
    } catch (err) {
      console.error("Error creating alert:", err)
      // Could show a toast notification here
    }
  }

  // Calculate stats
  const stats = {
    total: alerts.length,
    active: alerts.filter((a) => a.enabled).length,
    triggered: events.length,
    highSeverity: alerts.filter((a) => a.severity === "high" && a.enabled).length
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Rules</h1>
          <p className="text-muted-foreground mt-1">
            Configure and monitor alert conditions
          </p>
        </div>
        <ErrorState
          title="Failed to load alerts"
          message={error}
          onRetry={fetchData}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Rules</h1>
          <p className="text-muted-foreground mt-1">
            Configure and monitor alert conditions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="brand" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Rule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {loading ? (
          <>
            <LoadingKPI />
            <LoadingKPI />
            <LoadingKPI />
            <LoadingKPI />
          </>
        ) : (
          <>
            <StatCard title="Total Rules" value={stats.total} />
            <StatCard title="Active Rules" value={stats.active} />
            <StatCard title="Triggered Today" value={stats.triggered} />
            <StatCard title="High Severity" value={stats.highSeverity} />
          </>
        )}
      </div>

      {/* Alert Rules */}
      {loading ? (
        <div className="space-y-4">
          <LoadingKPI />
          <LoadingKPI />
          <LoadingKPI />
        </div>
      ) : alerts.length === 0 ? (
        <div className="card p-8 text-center">
          <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">No Alert Rules</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first alert rule to start monitoring your assets
          </p>
          <Button variant="brand" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Rule
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertRuleCard
              key={alert.id}
              alert={alert}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Recent Alerts Stream */}
      {!loading && <AlertEventsTable events={events} />}

      {/* New Alert Dialog */}
      <NewAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateAlert}
      />
    </div>
  )
}
