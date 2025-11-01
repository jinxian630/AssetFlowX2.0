"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Bell,
  Shield,
  Menu,
  X,
  ShoppingCart,
  Award,
  ShieldCheck,
  Wallet,
  ChevronRight,
  Settings2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTheme } from "next-themes"

const navItems = [
  // Portfolio & Analytics
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "portfolio"
  },
  {
    title: "Flows",
    href: "/flows",
    icon: ArrowLeftRight,
    section: "portfolio"
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: Receipt,
    section: "portfolio"
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: Bell,
    section: "portfolio"
  },
  {
    title: "Risk",
    href: "/risk",
    icon: Shield,
    section: "portfolio"
  },
  // Payments & Settlement
  {
    title: "Payments",
    href: "/payments-dashboard",
    icon: Wallet,
    section: "payments"
  },
  {
    title: "Checkout",
    href: "/checkout",
    icon: ShoppingCart,
    section: "payments"
  },
  {
    title: "Orders",
    href: "/orders",
    icon: Receipt,
    section: "payments"
  },
  {
    title: "Credentials",
    href: "/credentials",
    icon: Award,
    section: "payments"
  },
  {
    title: "Verify",
    href: "/verify",
    icon: ShieldCheck,
    section: "payments"
  },
  // management
  {
    title: "Management",
    href: "/course-management",
    icon: Settings2,
    section: "management"
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background shadow-lg"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col backdrop-blur-xl">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <Image
                src="/assetflowx-logo.png"
                alt="AssetFlowX logo"
                width={32}
                height={32}
                priority
                className="h-8 w-8 rounded-lg object-cover shadow-lg group-hover:shadow-xl transition-shadow"
              />
              <span className="text-xl font-bold brand-gradient-text">
                AssetFlowX
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {/* Portfolio Section */}
            <div className="mb-6">
              <div className="mb-2 px-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Portfolio & Analytics
                </p>
              </div>
              <div className="space-y-1">
                {navItems.filter(item => item.section === "portfolio").map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Payments Section */}
            <div>
              <div className="mb-2 px-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Payments & Settlement
                </p>
              </div>
              <div className="space-y-1">
                {navItems.filter(item => item.section === "payments").map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Management Section */}
            <div>
              <div className="mb-2 px-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Course & Task Management
                </p>
              </div>
              <div className="space-y-1">
                {navItems.filter(item => item.section === "management").map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-4 space-y-3">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start gap-2"
            >
              {theme === "dark" ? "☀️" : "🌙"}
              <span className="text-sm">{theme === "dark" ? "Light" : "Dark"} Mode</span>
            </Button>

            {/* Status Badge */}
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-semibold text-primary">
                  Full Platform Active
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Portfolio + Payments Unified
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
