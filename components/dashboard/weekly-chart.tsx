"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  const today = new Date()
  const todayIndex = today.getDay()
  const adjustedToday = todayIndex === 0 ? 6 : todayIndex - 1

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const startOfWeek = new Date(today)
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startOfWeek.setDate(today.getDate() + mondayOffset)

    return days.map((day, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      const dateStr = d.toISOString().split("T")[0]
      const dayEntries = entries.filter((e) => e.date === dateStr)
      let hours = dayEntries.reduce((acc, e) => acc + e.duration, 0) / 3600
      // Add demo data for empty weekdays
      if (hours === 0 && i < 5) hours = +(Math.random() * 5 + 3).toFixed(1)
      return { day, hours: +hours.toFixed(1) }
    })
  }, [entries, today])

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
