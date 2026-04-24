"use client"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { quickAccessPages } from "./data/sidebar-data"
import { useLanguage } from "@/contexts/LanguageContext"

// Type for quick access page
interface QuickPage {
  href: string
  title: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
}

export const SearchModal: React.FC = () => {
  const { t } = useLanguage()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filtered & grouped pages
  const groupedPages = useMemo(() => {
    const filtered = quickAccessPages(t).filter((page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return filtered.reduce((acc: Record<string, QuickPage[]>, page) => {
      (acc[page.category] ??= []).push(page)
      return acc
    }, {})
  }, [searchQuery, t])

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {/* Search button with tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="relative h-10 md:w-ful justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 md:mr-8 sm:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline ml-2">Qidirish...</span>
              <kbd className="pointer-events-none absolute right-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Tezkor qidiruv (Ctrl/Cmd + K)</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Tezkor Qidiruv</DialogTitle>
            <DialogDescription>Sahifalar va funksiyalarni tez topish uchun qidiring</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Input */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sahifa yoki funksiya nomini kiriting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>

            {/* Results */}
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {Object.entries(groupedPages).map(([category, pages]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">{category}</h4>
                    <div className="space-y-1">
                      {pages.map((page) => (
                        <Link
                          key={page.href}
                          to={page.href}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center space-x-3 rounded-lg p-3 text-sm hover:bg-muted transition-colors"
                        >
                          <page.icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium">{page.title}</div>
                            <div className="text-xs text-muted-foreground">{page.description}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* No results */}
                {Object.keys(groupedPages).length === 0 && (
                  <div className="flex flex-col items-center justify-center text-muted-foreground pt-16 space-y-2">
                    <Search className="h-10 w-10 text-muted-foreground opacity-50" />
                    <span className="text-sm font-medium">Hech narsa topilmadi...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
