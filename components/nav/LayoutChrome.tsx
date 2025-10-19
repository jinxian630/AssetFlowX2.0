"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { IconRail } from "./IconRail"
import { ModuleDrawer } from "./ModuleDrawer"
import { ModuleKey, NAV_TREE } from "@/types/nav"
import { usePersistentState } from "@/lib/usePersistentState"
import { cn } from "@/lib/utils"

interface LayoutChromeProps {
  children: React.ReactNode
}

export function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [drawerOpen, setDrawerOpen] = usePersistentState("drawer.open", false)
  const [activeModule, setActiveModule] = usePersistentState<ModuleKey | null>(
    "drawer.module",
    null
  )

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which module is active based on current route
  const getModuleFromPath = (path: string): ModuleKey | null => {
    for (const [key, config] of Object.entries(NAV_TREE)) {
      const moduleKey = key as ModuleKey

      // Check direct href match
      if (config.href && path === config.href) {
        return moduleKey
      }

      // Check items
      if (config.items) {
        const matchingItem = config.items.find((item) => path === item.href)
        if (matchingItem) {
          return moduleKey
        }
      }
    }
    return null
  }

  // Update active module based on current path
  useEffect(() => {
    const moduleFromPath = getModuleFromPath(pathname)
    if (moduleFromPath) {
      setActiveModule(moduleFromPath)
      // Drawer stays closed - user must open manually
    }
  }, [pathname, setActiveModule])

  const handleOpenModule = (module: ModuleKey) => {
    const config = NAV_TREE[module]

    if (!config.hasDrawer) {
      // Direct navigation modules
      if (config.href) {
        window.location.href = config.href
      }
      return
    }

    // Toggle drawer if clicking the same module
    if (activeModule === module && drawerOpen) {
      setDrawerOpen(false)
    } else {
      setActiveModule(module)
      setDrawerOpen(true)
    }
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes drawer
      if (e.key === "Escape" && drawerOpen) {
        handleCloseDrawer()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [drawerOpen])

  const shouldShowDrawer =
    drawerOpen && activeModule && NAV_TREE[activeModule]?.hasDrawer

  return (
    <div className="relative min-h-screen bg-background">
      {/* Icon Rail */}
      <IconRail activeModule={activeModule} onOpenModule={handleOpenModule} />

      {/* Module Drawer */}
      <ModuleDrawer
        module={activeModule}
        open={!!shouldShowDrawer}
        onClose={handleCloseDrawer}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          // Always account for wider icon rail
          "pl-[200px]",
          // Add drawer width on desktop when open
          shouldShowDrawer && "lg:pl-[500px]"
        )}
      >
        {children}
      </div>

      {/* Mobile overlay when drawer is open */}
      {shouldShowDrawer && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={handleCloseDrawer}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
