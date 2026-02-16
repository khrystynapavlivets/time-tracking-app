"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Project {
  id: string
  name: string
  client: string
  color: string // Tailwind bg class e.g. "bg-primary"
  hexColor: string // hex for color picker e.g. "#6366f1"
  totalHours: number
  status: "Active" | "Completed" | "On Hold"
}

export interface TimeEntry {
  id: string
  task: string
  projectId: string
  duration: number // seconds
  startTime: string
  endTime: string
  date: string // YYYY-MM-DD
  billable: boolean
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

const seedProjects: Project[] = [
  { id: "p1", name: "Website Redesign", client: "Acme Corp", color: "bg-primary", hexColor: "#6366f1", totalHours: 24.5, status: "Active" },
  { id: "p2", name: "Mobile App", client: "StartupXYZ", color: "bg-chart-2", hexColor: "#2dd4bf", totalHours: 18.2, status: "Active" },
  { id: "p3", name: "API Integration", client: "TechFlow", color: "bg-chart-4", hexColor: "#facc15", totalHours: 12.0, status: "Active" },
  { id: "p4", name: "Marketing Site", client: "BrandCo", color: "bg-destructive", hexColor: "#ef4444", totalHours: 8.5, status: "On Hold" },
]

const today = new Date().toISOString().split("T")[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

const seedEntries: TimeEntry[] = [
  { id: "e1", task: "Design system component audit", projectId: "p1", duration: 5400, startTime: "09:00 AM", endTime: "10:30 AM", date: today, billable: true },
  { id: "e2", task: "Implement auth flow", projectId: "p2", duration: 3600, startTime: "10:45 AM", endTime: "11:45 AM", date: today, billable: true },
  { id: "e3", task: "Write API endpoint tests", projectId: "p3", duration: 2700, startTime: "01:00 PM", endTime: "01:45 PM", date: today, billable: false },
  { id: "e4", task: "Homepage wireframe review", projectId: "p1", duration: 1800, startTime: "02:00 PM", endTime: "02:30 PM", date: today, billable: true },
  { id: "e5", task: "Database schema design", projectId: "p3", duration: 4500, startTime: "09:30 AM", endTime: "10:45 AM", date: yesterday, billable: true },
  { id: "e6", task: "Sprint planning meeting", projectId: "p2", duration: 3600, startTime: "11:00 AM", endTime: "12:00 PM", date: yesterday, billable: false },
  { id: "e7", task: "Landing page copy", projectId: "p4", duration: 2400, startTime: "01:30 PM", endTime: "02:10 PM", date: yesterday, billable: true },
]

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface AppStore {
  projects: Project[]
  entries: TimeEntry[]
  addProject: (p: Omit<Project, "id" | "totalHours">) => void
  updateProject: (id: string, data: Partial<Project>) => void
  deleteProject: (id: string) => void
  addEntry: (e: Omit<TimeEntry, "id">) => void
  updateEntry: (id: string, data: Partial<TimeEntry>) => void
  deleteEntry: (id: string) => void
  getProject: (id: string) => Project | undefined
}

const StoreContext = createContext<AppStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects)
  const [entries, setEntries] = useState<TimeEntry[]>(seedEntries)

  const addProject = useCallback((p: Omit<Project, "id" | "totalHours">) => {
    const newProject: Project = { ...p, id: `p-${Date.now()}`, totalHours: 0 }
    setProjects((prev) => [...prev, newProject])
  }, [])

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addEntry = useCallback((e: Omit<TimeEntry, "id">) => {
    const newEntry: TimeEntry = { ...e, id: `e-${Date.now()}` }
    setEntries((prev) => [newEntry, ...prev])
  }, [])

  const updateEntry = useCallback((id: string, data: Partial<TimeEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  )

  return (
    <StoreContext.Provider
      value={{
        projects,
        entries,
        addProject,
        updateProject,
        deleteProject,
        addEntry,
        updateEntry,
        deleteEntry,
        getProject,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
