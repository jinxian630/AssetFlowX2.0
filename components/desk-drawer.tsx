"use client"

// ============================================================================
// AssetFlowX - DeskDrawer Component
// Right-side drawer with Widgets | Filters | Activity tabs
// ============================================================================

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pin, PinOff, Activity, Filter, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeskDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Widget = "kpi-inflow" | "kpi-outflow" | "kpi-net" | "recent-activity" | "mini-chart"

export function DeskDrawer({ open, onOpenChange }: DeskDrawerProps) {
  const [activeTab, setActiveTab] = useState<"widgets" | "filters" | "activity">("widgets")
  const [pinnedWidgets, setPinnedWidgets] = useState<Widget[]>(["kpi-inflow", "recent-activity"])

  const togglePin = (widget: Widget) => {
    setPinnedWidgets((prev) =>
      prev.includes(widget)
        ? prev.filter((w) => w !== widget)
        : [...prev, widget]
    )
  }

  const availableWidgets: { id: Widget; name: string; description: string }[] = [
    { id: "kpi-inflow", name: "Inflow KPI", description: "Quick view of total inflows" },
    { id: "kpi-outflow", name: "Outflow KPI", description: "Quick view of total outflows" },
    { id: "kpi-net", name: "Net Flow KPI", description: "Net flow summary" },
    { id: "recent-activity", name: "Recent Activity", description: "Latest flow transactions" },
    { id: "mini-chart", name: "Mini Chart", description: "Compact flow visualization" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto focus-visible:outline-none"
      >
        <SheetHeader>
          <SheetTitle>Desk</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="widgets"
              className="gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Widgets tab"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              <span>Widgets</span>
            </TabsTrigger>
            <TabsTrigger
              value="filters"
              className="gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Filters tab"
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span>Filters</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Activity tab"
            >
              <Activity className="h-4 w-4" aria-hidden="true" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-4 mt-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Available Widgets</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Pin widgets to keep them easily accessible
              </p>
              <div className="space-y-2">
                {availableWidgets.map((widget) => {
                  const isPinned = pinnedWidgets.includes(widget.id)
                  return (
                    <div
                      key={widget.id}
                      className={cn(
                        "flex items-start justify-between p-3 rounded-lg border transition-colors",
                        isPinned ? "bg-primary/5 border-primary/20" : "bg-card"
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">{widget.name}</h4>
                          {isPinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {widget.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 ml-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => togglePin(widget.id)}
                        aria-label={isPinned ? `Unpin ${widget.name}` : `Pin ${widget.name}`}
                      >
                        {isPinned ? (
                          <PinOff className="h-4 w-4 text-primary" aria-hidden="true" />
                        ) : (
                          <Pin className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-4 mt-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Quick Filters</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Save and apply common filter combinations
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Apply inflow only filter"
                >
                  Inflow Only
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Apply outflow only filter"
                >
                  Outflow Only
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Apply last 7 days filter"
                >
                  Last 7 Days
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Apply Base chain only filter"
                >
                  Base Chain Only
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Latest flow transactions and events
              </p>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border bg-card space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-flow-inflow/10 text-flow-inflow"
                      >
                        Inflow
                      </Badge>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <p className="text-sm font-medium">$1,234.56</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      0x1234...5678
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
