"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/data-display/card"
import { Clock, DollarSign, TrendingUp } from "lucide-react"
import { useStore } from "@/lib/store"
import { TrackerService } from "@/lib/services/tracker"

export function ReportSummary() {
  const { entries } = useStore()
  
  const { totalHours, billableHours, avgDaily } = useMemo(() => TrackerService.getReportSummary(entries), [entries])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Hours</p>
              <p className="text-xl font-bold tabular-nums text-foreground">
                {totalHours}h
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-timer/10 text-timer">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Billable Hours
              </p>
              <p className="text-xl font-bold tabular-nums text-foreground">
                {billableHours}h
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Avg Daily Hours
              </p>
              <p className="text-xl font-bold tabular-nums text-foreground">
                {avgDaily}h
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
