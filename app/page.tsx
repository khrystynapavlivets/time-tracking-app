"use client"

import { useState, useCallback } from "react"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { TimerWidget } from "@/components/dashboard/timer-widget"
import { ActivityList } from "@/components/dashboard/activity-list"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { ProjectList } from "@/components/dashboard/project-list"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProjectsPage } from "@/components/dashboard/projects-page"
import { ReportsPage } from "@/components/dashboard/reports-page"
import { SettingsPage } from "@/components/dashboard/settings-page"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StoreProvider } from "@/lib/store"

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState("dashboard")

  const handleAddTask = useCallback(() => {
    const timerInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Task name"]'
    )
    timerInput?.focus()
    timerInput?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        activeItem={activeNav}
        onNavigate={setActiveNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      <ScrollArea className="flex-1">
        <main className="flex flex-col gap-6 p-6 lg:p-8">
          {activeNav === "dashboard" && (
            <>
              <DashboardHeader
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
          )}

          {activeNav === "projects" && (
            <>
              <DashboardHeader
                title="Projects"
                breadcrumb="Projects"
                showAddButton={false}
              />
              <ProjectsPage />
            </>
          )}

          {activeNav === "reports" && (
            <>
              <DashboardHeader
                title="Reports"
                breadcrumb="Reports"
                showAddButton={false}
              />
              <ReportsPage />
            </>
          )}

          {activeNav === "settings" && (
            <>
              <DashboardHeader
                title="Settings"
                breadcrumb="Settings"
                showAddButton={false}
              />
              <SettingsPage />
            </>
          )}
        </main>
      </ScrollArea>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  )
}
