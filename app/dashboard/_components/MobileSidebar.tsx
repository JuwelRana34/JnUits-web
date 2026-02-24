// 'use client'

// import { useState } from 'react'

// import { Menu } from 'lucide-react'

// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// import Sidebar from './Sidebar'

// export default function MobileSidebar() {
//   const [open, setOpen] = useState(false)
//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <button className="-ml-2 rounded-md p-2 hover:bg-gray-100 lg:hidden">
//           <Menu className="h-6 w-6" />
//         </button>
//       </SheetTrigger>

//       {/* সাইডবার কনটেন্ট */}
//       <SheetContent side="left" className="w-72 p-0">
//         <Sidebar onLinkClick={() => setOpen(false)} />
//       </SheetContent>
//     </Sheet>
//   )
// }

'use client'

import { useState } from 'react'

import { Menu } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import Sidebar from './Sidebar'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="-ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-500 focus:outline-none focus:ring-inset lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

        <Sidebar onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
