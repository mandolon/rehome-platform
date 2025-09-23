'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthProvider'
import { cn } from '@/lib/utils'
import { RoleGate } from '@/components/auth/RoleGate'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings,
  CheckSquare
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'project_manager', 'team_member', 'client'] as const,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderOpen,
    roles: ['admin', 'project_manager', 'team_member', 'client'] as const,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['admin', 'project_manager', 'team_member'] as const,
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
    roles: ['admin', 'project_manager'] as const,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin'] as const,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <RoleGate key={item.name} allow={item.roles}>
              <Link
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            </RoleGate>
          ))}
        </nav>
      </div>
    </div>
  )
}