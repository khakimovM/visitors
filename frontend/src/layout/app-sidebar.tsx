"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/contexts/LanguageContext"
import { sidebarData } from "./data/sidebar-data"
import { NavGroup } from "./nav-group"
import { SidebarLogo } from "./sidebar-logo"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage();
  // Filter sidebar groups based on user role
  const filteredNavGroups = sidebarData(t).navGroups

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="overflow-y-auto">
          {filteredNavGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
