"use client"

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarLogo() {
  const { t } = useLanguage();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className={`py-6 lg:py-4 ${collapsed ? "px-0" : "md:px-4"} border-b border-sidebar-border`}>
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
  )
}
