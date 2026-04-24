import { User, Settings, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function UserDropdown() {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="flex items-center gap-2 bg-accent px-3 py-2 rounded-lg h-auto">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-foreground">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </Button>
                </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-popover border border-border shadow-lg" align="end">
                <DropdownMenuLabel className="text-foreground">Mening hisobim</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer hover:bg-accent">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('nav.profile')}</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer hover:bg-accent">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer hover:bg-accent">
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Tema</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-popover border border-border">
                        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-accent">
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Yorug'</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-accent">
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Qorong'u</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-accent">
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>Tizim</span>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/10 text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}