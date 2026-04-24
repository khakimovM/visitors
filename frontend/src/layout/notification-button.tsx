import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Types
interface TenantNote {
  id: string
  subject: string
  text: string
  created_at: string
}
interface TenantMail {
  id: number
  text: string
  created_at: string
}

export function NotificationsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-start gap-3 p-3">
          <div className="h-2 w-2 rounded-full bg-brand-primary mt-2" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">New order received</p>
            <p className="text-xs text-muted-foreground">Order #SK2540 from Neal Matthews</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-start gap-3 p-3">
          <div className="h-2 w-2 rounded-full bg-brand-warning mt-2" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Low stock alert</p>
            <p className="text-xs text-muted-foreground">Product inventory is running low</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-start gap-3 p-3">
          <div className="h-2 w-2 rounded-full bg-brand-success mt-2" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Payment received</p>
            <p className="text-xs text-muted-foreground">$380 payment confirmed</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
