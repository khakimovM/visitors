import {
  LayoutDashboard,
  User,
  BarChart3,
  Settings,
  Home,
  MonitorSmartphone, // ✅ yangi icon
} from "lucide-react"

import { NavGroup, Team, User as UserType } from "../types"

export const sidebarData = (t: (key: string) => string) => ({
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatar.svg",
    role: "admin",
  } as UserType,

  teams: [
    {
      name: "Ecommerce",
      logo: Home,
      plan: "Admin panel",
    },
    {
      name: "Sotuvchilar",
      logo: LayoutDashboard,
      plan: "Sotuvchi panel",
    },
  ] as Team[],

  navGroups: [
    {
      title: t("nav.main"),
      items: [
        { title: t("nav.dashboard"), url: "/dashboard", icon: LayoutDashboard },
        { title: t("nav.devices"), url: "/devices", icon: MonitorSmartphone }, 
        { title: t("nav.profile"), url: "/profile", icon: User },
      ],
    },
  ] as NavGroup[],
})

export const quickAccessPages = (t: (key: string) => string) => [
  {
    title: t("nav.dashboard"),
    description: t("desc.dashboard"),
    href: "/dashboard",
    icon: LayoutDashboard,
    category: t("nav.main")
  },
  {
    title: t("nav.devices"),
    description: t("desc.devices"),
    href: "/devices",
    icon: MonitorSmartphone,
    category: t("nav.system")
  },
  {
    title: t("nav.profile"),
    description: t("desc.profile"),
    href: "/profile",
    icon: User,
    category: t("nav.main")
  },
]
