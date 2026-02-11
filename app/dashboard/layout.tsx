import MobileSidebar from './_components/MobileSidebar'
import Sidebar from './_components/Sidebar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 🖥️ Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <Sidebar />
      </aside>

      {/* 📱 Mobile Header & Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile Header (Visible only on small screens) */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6 lg:hidden">
          <MobileSidebar /> {/* Use Sheet component here if needed */}
          <span className="text-lg font-semibold">Dashboard</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
