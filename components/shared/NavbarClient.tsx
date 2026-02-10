'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

import LogoutButton from '../auth/LogoutButton'

// টাইপ ডেফিনিশন (যাতে role অপশনাল থাকে)
type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role?: string | null
}

type Session = {
  user: User
} | null

export default function NavbarClient({ session }: { session: Session }) {
  const pathname = usePathname()

  // রাউট অ্যাক্টিভ কিনা চেক করার ফাংশন
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/')

  const Navlink = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
    { name: 'Profile', href: '/profile' },
  ]

  const isAuthenticated = !!session
  const showAdmin =
    session?.user?.role === 'EXECUTIVE' ||
    session?.user?.role === 'ADMIN' ||
    session?.user?.role === 'SUPER_ADMIN'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/MainLogo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <Link
            href="/"
            className="bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-xl font-bold text-transparent"
          >
            {session ? `Hi, ${session.user.name}` : 'JnU IT Society'}
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-4 md:flex">
          {Navlink.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button
                variant="ghost"
                className={
                  isActive(link.href)
                    ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                    : ''
                }
              >
                {link.name}
              </Button>
            </Link>
          ))}

          {showAdmin && (
            <Link href="/admin">
              <Button
                variant="ghost"
                className={
                  isActive('/admin')
                    ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                    : ''
                }
              >
                Admin
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </nav>

        {/* 🔥 Mobile Menu (Completed) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-75">
            <div className="mt-8 flex flex-col gap-4">
              {/* Navigation Links */}
              {Navlink.map((link) => (
                <SheetClose asChild key={link.name}>
                  <Link href={link.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActive(link.href)
                          ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                          : ''
                      }`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                </SheetClose>
              ))}

              {/* Admin Link */}
              {showAdmin && (
                <SheetClose asChild>
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActive('/admin')
                          ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                          : ''
                      }`}
                    >
                      Admin Panel
                    </Button>
                  </Link>
                </SheetClose>
              )}

              {/* Authentication Buttons */}
              <div className="mt-4 border-t pt-4">
                {isAuthenticated ? (
                  <div className="w-full">
                    <LogoutButton />
                  </div>
                ) : (
                  <SheetClose asChild>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                  </SheetClose>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
