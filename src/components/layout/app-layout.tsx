"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/sidebar"
import { ScrollArea } from "@/components/ui/layout/scroll-area"
import { SidebarInset, SidebarProvider } from "@/components/ui/navigation/sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <SidebarProvider
      open={!sidebarCollapsed}
      onOpenChange={(open) => setSidebarCollapsed(!open)}
      className="h-screen overflow-hidden bg-background"
    >
      <AppSidebar />

      <SidebarInset className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-6 lg:p-8">
            {children}
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
