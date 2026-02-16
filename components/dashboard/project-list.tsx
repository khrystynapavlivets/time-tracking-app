"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export function ProjectList() {
  const { projects, entries } = useStore()

  const projectData = projects
    .filter((p) => p.status === "Active")
    .map((project) => {
      const totalSeconds = entries
        .filter((e) => e.projectId === project.id)
        .reduce((acc, e) => acc + e.duration, 0)
      const hours = +(totalSeconds / 3600).toFixed(1)
      return { ...project, hours }
    })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {projectData.map((project) => {
          const maxHours = Math.max(...projectData.map((p) => p.hours), 1)
          const progress = Math.round((project.hours / maxHours) * 100)
          return (
            <div key={project.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: project.hexColor }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {project.name}
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                  {project.hours}h
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: project.hexColor,
                  }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${project.name} progress: ${progress}%`}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
