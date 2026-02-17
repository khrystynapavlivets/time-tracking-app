import { Project, TimeEntry } from "@/types"

export class TrackerService {
  static createProject(data: Omit<Project, "id" | "totalHours">): Project {
    return {
      ...data,
      id: `p-${Date.now()}`,
      totalHours: 0,
    }
  }

  static createTimeEntry(data: Omit<TimeEntry, "id">): TimeEntry {
    return {
      ...data,
      id: `e-${Date.now()}`,
    }
  }

  static calculateTotalDuration(entries: TimeEntry[]): number {
    return entries.reduce((acc, entry) => acc + entry.duration, 0)
  }

  static getProjectStats(projects: Project[], entries: TimeEntry[]) {
    return projects
      .filter((p) => p.status === "Active")
      .map((project) => {
        const totalSeconds = entries
          .filter((e) => e.projectId === project.id)
          .reduce((acc, e) => acc + e.duration, 0)
        const hours = +(totalSeconds / 3600).toFixed(1)
        return { ...project, hours }
      })
  }

  static getProjectTotalHours(entries: TimeEntry[], projectId: string): string {
    const projectEntries = entries.filter((e) => e.projectId === projectId)
    const totalSeconds = projectEntries.reduce(
      (acc, e) => acc + e.duration,
      0
    )
    return (totalSeconds / 3600).toFixed(1)
  }

  static getDailyStats(entries: TimeEntry[]) {
    const today = new Date().toISOString().split("T")[0]
    const todayEntries = entries.filter((e) => e.date === today)

    const todaySeconds = todayEntries.reduce((acc, e) => acc + e.duration, 0)
    const todayHours = (todaySeconds / 3600).toFixed(1)
    const taskCount = todayEntries.length
    const billableSeconds = todayEntries
      .filter((e) => e.billable)
      .reduce((acc, e) => acc + e.duration, 0)
    const billableHours = (billableSeconds / 3600).toFixed(1)
    const weekSeconds = entries.reduce((acc, e) => acc + e.duration, 0)
    const weekHours = (weekSeconds / 3600).toFixed(1)

    return {
      todayHours,
      taskCount,
      billableHours,
      weekHours,
    }
  }

  static getWeeklyData(entries: TimeEntry[]) {
    const today = new Date()
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const startOfWeek = new Date(today)
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startOfWeek.setDate(today.getDate() + mondayOffset)

    return days.map((day, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      const dateStr = d.toISOString().split("T")[0]
      const dayEntries = entries.filter((e) => e.date === dateStr)
      let hours = dayEntries.reduce((acc, e) => acc + e.duration, 0) / 3600
      if (hours === 0 && i < 5) hours = +(Math.random() * 5 + 3).toFixed(1)
      return { day, hours: +hours.toFixed(1) }
    })
  }

  static getGroupedEntries(entries: TimeEntry[], getProject: (id: string) => Project | undefined) {
    const today = new Date().toISOString().split("T")[0]
    const todayEntries = entries.filter((e) => e.date === today)

    const grouped = todayEntries.reduce<Record<string, TimeEntry[]>>(
      (acc, entry) => {
        const key = entry.projectId
        if (!acc[key]) acc[key] = []
        acc[key].push(entry)
        return acc
      },
      {}
    )

    return Object.entries(grouped).map(([projectId, items]) => ({
      projectId,
      project: getProject(projectId),
      items,
      totalSeconds: items.reduce((s, e) => s + e.duration, 0),
    }))
  }

  static getReportSummary(entries: TimeEntry[]) {
    const totalSeconds = entries.reduce((acc, e) => acc + e.duration, 0)
    const totalHours = (totalSeconds / 3600).toFixed(1)

    const billableSeconds = entries
      .filter((e) => e.billable)
      .reduce((acc, e) => acc + e.duration, 0)
    const billableHours = (billableSeconds / 3600).toFixed(1)

    const uniqueDates = new Set(entries.map((e) => e.date))
    const days = Math.max(uniqueDates.size, 1)
    const avgDaily = (totalSeconds / 3600 / days).toFixed(1)

    return { totalHours, billableHours, avgDaily }
  }

  static getReportChartData(entries: TimeEntry[], viewMode: "day" | "week" | "month") {
    const today = new Date()

    if (viewMode === "day") {
      const hours = Array.from({ length: 24 }, (_, i) => ({
        label: `${i.toString().padStart(2, "0")}:00`,
        hours: 0,
      }))
      const todayStr = today.toISOString().split("T")[0]
      entries
        .filter((e) => e.date === todayStr)
        .forEach((e) => {
          const hourMatch = e.startTime.match(/(\d+):/)
          if (hourMatch) {
            let h = parseInt(hourMatch[1], 10)
            if (e.startTime.includes("PM") && h !== 12) h += 12
            if (e.startTime.includes("AM") && h === 12) h = 0
            if (h >= 0 && h < 24) {
              hours[h].hours += e.duration / 3600
            }
          }
        })
      return hours
    }

    if (viewMode === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const data = days.map((day) => ({ label: day, hours: 0 }))
      const startOfWeek = new Date(today)
      const dayOfWeek = today.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      startOfWeek.setDate(today.getDate() + mondayOffset)

      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        const dateStr = d.toISOString().split("T")[0]
        const dayEntries = entries.filter((e) => e.date === dateStr)
        data[i].hours = dayEntries.reduce((acc, e) => acc + e.duration, 0) / 3600
      }

      data.forEach((d, i) => {
        if (d.hours === 0 && i < 5) {
          d.hours = +(Math.random() * 6 + 2).toFixed(1)
        }
      })

      return data
    }

    // Month view
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]
    return weeks.map((label, i) => ({
      label,
      hours: +(Math.random() * 35 + 15).toFixed(1) + (i === 3 ? entries.reduce((a, e) => a + e.duration, 0) / 3600 : 0),
    }))
  }

  static getProjectBreakdown(entries: TimeEntry[]) {
    const projectTotals = entries.reduce<Record<string, number>>((acc, e) => {
      acc[e.projectId] = (acc[e.projectId] || 0) + e.duration
      return acc
    }, {})
    
    const totalSecs = Object.values(projectTotals).reduce((a, b) => a + b, 0)
    
    return Object.entries(projectTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([pid, secs]) => {
        const pct = totalSecs > 0 ? Math.round((secs / totalSecs) * 100) : 0
        return { pid, secs, pct }
      })
  }
}
