import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { NavCollapsible, NavItem, NavLink, NavGroup as NavGroupType } from "./types"
import { useNavigate, useLocation } from "react-router-dom"

export function NavGroup({ title, items }: NavGroupType) {
  const { state } = useSidebar()
  const location = useLocation()
  const pathname = location.pathname

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!("items" in item))
            return <SidebarMenuLink key={key} item={item} pathname={pathname} />

          if (state === "collapsed")
            return <SidebarMenuCollapsedDropdown key={key} item={item} pathname={pathname} />

          return <SidebarMenuCollapsible key={key} item={item} pathname={pathname} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
)

const SidebarMenuLink = ({ item, pathname }: { item: NavLink; pathname: string }) => {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const isActive = checkIsActive(pathname, item)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={isActive ? "!bg-[213 84% 58%]" : ""}
        onClick={() => {
          navigate(item.url)
          setOpenMobile(false)
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          {item.icon && <item.icon className="h-4 w-4" />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({ item, pathname }: { item: NavCollapsible; pathname: string }) => {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const isActiveParent = checkIsActive(pathname, item, true)

  return (
    <Collapsible defaultOpen={isActiveParent} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={isActiveParent ? "!bg-secondary !text-secondary-foreground" : ""}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const isActive = checkIsActive(pathname, subItem)
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive}
                    className={isActive ? "!bg-primary !text-primary-foreground" : ""}
                    onClick={() => {
                      navigate(subItem.url)
                      setOpenMobile(false)
                    }}
                  >
                    <div className="flex items-center gap-2 cursor-pointer">
                      {subItem.icon && <subItem.icon className="h-4 w-4 !text-inherit" />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </div>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  pathname,
}: {
  item: NavCollapsible
  pathname: string
}) => {
  const navigate = useNavigate()

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(pathname, item)}
            className={`${checkIsActive(pathname, item) ? "!bg-primary !text-primary-foreground" : ""}`}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const isActive = checkIsActive(pathname, sub)
            return (
              <DropdownMenuItem
                key={`${sub.title}-${sub.url}`}
                onClick={() => navigate(sub.url)}
                className={isActive ? "!bg-primary !text-primary-foreground" : ""}
              >
                {sub.icon && <sub.icon className="mr-2 h-4 w-4" />}
                <span className="max-w-52">{sub.title}</span>
                {sub.badge && <span className="ml-auto text-xs">{sub.badge}</span>}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(pathname: string, item: NavItem, mainNav = false) {
  if ("items" in item && item.items) {
    return (
      pathname === item.url ||
      pathname.split("?")[0] === item.url ||
      item.items.some((i) => i.url === pathname) ||
      (mainNav &&
        pathname.split("/")[1] !== "" &&
        pathname.split("/")[1] === item.url.split("/")[1])
    )
  }

  return pathname === item.url || pathname.split("?")[0] === item.url
}
