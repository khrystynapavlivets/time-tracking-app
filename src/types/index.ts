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
