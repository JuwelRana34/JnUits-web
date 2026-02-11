import Link from 'next/link'

import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { LightRays } from '@/components/ui/light-rays'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button
          asChild
          variant="ghost"
          className="group text-muted-foreground hover:text-primary transition-colors"
        >
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </Button>
      </div>
      <div className="w-full max-w-md space-y-8">{children}</div>
      <LightRays />
    </div>
  )
}
