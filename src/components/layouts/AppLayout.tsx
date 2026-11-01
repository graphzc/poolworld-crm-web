import React from 'react'
import { Sidebar } from './Sidebar'
import { PageNav } from './PageNav'

interface AppLayoutProps {
  readonly children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Poolworld Pattaya CRM</h2>
            <p className="text-sm text-muted-foreground">ระบบจัดการข้อมูลลูกค้า</p>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="relative flex-1 overflow-y-auto overscroll-contain p-6">
          <div className="mx-auto max-w-7xl">
            <PageNav />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
