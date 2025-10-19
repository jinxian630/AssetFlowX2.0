// ============================================================================
// AssetFlowX - StatCard Component
// KPI/metric cards for dashboards
// ============================================================================

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  change?: {
    value: number
    label: string
  }
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  className,
}: StatCardProps) {
  const changeColor = change
    ? change.value >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400"
    : ""

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium", changeColor)}>
              {change.value >= 0 ? "+" : ""}
              {change.value}% {change.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
