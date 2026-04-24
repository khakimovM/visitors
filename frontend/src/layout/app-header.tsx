import { Header } from "./header"
import { UserDropdown } from "./user-dropdown"
import { NotificationsButton } from "./notification-button"
import ModeToggle from "./theme-toggle"
import { LanguageSwitcher } from "@/layout/LanguageSwitcher"
import FullscreenToggle from "./full-screen-toggle"
import { BreadcrumbHeader } from "./bread-crumb-header"

export function AppHeader() {
  return (
    <Header fixed className="border-b">
      <div className="flex-1">
        <BreadcrumbHeader />
      </div>

      <div className="flex items-center gap-2">
        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <FullscreenToggle />
          <ModeToggle />
          {/* <NotificationsButton /> */}
          <UserDropdown />
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <NotificationsButton />
          <UserDropdown />
        </div>
      </div>
    </Header>
  )
}
