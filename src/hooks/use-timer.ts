import { useState, useEffect, useRef } from "react"

export interface TimerState {
  taskName: string
  selectedProject: string
  isRunning: boolean
  isPaused: boolean
  elapsed: number
  startTime: string | null
  lastTick?: number
}

interface UseTimerProps {
  initialProject?: string
  onStop?: (entry: {
    taskName: string
    projectId: string
    duration: number
    startTime: string
    endTime: string
    date: string
  }) => void
}

export function useTimer({ initialProject = "", onStop }: UseTimerProps = {}) {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [taskName, setTaskName] = useState("")
  const [selectedProject, setSelectedProject] = useState(initialProject)
  
  const startTimeRef = useRef<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("timer_state")
    if (savedState) {
      try {
        const parsed: TimerState = JSON.parse(savedState)
        if (parsed.taskName) setTaskName(parsed.taskName)
        if (parsed.selectedProject) setSelectedProject(parsed.selectedProject)
        setIsRunning(parsed.isRunning)
        setIsPaused(parsed.isPaused)
        
        if (parsed.startTime) {
          startTimeRef.current = new Date(parsed.startTime)
        }

        if (parsed.isRunning && !parsed.isPaused && parsed.lastTick) {
          const now = Date.now()
          const diffSeconds = Math.floor((now - parsed.lastTick) / 1000)
          setElapsed((parsed.elapsed || 0) + diffSeconds)
        } else {
          setElapsed(parsed.elapsed || 0)
        }
      } catch (e) {
        console.error("Failed to restore timer state:", e)
      }
    } else if (initialProject) {
      setSelectedProject(initialProject)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Save timer state to localStorage
  useEffect(() => {
    if (elapsed > 0 || taskName || isRunning) {
      const state: TimerState = {
        taskName,
        selectedProject,
        isRunning,
        isPaused,
        elapsed,
        startTime: startTimeRef.current?.toISOString() || null,
        lastTick: Date.now(),
      }
      localStorage.setItem("timer_state", JSON.stringify(state))
    }
  }, [taskName, selectedProject, isRunning, isPaused, elapsed])

  // Timer interval
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

  const start = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = new Date()
    }
    setIsRunning(true)
    setIsPaused(false)
  }

  const pause = () => {
    setIsPaused(true)
  }

  const stop = () => {
    if (elapsed > 0 && startTimeRef.current) {
      const endTime = new Date()
      
      onStop?.({
        taskName: taskName || "Untitled Task",
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
      })
    }
    
    setIsRunning(false)
    setIsPaused(false)
    setElapsed(0)
    setTaskName("")
    startTimeRef.current = null
    localStorage.removeItem("timer_state")
  }

  return {
    isRunning,
    isPaused,
    elapsed,
    taskName,
    setTaskName,
    selectedProject,
    setSelectedProject,
    start,
    pause,
    stop,
  }
}
