"use client"

import { useCallback } from "react"
import { Header } from "@/components/layout/header"
import { TimerWidget } from "@/components/features/tracker/timer-widget"
import { StatsCards } from "@/components/features/tracker/stats-cards"
import { ActivityList } from "@/components/features/tracker/activity-list"
import { WeeklyChart } from "@/components/features/tracker/weekly-chart"
import { ProjectList } from "@/components/features/projects/project-list"

export default function DashboardPage() {
  const handleAddTask = useCallback(() => {
    const timerInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Task name"]'
    )
    timerInput?.focus()
    timerInput?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [])

  return (
    <>
      <Header
        title="Dashboard"
        breadcrumb="Dashboard"
        onAddTask={handleAddTask}
      />
      <TimerWidget />
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityList />
        </div>
        <div className="flex flex-col gap-6">
          <WeeklyChart />
          <ProjectList />
        </div>
      </div>
    </>
  )
}
