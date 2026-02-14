'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  ChevronDown,
  Image as ImageIcon,
  LucideIcon,
  Menu,
  PlayCircle,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import LogoutButton from '../auth/LogoutButton'
import { useAuth } from '../features/AuthProvider'
import { RainbowButton } from '../ui/rainbow-button'

type NavItemLink = {
  type: 'link'
  name: string
  href: string
  prefetch?: boolean
}

type NavItemDropdown = {
  type: 'dropdown'
  name: string
  icon?: LucideIcon
  children: { name: string; href: string; icon: LucideIcon }[]
}

type NavItem = NavItemLink | NavItemDropdown

const NavItems: NavItem[] = [
  {
    name: 'Home',
    href: '/',
    type: 'link',
    prefetch: true,
  },
  {
    name: 'About',
    href: '/about',
    type: 'link',
    prefetch: false,
  },
  {
    name: 'Committee',
    type: 'dropdown',
    icon: Users,
    children: [
      {
        name: 'Current Committee',
        href: '/committee/current',
        icon: UserCheck,
      },
      {
        name: 'Advisory Panel',
        href: '/committee/advisory',
        icon: ShieldCheck,
      },
    ],
  },
  {
    name: 'Gallery',
    type: 'dropdown',
    icon: ImageIcon,
    children: [
      { name: 'Photos', href: '/gallery/photos', icon: ImageIcon },
      { name: 'Videos', href: '/gallery/videos', icon: PlayCircle },
    ],
  },
  {
    name: 'Blogs',
    href: '/blogs',
    type: 'link',
    prefetch: false,
  },
  {
    name: 'Contact',
    href: '/contact',
    type: 'link',
    prefetch: false,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isPending } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const isActive = (path: string) =>
    pathname === path || (path !== '/' && pathname.startsWith(path + '/'))

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? 'border-gray-200 bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-white/50 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/MainLogo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-10 transition-transform hover:scale-105"
          />
          <span className="hidden bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-xl font-extrabold text-transparent sm:block">
            JnU IT Society
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {NavItems.map((item) => {
            if (item.type === 'dropdown') {
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`group flex items-center gap-1 text-sm font-medium transition-all duration-200 ${
                        item.children.some((child) => isActive(child.href))
                          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link href={child.href} className="cursor-pointer">
                          <child.icon
                            className={`mr-2 h-4 w-4 ${
                              child.name.includes('Videos')
                                ? 'text-red-500'
                                : child.name.includes('Advisory')
                                  ? 'text-amber-500'
                                  : 'text-blue-500'
                            }`}
                          />
                          <span>{child.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <Link key={item.name} href={item.href} prefetch={item.prefetch}>
                <Button
                  variant="ghost"
                  className={`text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            )
          })}

          <div className="mx-2 h-6 w-px bg-gray-300"></div>

          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-gray-100" />
          ) : (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link href="/dashboard" prefetch={false}>
                  <Button variant="default" size="sm">
                    Admin panel
                  </Button>
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile" prefetch={true}>
                    <Button
                      variant="link"
                      className={`text-sm font-medium ${
                        isActive('/profile')
                          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      Profile
                    </Button>
                  </Link>
                  <LogoutButton />
                </div>
              ) : (
                <Link href="/login" prefetch={false}>
                  <RainbowButton>Login</RainbowButton>
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* --- MOBILE MENU --- */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-80 flex-col border-l p-0"
          >
            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

            <div className="flex items-center gap-2 border-b p-6">
              <Image src="/MainLogo.svg" alt="Logo" width={32} height={32} />
              <span className="text-lg font-bold">JnUITS Menu</span>
            </div>

            <div className="overflow-y-auto">
              <div className="flex-1 px-6 py-4">
                <div className="flex flex-col gap-2">
                  {NavItems.map((item) => {
                    if (item.type === 'dropdown') {
                      return (
                        <div key={item.name} className="flex flex-col gap-2">
                          <div className="mt-2 px-4 text-xs font-semibold text-gray-400 uppercase">
                            {item.name}
                          </div>
                          {item.children.map((child) => (
                            <SheetClose asChild key={child.name}>
                              <Link href={child.href}>
                                <Button
                                  variant="ghost"
                                  className={`w-full justify-start text-base ${
                                    isActive(child.href)
                                      ? 'border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  <child.icon className="mr-2 h-4 w-4" />
                                  {child.name}
                                </Button>
                              </Link>
                            </SheetClose>
                          ))}
                          <div className="my-1 border-b border-gray-100" />
                        </div>
                      )
                    }

                    return (
                      <SheetClose asChild key={item.name}>
                        <Link href={item.href} prefetch={item.prefetch}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-base ${
                              isActive(item.href)
                                ? 'border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {item.name}
                          </Button>
                        </Link>
                      </SheetClose>
                    )
                  })}
                </div>
              </div>

              <div className="border-t bg-gray-50 p-6">
                <div className="flex flex-col gap-3">
                  {user ? (
                    <>
                      {isAdmin && (
                        <SheetClose asChild>
                          <Link href="/dashboard" prefetch={false}>
                            <Button className="w-full" size="lg">
                              Admin Panel
                            </Button>
                          </Link>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                        <Link href="/profile" prefetch={true}>
                          <Button
                            variant="ghost"
                            className={`h-12 w-full justify-start ${isActive('/profile') ? 'bg-blue-200' : 'bg-white'} `}
                          >
                            Profile
                          </Button>
                        </Link>
                      </SheetClose>
                      <LogoutButton />
                    </>
                  ) : (
                    <Link href="/login" prefetch={false}>
                      <RainbowButton className="w-full">Login</RainbowButton>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
