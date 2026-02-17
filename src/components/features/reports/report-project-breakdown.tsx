"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { useStore } from "@/lib/store"
import { TrackerService } from "@/lib/services/tracker"

export function ReportProjectBreakdown() {
  const { entries, getProject } = useStore()
  
  const breakdown = TrackerService.getProjectBreakdown(entries)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Project Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {breakdown.map(({ pid, secs, pct }) => {
            const project = getProject(pid)
            return (
              <div key={pid} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          project?.hexColor || "#888",
                      }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {project?.name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono tabular-nums text-foreground">
                      {(secs / 3600).toFixed(1)}h
                    </span>
                    <span className="text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        project?.hexColor || "#888",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
