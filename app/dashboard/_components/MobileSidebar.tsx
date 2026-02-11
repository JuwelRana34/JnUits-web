'use client'

import { useState } from 'react'

import { Menu } from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import Sidebar from './Sidebar'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="-ml-2 rounded-md p-2 hover:bg-gray-100 lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>

      {/* সাইডবার কনটেন্ট */}
      <SheetContent side="left" className="w-72 p-0">
        <Sidebar onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
