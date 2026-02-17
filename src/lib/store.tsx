"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
  const projectRepo = new SupabaseProjectRepository(supabase)
  const timeEntryRepo = new SupabaseTimeEntryRepository(supabase)

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
        if (projects.length === 0) setProjects(seedProjects)
        if (entries.length === 0) setEntries(seedEntries)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const addProject = useCallback(async (p: Omit<Project, "id" | "totalHours">) => {
    try {
      const projectWithDefaults = { ...p, totalHours: 0 }
      const newProject = await projectRepo.create(projectWithDefaults)
      setProjects((prev) => [newProject, ...prev])
    } catch (error) {
      console.error("Failed to add project:", error)
    }
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const updated = await projectRepo.update(id, data)
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    } catch (error) {
      console.error("Failed to update project:", error)
    }
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    try {
      await projectRepo.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }, [])

  const addEntry = useCallback(async (e: Omit<TimeEntry, "id">) => {
    try {
      const newEntry = await timeEntryRepo.create(e)
      setEntries((prev) => [newEntry, ...prev])
      
      // Update project total hours (optimistic update or re-fetch)
      // For now, let's keep it simple
    } catch (error) {
      console.error("Failed to add entry:", error)
    }
  }, [])

  const updateEntry = useCallback(async (id: string, data: Partial<TimeEntry>) => {
    try {
      const updated = await timeEntryRepo.update(id, data)
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    } catch (error) {
      console.error("Failed to update entry:", error)
    }
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await timeEntryRepo.delete(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
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
