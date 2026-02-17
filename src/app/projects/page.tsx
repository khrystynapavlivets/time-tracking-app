"use client"

import { Header } from "@/components/layout/header"
import { ProjectManager } from "@/components/features/projects/project-manager"

export default function ProjectsPage() {
  return (
    <>
      <Header
        title="Projects"
        breadcrumb="Projects"
        showAddButton={false}
      />
      <ProjectManager />
    </>
  )
}
