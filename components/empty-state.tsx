import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = "No data available",
  message = "There's nothing to display yet.",
  icon,
  action
}: EmptyStateProps) {
  return (
    <div className="card p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="rounded-full p-3 bg-muted">
          {icon || <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={action.label}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
