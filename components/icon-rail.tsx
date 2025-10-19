"use client"

// ============================================================================
// AssetFlowX - IconRail Component
// Minimal icon-only sidebar navigation
// ============================================================================

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Bell,
  Shield,
  Wallet,
  ShoppingCart,
  Award,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  // Portfolio Section
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Flows", href: "/flows", icon: ArrowLeftRight },
  { title: "Transactions", href: "/transactions", icon: Receipt },
  { title: "Alerts", href: "/alerts", icon: Bell },
  { title: "Risk", href: "/risk", icon: Shield },
  // Payments Section (separator)
  { separator: true },
  { title: "Payments", href: "/payments-dashboard", icon: Wallet },
  { title: "Checkout", href: "/checkout", icon: ShoppingCart },
  { title: "Orders", href: "/orders", icon: Receipt },
  { title: "Credentials", href: "/credentials", icon: Award },
  { title: "Verify", href: "/verify", icon: ShieldCheck },
]

export function IconRail() {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-2">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="AssetFlowX Home"
        >
          <Image
            src="/assetflowx-logo.png"
            alt="AssetFlowX"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-lg object-cover"
          />
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-1 w-full px-2">
          {navItems.map((item, index) => {
            if ("separator" in item && item.separator) {
              return (
                <div
                  key={`separator-${index}`}
                  className="h-px bg-border my-2"
                  role="separator"
                  aria-hidden="true"
                />
              )
            }

            const Icon = item.icon!
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href!}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground"
                    )}
                    aria-label={item.title}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
