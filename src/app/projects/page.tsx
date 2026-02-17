"use client"

import { Header } from "@/components/layout/header"
import { ProjectManager } from "@/components/features/projects/project-manager"

export default function ProjectsPage() {
  return (
    <>
      <Header
        breadcrumb="Projects"
        showAddButton={false}
      />
      <ProjectManager />
    </>
  )
}
