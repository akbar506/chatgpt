import { Outlet } from "react-router-dom"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { GithubDark, GithubLight } from "@/components/icon/github"
import LinkedinIcon from "@/components/icon/linkedin"
import AppSidebar from "@/components/app-sidebar"
import { Link } from "react-router-dom"

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center border-b px-4 sticky top-0 right-0 left-0 z-10 bg-background">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-auto mr-6 sm:mr-10">
            <Link to="https://github.com/akbar506/chatgpt" target="_blank" rel="noopener noreferrer">
              <span className="hidden dark:inline"><GithubDark w="25px" h="25px" /></span>
              <span className="dark:hidden"><GithubLight w="25px" h="25px" /></span>
            </Link>
            <Link to="https://www.linkedin.com/in/akber-ali-dev/" target="_blank" rel="noopener noreferrer">
              <span><LinkedinIcon w="30px" h="30px" /></span>
            </Link>
          </div>
        </header>

        <main className="p-2 sm:p-6 h-full">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}