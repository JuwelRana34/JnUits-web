import MobileSidebar from './_components/MobileSidebar'
import Sidebar from './_components/Sidebar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <Sidebar />
      </aside>

      {/* 📱 Mobile Header & Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex h-14 items-center justify-between border-b px-6 py-3 backdrop-blur lg:hidden">
          {/* Left Side: Menu & Title */}
          <div className="flex items-center gap-4">
            <MobileSidebar />
            <h1 className="text-primary text-lg font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 lg:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
