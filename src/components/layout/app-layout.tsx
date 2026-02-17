"use client"

import { AppSidebar } from "@/components/layout/sidebar"
import { ScrollArea } from "@/components/ui/layout/scroll-area"
import { SidebarInset, SidebarProvider } from "@/components/ui/navigation/sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={true}
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
