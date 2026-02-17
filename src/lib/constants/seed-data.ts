import { Project, TimeEntry } from "@/types"

export const seedProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    client: "Acme Corp",
    color: "bg-blue-500",
    hexColor: "#3b82f6",
    totalHours: 120,
    status: "Active",
  },
  {
    id: "2",
    name: "Mobile App",
    client: "Globex",
    color: "bg-green-500",
    hexColor: "#22c55e",
    totalHours: 45,
    status: "Active",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    client: "Soylent Corp",
    color: "bg-purple-500",
    hexColor: "#a855f7",
    totalHours: 10,
    status: "On Hold",
  },
]

export const seedEntries: TimeEntry[] = [
  {
    id: "1",
    task: "Initial Design",
    projectId: "1",
    duration: 3600,
    startTime: "09:00",
    endTime: "10:00",
    date: "2023-10-26",
    billable: true,
  },
  {
    id: "2",
    task: "API Integration",
    projectId: "2",
    duration: 7200,
    startTime: "10:30",
    endTime: "12:30",
    date: "2023-10-26",
    billable: true,
  },
]

