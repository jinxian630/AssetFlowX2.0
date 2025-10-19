"use client"

// ============================================================================
// AssetFlowX - RangeTabs Component
// Time range selector with URL sync
// ============================================================================

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TimeRange = "24h" | "7d" | "30d" | "all"

interface RangeTabsProps {
  value: TimeRange
  onValueChange?: (value: TimeRange) => void
}

export function RangeTabs({ value, onValueChange }: RangeTabsProps) {
  const handleRangeChange = (newRange: string) => {
    const range = newRange as TimeRange
    onValueChange?.(range)
  }

  return (
    <Tabs value={value} onValueChange={handleRangeChange}>
      <TabsList className="bg-muted/50">
        <TabsTrigger
          value="24h"
          aria-label="Last 24 hours"
          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          24H
        </TabsTrigger>
        <TabsTrigger
          value="7d"
          aria-label="Last 7 days"
          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          7D
        </TabsTrigger>
        <TabsTrigger
          value="30d"
          aria-label="Last 30 days"
          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          30D
        </TabsTrigger>
        <TabsTrigger
          value="all"
          aria-label="All time"
          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          ALL
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
