import { Outlet } from "react-router-dom"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import AppSidebar from "@/components/app-sidebar"

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center border-b px-4 sticky top-0 right-0 left-0 z-10 bg-background">
          <SidebarTrigger />
        </header>

        <main className="p-2 sm:p-6 h-full">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}