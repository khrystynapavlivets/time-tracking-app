"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { useStore } from "@/lib/store"
import { TrackerService } from "@/lib/services/tracker"

type ViewMode = "day" | "week" | "month"

function CustomTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="text-sm font-semibold text-primary">
        {payload[0].value.toFixed(1)}h tracked
      </p>
    </div>
  )
}

export function ReportCharts() {
  const { entries } = useStore()
  const [viewMode, setViewMode] = useState<ViewMode>("week")

  const chartData = useMemo(() => TrackerService.getReportChartData(entries, viewMode), [entries, viewMode])

  const today = new Date()
  const todayIdx =
    viewMode === "week"
      ? today.getDay() === 0
        ? 6
        : today.getDay() - 1
      : -1

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">
            Time Distribution
          </CardTitle>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickFormatter={(v: number) => `${v}h`}
                width={40}
              />
              <Tooltip
                content={<CustomTooltipContent />}
                cursor={{
                  fill: "hsl(var(--muted))",
                  radius: 4,
                }}
              />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      viewMode === "week" && index === todayIdx
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.3)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
