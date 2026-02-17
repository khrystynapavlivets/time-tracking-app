"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card"
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

export function WeeklyChart() {
  const { entries } = useStore()

  const weeklyData = useMemo(() => TrackerService.getWeeklyData(entries), [entries])
  
  const todayIndex = new Date().getDay()
  const adjustedToday = todayIndex === 0 ? 6 : todayIndex - 1

  const totalHours = weeklyData.reduce((acc, d) => acc + d.hours, 0).toFixed(1)
  const avgHours = (parseFloat(totalHours) / 7).toFixed(1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Weekly Overview
          </CardTitle>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Total:{" "}
              <span className="font-semibold text-foreground">
                {totalHours}h
              </span>
            </span>
            <span>
              Avg:{" "}
              <span className="font-semibold text-foreground">
                {avgHours}h
              </span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="day"
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
                width={35}
              />
              <Tooltip
                content={<CustomTooltipContent />}
                cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
              />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {weeklyData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === adjustedToday
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.25)"
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
