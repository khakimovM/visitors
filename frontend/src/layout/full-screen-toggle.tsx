import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Maximize, Minimize } from "lucide-react"

const FullscreenToggle: React.FC = () => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else if (document.exitFullscreen) {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }, [])

    const tooltipText = isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="relative overflow-hidden"
                        aria-label={tooltipText}
                    >
                        {isFullscreen ? (
                            <Minimize className="h-5 w-5" />
                        ) : (
                            <Maximize className="h-5 w-5" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {tooltipText}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default FullscreenToggle
