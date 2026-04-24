import { useState, useEffect, Fragment } from "react"
import { useLocation, Link } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItemType {
    label: string
    href?: string
}

const breadcrumbNameMap: Record<string, string> = {
    dashboard: "nav.dashboard",
    devices: "nav.devices",
    profile: "nav.profile",
    branches: "nav.branches",
    settings: "settings.title",
}

export function BreadcrumbHeader() {
    const location = useLocation()
    const { t } = useLanguage()
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([])

    useEffect(() => {
        const pathname = location.pathname
        if (!pathname) return

        const pathSegments = pathname.split("/").filter(Boolean)
        const breadcrumbItems: BreadcrumbItemType[] = []

        // 🔹 Home
        breadcrumbItems.push({
            label: t("nav.dashboard"),
            href: "/dashboard",
        })

        if (pathSegments.length === 0 || pathSegments[0] === "dashboard") {
            setBreadcrumbs(breadcrumbItems)
            return
        }

        let currentPath = ""
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`

            const translationKey = breadcrumbNameMap[segment.toLowerCase()]
            const label = translationKey
                ? t(translationKey)
                : segment
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")

            if (index === pathSegments.length - 1) {
                breadcrumbItems.push({ label })
            } else {
                breadcrumbItems.push({
                    label,
                    href: currentPath,
                })
            }
        })

        setBreadcrumbs(breadcrumbItems)
    }, [location.pathname, t])

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link to={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
