"use client"

import { Card, CardContent } from "@/components/ui/data-display/card"
import { Clock, Target, TrendingUp, Zap } from "lucide-react"
import { useStore } from "@/lib/store"
import { TrackerService } from "@/lib/services/tracker"

export function StatsCards() {
  const { entries } = useStore()
  
  const { todayHours, taskCount, billableHours, weekHours } = TrackerService.getDailyStats(entries)

  const stats = [
    {
      label: "Today",
      value: `${todayHours}h`,
      subtitle: "Hours tracked",
      icon: Clock,
      accentClass: "bg-primary/10 text-primary",
    },
    {
      label: "Tasks",
      value: String(taskCount),
      subtitle: "Completed today",
      icon: Target,
      accentClass: "bg-chart-2/10 text-chart-2",
    },
    {
      label: "Billable",
      value: `${billableHours}h`,
      subtitle: "Billable hours today",
      icon: Zap,
      accentClass: "bg-chart-4/10 text-chart-4",
    },
    {
      label: "This Week",
      value: `${weekHours}h`,
      subtitle: "Total tracked",
      icon: TrendingUp,
      accentClass: "bg-timer/10 text-timer",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.accentClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold leading-tight tabular-nums text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
