import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"
export function NavChats({
  chats,
}) {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem key={item._id}>
            <NavLink to={`/chat/${item._id}`} className={({ isActive }) =>
              `flex items-center my-px gap-0 ${isActive ? "bg-muted rounded-md" : "hover:bg-muted rounded-xl"}`

            }>
              <SidebarMenuButton asChild>
                <span className="text-nowrap w-11/12">{item.title}</span>
              </SidebarMenuButton>
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
