"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileBarChart,
  FolderKanban,
  LayoutDashboard,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/navigation/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader>
        <div className="flex h-12 items-center px-2 group-data-[collapsible=icon]:justify-center">
           <div className="flex items-center gap-2 font-bold text-lg overflow-hidden">
              <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                TT
              </div>
              <span className="group-data-[collapsible=icon]:hidden truncate">TimeTracker</span>
           </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  tooltip="Dashboard"
                >
                  <Link href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/projects")}
                  tooltip="Projects"
                >
                  <Link href="/projects">
                    <FolderKanban />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/reports")}
                  tooltip="Reports"
                >
                  <Link href="/reports">
                    <FileBarChart />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/settings")}
                  tooltip="Settings"
                >
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0">
         <SidebarTrigger className="w-full justify-center group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
