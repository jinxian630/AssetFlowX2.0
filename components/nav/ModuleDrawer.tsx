"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { ModuleKey, NAV_TREE } from "@/types/nav"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/lib/useMediaQuery"

interface ModuleDrawerProps {
  module: ModuleKey | null
  open: boolean
  onClose: () => void
}

export function ModuleDrawer({ module, open, onClose }: ModuleDrawerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Close drawer on mobile after navigation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && open) {
        // Give a small delay to allow the route change to complete
        const timer = setTimeout(() => {
          onClose()
        }, 150)
        return () => clearTimeout(timer)
      }
    }

    // Run on pathname change
    handleResize()
  }, [pathname, open, onClose])

  if (!module || !NAV_TREE[module].hasDrawer) {
    return null
  }

  const config = NAV_TREE[module]
  const items = config.items || []

  const handleItemClick = (href: string) => {
    router.push(href)
    // Close drawer after navigation on both mobile and desktop
    setTimeout(() => onClose(), 100)
  }

  return (
    <>
      {/* Mobile Sheet drawer - only render on mobile */}
      {!isDesktop && open && (
        <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()} modal={true}>
          <SheetContent
            side="left"
            className="w-[260px] sm:w-[300px] p-0 border-r"
            onEscapeKeyDown={onClose}
          >
            <motion.div
              className="h-full flex flex-col"
              initial={{ x: -24, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Sub-navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 pt-6">
                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                      <motion.button
                        key={item.key}
                        onClick={() => handleItemClick(item.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {Icon && (
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive ? "text-primary-foreground" : "text-muted-foreground"
                            )}
                            aria-hidden="true"
                          />
                        )}
                        <span className="flex-1 text-left">{item.label}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </nav>

              {/* Optional footer for secondary actions */}
              <div className="border-t px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop persistent drawer - only render on desktop */}
      {isDesktop && open && (
        <motion.aside
          className="fixed left-[200px] top-0 h-screen w-[300px] border-r bg-card z-30"
          initial={{ x: -24, opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="h-full flex flex-col">
            {/* Sub-navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 pt-6">
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <motion.button
                      key={item.key}
                      onClick={() => handleItemClick(item.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </>
  )
}
