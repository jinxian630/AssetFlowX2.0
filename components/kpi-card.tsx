"use client"

// ============================================================================
// AssetFlowX - KpiCard Component
// Enhanced KPI card with optional delta/change indicator
// ============================================================================

import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface KpiCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  delta?: {
    value: number // percentage change
    label?: string // e.g., "vs last period"
  }
  className?: string
}

export function KpiCard({ label, value, icon: Icon, delta, className }: KpiCardProps) {
  const deltaColor = delta
    ? delta.value >= 0
      ? "text-flow-inflow"
      : "text-flow-outflow"
    : ""

  const deltaBgColor = delta
    ? delta.value >= 0
      ? "bg-flow-inflow/10"
      : "bg-flow-outflow/10"
    : ""

  const DeltaIcon = delta && delta.value >= 0 ? TrendingUp : TrendingDown

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md ring-1 ring-white/5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="text-5xl font-bold tabular-nums">{value}</p>
          {delta && (
            <Badge
              variant="secondary"
              className={cn(
                "gap-1.5 font-medium",
                deltaBgColor,
                deltaColor
              )}
            >
              <DeltaIcon className="h-3.5 w-3.5" />
              <span>
                {delta.value >= 0 ? "+" : ""}
                {delta.value.toFixed(1)}%
              </span>
              {delta.label && (
                <span className="text-muted-foreground ml-1">{delta.label}</span>
              )}
            </Badge>
          )}
        </div>
        {Icon && (
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}
