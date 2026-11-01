import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Users, LogOut, Home, Waves, FileText, ClipboardList, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLogout } from '@/hooks/useAuth'

type NavLink = { name: string; to: string; icon: LucideIcon }
type NavGroup = { name: string; icon: LucideIcon; children: NavLink[] }

const navigation: (NavLink | NavGroup)[] = [
  { name: 'หน้าแรก', to: '/', icon: Home },
  { name: 'จัดการลูกค้า', to: '/customers', icon: Users },
  {
    name: 'สระว่ายน้ำ',
    icon: Waves,
    children: [
      { name: 'การดูแลสระว่ายน้ำ', to: '/poolcares', icon: ClipboardList },
      { name: 'ใบดูแลสระว่ายน้ำ', to: '/poolcare-reports', icon: FileText },
    ],
  },
]

function isPathActive(currentPath: string, to: string) {
  return currentPath === to || currentPath.startsWith(to + '/')
}

function NavItemLink({ item, currentPath, nested }: { item: NavLink; currentPath: string; nested?: boolean }) {
  const isActive = isPathActive(currentPath, item.to)
  return (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
        nested && 'pl-9',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.name}
    </Link>
  )
}

function NavItemGroup({ group, currentPath }: { group: NavGroup; currentPath: string }) {
  const hasActiveChild = group.children.some((child) => isPathActive(currentPath, child.to))
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
          hasActiveChild ? 'text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <group.icon className="h-5 w-5" />
        {group.name}
        <ChevronDown className={cn('ml-auto h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open &&
        group.children.map((child) => (
          <NavItemLink key={child.name} item={child} currentPath={currentPath} nested />
        ))}
    </div>
  )
}

export function Sidebar() {
  const logout = useLogout()
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Poolworld</h1>
            <p className="text-xs text-gray-500">CRM System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) =>
          'children' in item ? (
            <NavItemGroup key={item.name} group={item} currentPath={currentPath} />
          ) : (
            <NavItemLink key={item.name} item={item} currentPath={currentPath} />
          )
        )}
      </nav>

      <Separator />

      {/* User Section */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  )
}
