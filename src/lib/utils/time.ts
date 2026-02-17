export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0]
}

export function formatTimeOfDay(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function formatDurationInput(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}:${m.toString().padStart(2, "0")}`
}

export function parseDurationInput(value: string): number | null {
  const parts = value.split(":")
  if (parts.length === 2) {
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (!isNaN(h) && !isNaN(m)) return h * 3600 + m * 60
  }
  const hMatch = value.match(/(\d+)\s*h/)
  const mMatch = value.match(/(\d+)\s*m/)
  if (hMatch || mMatch) {
    const h = hMatch ? parseInt(hMatch[1], 10) : 0
    const m = mMatch ? parseInt(mMatch[1], 10) : 0
    return h * 3600 + m * 60
  }
  return null
}
