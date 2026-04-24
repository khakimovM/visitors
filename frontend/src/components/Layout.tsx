import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppHeader } from '@/layout/app-header';
import { Main } from '@/layout/main';
import { cn } from '@/lib/utils';
import { AppSidebar } from '@/layout/app-sidebar';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-warm">
        <AppSidebar />

        {/* <div className="flex-1 flex flex-col">
          Header
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-accent" />
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-foreground">{t('app.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleFullscreen}
                className="relative"
                title={isFullscreen ? t('header.exitFullscreen') : t('header.fullscreen')}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs"></span>
              </Button>
              
              <UserDropdown />
            </div>
          </motion.header>

          Main Content
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {children}
            </motion.div>
          </main>
        </div> */}
        <div
          className={cn(
            "mb-2 ml-auto w-full max-w-full md:pr-2",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1.7rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width)-0.5rem)]",
            "transition-[width] duration-200 ease-linear",
            "flex flex-1 flex-col overflow-hidden"
          )}
        >
          <AppHeader />
          <Main fixed>
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex-1 overflow-auto p-6 space-y-6"
            >
              {children}
            </motion.main>
          </Main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;