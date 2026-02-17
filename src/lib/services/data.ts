import { Project, TimeEntry } from "@/types"

export const seedProjects: Project[] = [
  { id: "p1", name: "Website Redesign", client: "Acme Corp", color: "bg-primary", hexColor: "#6366f1", totalHours: 24.5, status: "Active" },
  { id: "p2", name: "Mobile App", client: "StartupXYZ", color: "bg-chart-2", hexColor: "#2dd4bf", totalHours: 18.2, status: "Active" },
  { id: "p3", name: "API Integration", client: "TechFlow", color: "bg-chart-4", hexColor: "#facc15", totalHours: 12.0, status: "Active" },
  { id: "p4", name: "Marketing Site", client: "BrandCo", color: "bg-destructive", hexColor: "#ef4444", totalHours: 8.5, status: "On Hold" },
]

const today = new Date().toISOString().split("T")[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

export const seedEntries: TimeEntry[] = [
  { id: "e1", task: "Design system component audit", projectId: "p1", duration: 5400, startTime: "09:00 AM", endTime: "10:30 AM", date: today, billable: true },
  { id: "e2", task: "Implement auth flow", projectId: "p2", duration: 3600, startTime: "10:45 AM", endTime: "11:45 AM", date: today, billable: true },
  { id: "e3", task: "Write API endpoint tests", projectId: "p3", duration: 2700, startTime: "01:00 PM", endTime: "01:45 PM", date: today, billable: false },
  { id: "e4", task: "Homepage wireframe review", projectId: "p1", duration: 1800, startTime: "02:00 PM", endTime: "02:30 PM", date: today, billable: true },
  { id: "e5", task: "Database schema design", projectId: "p3", duration: 4500, startTime: "09:30 AM", endTime: "10:45 AM", date: yesterday, billable: true },
  { id: "e6", task: "Sprint planning meeting", projectId: "p2", duration: 3600, startTime: "11:00 AM", endTime: "12:00 PM", date: yesterday, billable: false },
  { id: "e7", task: "Landing page copy", projectId: "p4", duration: 2400, startTime: "01:30 PM", endTime: "02:10 PM", date: yesterday, billable: true },
]

export const previousTasks = [
  "Design system component audit",
  "Implement auth flow",
  "Write API endpoint tests",
  "Homepage wireframe review",
  "Database schema design",
  "Sprint planning meeting",
  "Landing page copy",
  "Code review session",
]
