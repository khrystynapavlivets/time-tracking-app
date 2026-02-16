"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Play, Pause, Square, Circle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

const previousTasks = [
  "Design system component audit",
  "Implement auth flow",
  "Write API endpoint tests",
  "Homepage wireframe review",
  "Database schema design",
  "Sprint planning meeting",
  "Landing page copy",
  "Code review session",
]

export function TimerWidget() {
  const { projects, addEntry } = useStore()
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [taskName, setTaskName] = useState("")
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || "")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const startTimeRef = useRef<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = taskName.length > 0
    ? previousTasks.filter((t) =>
        t.toLowerCase().includes(taskName.toLowerCase())
      )
    : previousTasks

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, isPaused])

  const handleStart = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = new Date()
    }
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleStop = () => {
    if (elapsed > 0 && startTimeRef.current) {
      const endTime = new Date()
      addEntry({
        task: taskName || "Untitled Task",
        projectId: selectedProject,
        duration: elapsed,
        startTime: startTimeRef.current.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toISOString().split("T")[0],
        billable: true,
      })
    }
    setIsRunning(false)
    setIsPaused(false)
    setElapsed(0)
    setTaskName("")
    startTimeRef.current = null
  }

  return (
    <Card className="sticky top-0 z-20 overflow-hidden border-2 border-primary/20 shadow-sm">
      {/* Animated accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 h-1 w-full transition-colors duration-500",
          isRunning && !isPaused
            ? "bg-timer"
            : isRunning && isPaused
              ? "bg-chart-4"
              : "bg-primary/30"
        )}
      />
      {isRunning && !isPaused && (
        <div className="absolute left-0 top-0 h-1 w-full animate-pulse bg-timer/60" />
      )}

      <CardContent className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Task input & project selector */}
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 flex-1">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                  isRunning && !isPaused
                    ? "bg-timer/15"
                    : "bg-primary/10"
                )}
              >
                <Circle
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isRunning && !isPaused
                      ? "fill-timer text-timer"
                      : "fill-primary/40 text-primary/40"
                  )}
                />
              </div>
              <Popover
                open={showSuggestions}
                onOpenChange={setShowSuggestions}
              >
                <PopoverTrigger asChild>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="What are you working on?"
                      value={taskName}
                      onChange={(e) => {
                        setTaskName(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label="Task name"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-1"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Recent tasks
                  </p>
                  {filteredSuggestions.slice(0, 5).map((suggestion) => (
                    <button
                      key={suggestion}
                      className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={() => {
                        setTaskName(suggestion)
                        setShowSuggestions(false)
                        inputRef.current?.focus()
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                  {filteredSuggestions.length === 0 && (
                    <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                      No matching tasks
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
            >
              <SelectTrigger
                className="h-10 w-full sm:w-48"
                aria-label="Select project"
              >
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: project.hexColor }}
                      />
                      {project.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timer display & controls */}
          <div className="flex items-center gap-4">
            <div
              className="font-mono text-4xl font-bold tracking-widest text-foreground tabular-nums"
              role="timer"
              aria-live="polite"
              aria-label={`Timer: ${formatTime(elapsed)}`}
            >
              {formatTime(elapsed)}
            </div>

            <div className="flex items-center gap-2">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="icon"
                  className="h-11 w-11 rounded-full bg-timer text-timer-foreground hover:bg-timer/90"
                  aria-label="Start timer"
                >
                  <Play className="h-5 w-5 ml-0.5" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={isPaused ? handleStart : handlePause}
                    size="icon"
                    variant="outline"
                    className="h-11 w-11 rounded-full"
                    aria-label={isPaused ? "Resume timer" : "Pause timer"}
                  >
                    {isPaused ? (
                      <Play className="h-5 w-5 ml-0.5" />
                    ) : (
                      <Pause className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    onClick={handleStop}
                    size="icon"
                    variant="destructive"
                    className="h-11 w-11 rounded-full"
                    aria-label="Stop timer"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
