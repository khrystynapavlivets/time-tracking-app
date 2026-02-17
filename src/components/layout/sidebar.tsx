"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/data-display/avatar"
import { Separator } from "@/components/ui/layout/separator"
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/forms/button"
import { useSidebar } from "@/components/ui/navigation/sidebar"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "projects", label: "Projects", icon: FolderKanban, href: "/projects" },
  { id: "reports", label: "Reports", icon: BarChart3, href: "/reports" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
]

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar()
  const collapsed = !open
  const onToggleCollapse = toggleSidebar
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center px-4 py-5",
          collapsed ? "justify-center" : "gap-2.5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Timer className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-sidebar-accent-foreground">
            Chronos
          </span>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4" aria-label="Main navigation">
        <ul className="flex flex-col gap-1" role="list">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User profile */}
      <div
        className={cn(
          "flex items-center px-3 py-4",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
            JD
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
              Jane Doe
            </p>
            <p className="truncate text-xs text-sidebar-foreground">
              jane@company.com
            </p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div className="px-2 pb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "px-0"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
        </Button>
      </div>
    </aside>
  )
}
