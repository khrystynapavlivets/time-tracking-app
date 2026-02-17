"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import { Project, TimeEntry } from "@/types"
import { seedProjects, seedEntries } from "@/lib/services/data"
import { supabase } from "@/lib/supabase"
import { SupabaseProjectRepository } from "@/lib/repositories/supabase-project-repository"
import { SupabaseTimeEntryRepository } from "@/lib/repositories/supabase-time-entry-repository"

interface AppStore {
  projects: Project[]
  entries: TimeEntry[]
  isLoading: boolean
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
  const [projects, setProjects] = useState<Project[]>([])
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize repositories
  const projectRepo = useMemo(() => new SupabaseProjectRepository(supabase), [])
  const timeEntryRepo = useMemo(() => new SupabaseTimeEntryRepository(supabase), [])

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [loadedProjects, loadedEntries] = await Promise.all([
          projectRepo.getAll(),
          timeEntryRepo.getAll(),
        ])
        setProjects(loadedProjects)
        setEntries(loadedEntries)
      } catch (error) {
        console.error("Failed to load data:", error)
        // Fallback to seed data if DB is empty or fails (optional, good for demo)
        setProjects(current => current.length === 0 ? seedProjects : current)
        setEntries(current => current.length === 0 ? seedEntries : current)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [projectRepo, timeEntryRepo])

  const addProject = useCallback(async (p: Omit<Project, "id" | "totalHours">) => {
    try {
      const projectWithDefaults = { ...p, totalHours: 0 }
      const newProject = await projectRepo.create(projectWithDefaults)
      setProjects((prev) => [newProject, ...prev])
    } catch (error) {
      console.error("Failed to add project:", error)
    }
  }, [projectRepo])

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const updated = await projectRepo.update(id, data)
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    } catch (error) {
      console.error("Failed to update project:", error)
    }
  }, [projectRepo])

  const deleteProject = useCallback(async (id: string) => {
    try {
      await projectRepo.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }, [projectRepo])

  const addEntry = useCallback(async (e: Omit<TimeEntry, "id">) => {
    try {
      const newEntry = await timeEntryRepo.create(e)
      setEntries((prev) => [newEntry, ...prev])
      
      // Update project total hours (optimistic update or re-fetch)
      // For now, let's keep it simple
    } catch (error) {
      console.error("Failed to add entry:", error)
    }
  }, [timeEntryRepo])

  const updateEntry = useCallback(async (id: string, data: Partial<TimeEntry>) => {
    try {
      const updated = await timeEntryRepo.update(id, data)
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    } catch (error) {
      console.error("Failed to update entry:", error)
    }
  }, [timeEntryRepo])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await timeEntryRepo.delete(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
  }, [timeEntryRepo])

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
        isLoading,
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
