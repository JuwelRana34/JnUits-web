'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
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

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isPending } = useAuth()

  const isActive = (path: string) =>
    pathname === path || (path !== '/' && pathname.startsWith(path + '/'))

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const NavLinks = [
    { name: 'Home', href: '/', prefetch: true },
    { name: 'About', href: '/about', prefetch: false },
    { name: 'Blogs', href: '/blogs', prefetch: false },
    { name: 'Contact', href: '/contact', prefetch: false },
  ]

  const isAdmin = user?.role === 'ADMIN'

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

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-2 md:flex">
          {NavLinks.map((link) => (
            <Link key={link.name} href={link.href} prefetch={link.prefetch}>
              <Button
                variant="ghost"
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Button>
            </Link>
          ))}

          <div className="mx-2 h-6 w-px bg-gray-300"></div>

          {/* Auth Controls */}
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

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 border-l">
            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
            <div className="mt-6 flex h-full flex-col">
              <div className="mb-6 flex items-center gap-2 border-b px-2 pb-4">
                <Image src="/MainLogo.svg" alt="Logo" width={32} height={32} />
                <span className="text-lg font-bold">JnUITS Menu</span>
              </div>

              <div className="flex flex-col gap-2">
                {NavLinks.map((link) => (
                  <SheetClose asChild key={link.name}>
                    <Link href={link.href} prefetch={link.prefetch}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-base ${
                          isActive(link.href)
                            ? 'border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t pt-6 pb-4">
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
                          className="h-12 w-full justify-start"
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
