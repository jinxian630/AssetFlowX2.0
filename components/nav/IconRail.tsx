"use client"

import Image from "next/image"
import { LayoutDashboard, CreditCard, Award, ShieldCheck, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModuleKey, NAV_TREE } from "@/types/nav"
import { motion } from "framer-motion"

interface IconRailProps {
  activeModule: ModuleKey | null
  onOpenModule: (module: ModuleKey) => void
}

const MODULE_ICONS: Record<ModuleKey, typeof LayoutDashboard> = {
  portfolio: LayoutDashboard,
  payments: CreditCard,
  credentials: Award,
  verify: ShieldCheck,
}

export function IconRail({ activeModule, onOpenModule }: IconRailProps) {
  const isModuleActive = (module: ModuleKey): boolean => {
    return activeModule === module
  }

  const handleModuleClick = (module: ModuleKey) => {
    const config = NAV_TREE[module]
    if (config.hasDrawer) {
      onOpenModule(module)
    } else if (config.href) {
      window.location.href = config.href
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-60 h-screen w-[200px] border-r bg-card flex flex-col pointer-events-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 border-b px-4">
        <motion.div
          className="relative w-10 h-10 shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src="/assetflowx-logo.png"
            alt="AssetFlowX"
            width={40}
            height={40}
            priority
            className="rounded-lg object-cover"
          />
        </motion.div>
        <span className="font-semibold text-base">AssetFlowX</span>
      </div>

      {/* Module Icons */}
      <nav className="flex-1 flex flex-col gap-2 p-3 pt-4">
        {(Object.keys(MODULE_ICONS) as ModuleKey[]).map((module) => {
          const Icon = MODULE_ICONS[module]
          const isActive = isModuleActive(module)
          const config = NAV_TREE[module]

          return (
            <motion.button
              key={module}
              onClick={() => handleModuleClick(module)}
              aria-pressed={isActive}
              aria-label={config.label}
              className={cn(
                "relative flex items-center gap-3 w-full rounded-lg px-3 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary text-primary-foreground ring-2 ring-purple-500/60 ring-offset-2 ring-offset-background"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium text-left flex-1">{config.label}</span>
              {config.hasDrawer && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    isActive && "opacity-100",
                    !isActive && "opacity-50"
                  )}
                  aria-hidden="true"
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom utility space reserved for future use */}
      <div className="h-16 border-t" />
    </aside>
  )
}
