"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Clock, DollarSign, TrendingUp } from "lucide-react"
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

export function ReportsPage() {
  const { entries, getProject } = useStore()
  const [viewMode, setViewMode] = useState<ViewMode>("week")

  const today = useMemo(() => new Date(), [])

  const chartData = useMemo(() => {
    if (viewMode === "day") {
      // Show hours per hour of the day (0-23)
      const hours = Array.from({ length: 24 }, (_, i) => ({
        label: `${i.toString().padStart(2, "0")}:00`,
        hours: 0,
      }))
      const todayStr = today.toISOString().split("T")[0]
      entries
        .filter((e) => e.date === todayStr)
        .forEach((e) => {
          // Approximate: distribute evenly over start hour
          const hourMatch = e.startTime.match(/(\d+):/)
          if (hourMatch) {
            let h = parseInt(hourMatch[1], 10)
            if (e.startTime.includes("PM") && h !== 12) h += 12
            if (e.startTime.includes("AM") && h === 12) h = 0
            if (h >= 0 && h < 24) {
              hours[h].hours += e.duration / 3600
            }
          }
        })
      return hours
    }

    if (viewMode === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const data = days.map((day) => ({ label: day, hours: 0 }))
      // Get date for each day of the current week
      const startOfWeek = new Date(today)
      const dayOfWeek = today.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      startOfWeek.setDate(today.getDate() + mondayOffset)

      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        const dateStr = d.toISOString().split("T")[0]
        const dayEntries = entries.filter((e) => e.date === dateStr)
        data[i].hours = dayEntries.reduce((acc, e) => acc + e.duration, 0) / 3600
      }

      // Add some demo data for days without entries
      data.forEach((d, i) => {
        if (d.hours === 0 && i < 5) {
          d.hours = +(Math.random() * 6 + 2).toFixed(1)
        }
      })

      return data
    }

    // Month view: 4 weeks
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]
    return weeks.map((label, i) => ({
      label,
      hours: +(Math.random() * 35 + 15).toFixed(1) + (i === 3 ? entries.reduce((a, e) => a + e.duration, 0) / 3600 : 0),
    }))
  }, [entries, viewMode, today])

  // Summary stats
  const totalHours = useMemo(() => {
    const total = entries.reduce((acc, e) => acc + e.duration, 0)
    return (total / 3600).toFixed(1)
  }, [entries])

  const billableHours = useMemo(() => {
    const total = entries
      .filter((e) => e.billable)
      .reduce((acc, e) => acc + e.duration, 0)
    return (total / 3600).toFixed(1)
  }, [entries])

  const avgDaily = useMemo(() => {
    const uniqueDates = new Set(entries.map((e) => e.date))
    const total = entries.reduce((acc, e) => acc + e.duration, 0)
    const days = Math.max(uniqueDates.size, 1)
    return (total / 3600 / days).toFixed(1)
  }, [entries])

  // Get the current day index for highlighting (Mon=0, Sun=6)
  const todayIdx =
    viewMode === "week"
      ? today.getDay() === 0
        ? 6
        : today.getDay() - 1
      : -1

  const exportCsv = () => {
    const headers = ["Task", "Project", "Duration (h)", "Date", "Billable"]
    const rows = entries.map((e) => {
      const project = getProject(e.projectId)
      return [
        e.task,
        project?.name || "Unknown",
        (e.duration / 3600).toFixed(2),
        e.date,
        e.billable ? "Yes" : "No",
      ]
    })
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `time-report-${today.toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Analyze your time tracking data and export reports.
          </p>
        </div>
        <Button onClick={exportCsv} variant="outline" className="gap-1.5">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
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

      {/* Chart */}
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

      {/* Project breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Project Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {(() => {
              const projectTotals = entries.reduce<
                Record<string, number>
              >((acc, e) => {
                acc[e.projectId] = (acc[e.projectId] || 0) + e.duration
                return acc
              }, {})
              const totalSecs = Object.values(projectTotals).reduce(
                (a, b) => a + b,
                0
              )
              return Object.entries(projectTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([pid, secs]) => {
                  const project = getProject(pid)
                  const pct =
                    totalSecs > 0
                      ? Math.round((secs / totalSecs) * 100)
                      : 0
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
                })
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
