// ============================================================================
// AssetFlowX - PageHeading Component
// Consistent page headers across the application
// ============================================================================

import { cn } from "@/lib/utils"

interface PageHeadingProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeading({
  title,
  description,
  action,
  className,
}: PageHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight brand-gradient-text">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
