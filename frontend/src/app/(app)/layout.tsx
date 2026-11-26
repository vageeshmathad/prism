// App shell layout — shared Sidebar + Topbar + Content Area
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden antialiased">
      {/* Shared Application Sidebar (Desktop Static + Mobile Drawer) */}
      <Sidebar />

      {/* Main Execution Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Scrollable Content Container with Responsive Width Boundary */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-6 bg-background">
          <div className="max-w-[1280px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
