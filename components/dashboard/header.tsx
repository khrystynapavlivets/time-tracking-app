"use client"

import { Button } from "@/components/ui/button"
import { Plus, CalendarDays } from "lucide-react"

interface HeaderProps {
  title: string
  breadcrumb: string
  onAddTask?: () => void
  showAddButton?: boolean
}

export function DashboardHeader({
  title,
  breadcrumb,
  onAddTask,
  showAddButton = true,
}: HeaderProps) {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <nav
          className="mb-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-1.5">
            <li>
              <span className="cursor-pointer transition-colors hover:text-foreground">
                Home
              </span>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/50">
              /
            </li>
            <li>
              <span className="font-medium text-foreground">
                {breadcrumb}
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        {showAddButton && onAddTask && (
          <Button onClick={onAddTask} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </div>
    </header>
  )
}
