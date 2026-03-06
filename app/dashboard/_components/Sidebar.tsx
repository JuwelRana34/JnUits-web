'use client'

import { CldImage } from 'next-cloudinary'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarCog,
  LayoutDashboard,
  ShieldUser,
  Ticket,
  UploadCloud,
  User,
  Users,
} from 'lucide-react'

import LogoutButton from '@/components/auth/LogoutButton'
import { useAuth } from '@/components/features/AuthProvider'

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Video', href: '/dashboard/upload-video', icon: UploadCloud },
  // { name: 'Settings', href: '/dashboard', icon: Settings },
  {
    name: 'Events management',
    href: '/dashboard/events_management',
    icon: CalendarCog,
  },
  {
    name: 'Users management',
    href: '/dashboard/user_management',
    icon: Users,
  },
  {
    name: 'Committee management',
    href: '/dashboard/committee_management',
    icon: ShieldUser,
  },
  {
    name: 'Manage Coupons',
    href: '/dashboard/manageCoupon',
    icon: Ticket,
  },
]

interface SidebarProps {
  onLinkClick?: () => void
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="flex h-full flex-col justify-between px-4 py-6">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 text-xl font-bold text-blue-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            J
          </div>
          <Link href={'/'}>JnUITS</Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={onLinkClick}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <link.icon
                  className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        {/* User Profile Section */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            {user?.image ? (
              <CldImage
                src={user.image || ''}
                alt={user?.name || 'User'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-600">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-gray-900">
              {user?.name || 'User'}
            </span>
            <span
              className="truncate text-xs text-gray-500"
              title={user?.email || ''}
            >
              {user?.email}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <div onClick={onLinkClick} className="w-full">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
