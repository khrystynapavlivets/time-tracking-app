import { TimeEntry, Project } from "@/types"

export function generateTimeReportCsv(entries: TimeEntry[], getProject: (id: string) => Project | undefined) {
  const headers = ["Task", "Project", "Duration (h)", "Date", "Billable"]
  const rows = entries.map((e) => {
    const project = getProject(e.projectId)
    return [
      e.task,
      project?.name || "Unknown",
      (e.duration / 3600).toFixed(2),
      e.date,
      e.billable ? "Yes" : "No",
    ]
  })
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
  return csv
}

export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
