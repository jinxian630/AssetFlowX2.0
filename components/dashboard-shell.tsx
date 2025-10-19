import { LayoutChrome } from "@/components/nav/LayoutChrome"
import { Topbar } from "@/components/topbar"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <LayoutChrome>
      <Topbar />
      <main className="p-6">
        {children}
      </main>
    </LayoutChrome>
  )
}
