import { useState } from "react";
import { BarChart3, Smartphone, LogOut, Home, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const getNavItems = (t: (key: string) => string) => [
  { title: t('nav.dashboard'), url: "/dashboard", icon: Home },
  { title: t('nav.devices'), url: "/devices", icon: Smartphone },
  { title: t('nav.branches'), url: "/branches", icon: BarChart3 },
  { title: t('nav.settings'), url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  const items = getNavItems(t);
  const isActive = (path: string) => currentPath === path;
  const isExpanded = items.some((i) => isActive(i.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} bg-sidebar border-r-0 shadow-warm`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">{t('app.title')}</h1>
                <p className="text-xs text-sidebar-foreground/70">{t('app.subtitle')}</p>
              </div>
            )}
          </motion.div>
        </div>

        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            {!collapsed && t('nav.mainMenu')}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center w-full"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </motion.div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto p-2">
          <SidebarMenuButton onClick={logout} className="w-full hover:bg-destructive/10 text-destructive">
            <LogOut className="mr-3 h-5 w-5" />
            {!collapsed && <span className="font-medium">{t('nav.logout')}</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}