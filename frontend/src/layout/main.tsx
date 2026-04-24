import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  className?: string
}

export const Main = forwardRef<HTMLElement, MainProps>(
  ({ fixed, className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "ml-1 peer-[.header-fixed]/header:mt-[5.5rem]",
          "flex-1 md:px-4 md:pt-6 px-2 pt-4",
          fixed &&
          "fixed-main flex flex-grow flex-col overflow-hidden",
          "transition-[width] duration-200 ease-linear",
          className
        )}
        {...props}
      >
        {children}
      </main>
    )
  }
)

Main.displayName = "Main"
