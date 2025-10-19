import {
  LucideIcon,
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Bell,
  Shield,
  Wallet,
  ShoppingCart,
  Package,
  Award,
  ShieldCheck,
} from "lucide-react"

export type ModuleKey = 'portfolio' | 'payments' | 'credentials' | 'verify'

export interface NavItem {
  label: string
  href: string
  key: string
  icon?: LucideIcon
}

export interface ModuleConfig {
  label: string
  items?: NavItem[]
  href?: string
  hasDrawer: boolean
}

export const NAV_TREE: Record<ModuleKey, ModuleConfig> = {
  portfolio: {
    label: 'Portfolio & Analytics',
    hasDrawer: true,
    items: [
      { label: 'Dashboard', href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
      { label: 'Flows', href: '/flows', key: 'flows', icon: ArrowLeftRight },
      { label: 'Transactions', href: '/transactions', key: 'transactions', icon: Receipt },
      { label: 'Alerts', href: '/alerts', key: 'alerts', icon: Bell },
      { label: 'Risk', href: '/risk', key: 'risk', icon: Shield },
    ],
  },
  payments: {
    label: 'Payments & Settlement',
    hasDrawer: true,
    items: [
      { label: 'Payments', href: '/payments-dashboard', key: 'payments', icon: Wallet },
      { label: 'Checkout', href: '/checkout', key: 'checkout', icon: ShoppingCart },
      { label: 'Orders', href: '/orders', key: 'orders', icon: Package },
    ],
  },
  credentials: {
    label: 'Credentials',
    href: '/credentials',
    hasDrawer: false,
  },
  verify: {
    label: 'Verify',
    href: '/verify',
    hasDrawer: false,
  },
} as const
