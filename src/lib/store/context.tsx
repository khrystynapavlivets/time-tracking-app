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
import { supabase } from "@/lib/api/supabase"
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
      
      // Update project total hours
      if (newEntry.projectId) {
        const updatedProject = await projectRepo.getById(newEntry.projectId)
        if (updatedProject) {
          setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
        }
      }
    } catch (error) {
      console.error("Failed to add entry:", error)
    }
  }, [timeEntryRepo, projectRepo])

  const updateEntry = useCallback(async (id: string, data: Partial<TimeEntry>) => {
    try {
      const oldEntry = entries.find(e => e.id === id)
      const updated = await timeEntryRepo.update(id, data)
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))

      // Update project total hours if duration or project changed
      if (oldEntry && (data.duration !== undefined || data.projectId !== undefined)) {
        // Update old project if project changed
        if (oldEntry.projectId && oldEntry.projectId !== updated.projectId) {
           const oldProject = await projectRepo.getById(oldEntry.projectId)
           if (oldProject) {
             setProjects((prev) => prev.map((p) => (p.id === oldProject.id ? oldProject : p)))
           }
        }
        // Update current/new project
        if (updated.projectId) {
          const currentProject = await projectRepo.getById(updated.projectId)
          if (currentProject) {
            setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? currentProject : p)))
          }
        }
      }
    } catch (error) {
      console.error("Failed to update entry:", error)
    }
  }, [timeEntryRepo, projectRepo, entries])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const entry = entries.find(e => e.id === id)
      await timeEntryRepo.delete(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
      
      // Update project total hours
      if (entry?.projectId) {
        const updatedProject = await projectRepo.getById(entry.projectId)
        if (updatedProject) {
          setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
        }
      }
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
  }, [timeEntryRepo, projectRepo, entries])

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
