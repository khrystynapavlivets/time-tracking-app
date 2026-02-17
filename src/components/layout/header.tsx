import { SidebarTrigger } from "@/components/ui/navigation/sidebar"
import { Separator } from "@/components/ui/layout/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb"
import { Button } from "@/components/ui/forms/button"
import { Plus } from "lucide-react"

interface HeaderProps {
  title: string
  breadcrumb: string
  onAddTask?: () => void
  showAddButton?: boolean
}

export function Header({
  title,
  breadcrumb,
  onAddTask,
  showAddButton = true,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 transition-[width,height] ease-linear group-data-[collapsible=icon]:h-16 bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">
                TimeTracker
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        {showAddButton && onAddTask && (
          <Button size="sm" onClick={onAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        )}
      </div>
    </header>
  )
}
