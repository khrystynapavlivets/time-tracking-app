"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Clock, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore, type TimeEntry } from "@/lib/store"

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatDurationInput(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}:${m.toString().padStart(2, "0")}`
}

function parseDurationInput(value: string): number | null {
  const parts = value.split(":")
  if (parts.length === 2) {
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (!isNaN(h) && !isNaN(m)) return h * 3600 + m * 60
  }
  const hMatch = value.match(/(\d+)\s*h/)
  const mMatch = value.match(/(\d+)\s*m/)
  if (hMatch || mMatch) {
    const h = hMatch ? parseInt(hMatch[1], 10) : 0
    const m = mMatch ? parseInt(mMatch[1], 10) : 0
    return h * 3600 + m * 60
  }
  return null
}

interface EditState {
  id: string
  field: "task" | "project" | "duration"
  value: string
}

export function ActivityList() {
  const { entries, projects, getProject, updateEntry, deleteEntry } = useStore()
  const [editState, setEditState] = useState<EditState | null>(null)

  const today = new Date().toISOString().split("T")[0]
  const todayEntries = entries.filter((e) => e.date === today)

  // Group by project
  const grouped = todayEntries.reduce<Record<string, TimeEntry[]>>(
    (acc, entry) => {
      const key = entry.projectId
      if (!acc[key]) acc[key] = []
      acc[key].push(entry)
      return acc
    },
    {}
  )

  const groupedArr = Object.entries(grouped).map(([projectId, items]) => ({
    projectId,
    project: getProject(projectId),
    items,
    totalSeconds: items.reduce((s, e) => s + e.duration, 0),
  }))

  const startEdit = (id: string, field: "task" | "project" | "duration", currentValue: string) => {
    setEditState({ id, field, value: currentValue })
  }

  const cancelEdit = () => setEditState(null)

  const saveEdit = () => {
    if (!editState) return
    const { id, field, value } = editState
    if (field === "task") {
      updateEntry(id, { task: value })
    } else if (field === "project") {
      updateEntry(id, { projectId: value })
    } else if (field === "duration") {
      const seconds = parseDurationInput(value)
      if (seconds !== null) updateEntry(id, { duration: seconds })
    }
    setEditState(null)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {"Today's Activity"}
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {todayEntries.length}{" "}
            {todayEntries.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {todayEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No time entries yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              Start the timer to track your first task
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {groupedArr.map(({ projectId, project, items, totalSeconds }) => (
              <div key={projectId}>
                {/* Group header */}
                <div className="flex items-center justify-between bg-muted/40 px-6 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: project?.hexColor || "#888",
                      }}
                    />
                    <span className="text-sm font-semibold text-foreground">
                      {project?.name || "Unknown Project"}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                    {formatDuration(totalSeconds)}
                  </span>
                </div>

                {/* Entries */}
                <div className="divide-y divide-border/50">
                  {items.map((entry) => (
                    <div
                      key={entry.id}
                      className="group flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/30"
                    >
                      {/* Color indicator */}
                      <div
                        className="h-8 w-1 shrink-0 rounded-full"
                        style={{
                          backgroundColor: project?.hexColor || "#888",
                        }}
                      />

                      {/* Task info (inline editable) */}
                      <div className="min-w-0 flex-1">
                        {editState?.id === entry.id &&
                        editState.field === "task" ? (
                          <div className="flex items-center gap-1.5">
                            <Input
                              value={editState.value}
                              onChange={(e) =>
                                setEditState({
                                  ...editState,
                                  value: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit()
                                if (e.key === "Escape") cancelEdit()
                              }}
                              className="h-7 text-sm"
                              autoFocus
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={saveEdit}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={cancelEdit}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            className="truncate text-sm font-medium text-foreground hover:underline cursor-pointer text-left"
                            onClick={() =>
                              startEdit(entry.id, "task", entry.task)
                            }
                          >
                            {entry.task}
                          </button>
                        )}

                        {editState?.id === entry.id &&
                        editState.field === "project" ? (
                          <div className="mt-1 flex items-center gap-1.5">
                            <Select
                              value={editState.value}
                              onValueChange={(v) => {
                                setEditState({ ...editState, value: v })
                              }}
                            >
                              <SelectTrigger className="h-7 w-40 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {projects.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    <span className="flex items-center gap-1.5">
                                      <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                          backgroundColor: p.hexColor,
                                        }}
                                      />
                                      {p.name}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={saveEdit}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={cancelEdit}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            className="mt-0.5 cursor-pointer"
                            onClick={() =>
                              startEdit(
                                entry.id,
                                "project",
                                entry.projectId
                              )
                            }
                          >
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal hover:bg-secondary/80"
                            >
                              {project?.name || "Unknown"}
                            </Badge>
                          </button>
                        )}
                      </div>

                      {/* Duration (inline editable) */}
                      <div className="hidden shrink-0 text-right sm:block">
                        {editState?.id === entry.id &&
                        editState.field === "duration" ? (
                          <div className="flex items-center gap-1.5">
                            <Input
                              value={editState.value}
                              onChange={(e) =>
                                setEditState({
                                  ...editState,
                                  value: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit()
                                if (e.key === "Escape") cancelEdit()
                              }}
                              className="h-7 w-20 font-mono text-sm"
                              autoFocus
                              placeholder="1:30"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={saveEdit}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            className="cursor-pointer text-right"
                            onClick={() =>
                              startEdit(
                                entry.id,
                                "duration",
                                formatDurationInput(entry.duration)
                              )
                            }
                          >
                            <p className="font-mono text-sm font-semibold tabular-nums text-foreground hover:underline">
                              {formatDuration(entry.duration)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entry.startTime} - {entry.endTime}
                            </p>
                          </button>
                        )}
                      </div>

                      {/* Delete action */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                        aria-label={`Delete ${entry.task}`}
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
