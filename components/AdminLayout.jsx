import { useState } from 'react'
import { IconSettings } from './AdminIcons.jsx'
import AdminSidebar from './AdminSidebar.jsx'
import CreditSidebar from './CreditSidebar.jsx'

export default function AdminLayout({ activePage, onNavigate, children, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isCreditRoute = typeof window !== 'undefined' && window.location.pathname.includes('/credit')
  const dashboardTitle = isCreditRoute ? 'Credit Analyst Portal' : 'Admin Panel'
  const dashboardSubtitle = isCreditRoute ? 'Manage credit analysis operations' : 'Manage your finance operations'

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {isCreditRoute ? (
        <CreditSidebar
          activePage={activePage}
          onNavigate={onNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
      ) : (
        <AdminSidebar
          activePage={activePage}
          onNavigate={onNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <header className="flex shrink-0 items-start justify-between border-b border-slate-100 px-8 py-6">
          <div>
            <h1 className="admin-title text-xl">{dashboardTitle}</h1>
            <p className="admin-subtitle mt-0.5 text-sm">{dashboardSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-[#64748B] transition-colors hover:bg-slate-50 hover:text-[#334155]"
              aria-label="Settings"
            >
              <IconSettings className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onLogout && onLogout()}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#334155] bg-transparent hover:bg-slate-50 border border-slate-100"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/40 px-6 py-5 md:px-8 md:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
