import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Moon, Sun } from "lucide-react"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"
  const nextTheme = isDark ? "light" : "dark"
  const Icon = isDark ? Sun : Moon
  const tooltipText = isDark ? "Switch to Light Mode" : "Switch to Dark Mode"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setTheme(nextTheme)}
            aria-label={`mode-toggle-to-${nextTheme}`}
          >
            <Icon className="h-5 w-5 transition-all duration-300" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ThemeToggle
