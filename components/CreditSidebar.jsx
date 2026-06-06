import { useState } from 'react'
import { publicImages } from '../assets/images.js'
import { getAdminUser } from '../config/auth.js'
import {
  IconLayoutDashboard,
  IconDocument,
  IconChevronLeft,
  IconChevronRight,
  IconMoreVertical,
} from './CreditIcons.jsx'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { id: 'assigned-applications', label: 'Assigned Application', icon: IconDocument },
]

export default function CreditSidebar({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onLogout,
}) {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-slate-100 bg-[#F8F9FC] transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-[4.5rem] z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-600"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
      </button>

      <div className={`flex flex-1 flex-col py-6 ${collapsed ? 'items-center px-2' : 'px-4'}`}>
        <div className={`flex justify-center ${collapsed ? 'mb-5' : 'mb-8 px-2'}`}>
          <img
            src={collapsed ? publicImages.logoCompact : publicImages.logo}
            alt="VROZART FINANCE"
            className={`object-contain ${collapsed ? 'h-7 w-7' : 'h-8 w-auto'}`}
          />
        </div>

        <nav className={`flex flex-col ${collapsed ? 'items-center gap-2' : 'gap-1'}`}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                title={collapsed ? label : undefined}
                className={
                  collapsed
                    ? `flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'border border-slate-200/80 bg-white text-[#64748B] shadow-sm hover:border-slate-300'
                      }`
                    : `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'credit-nav-inactive hover:bg-white'
                      }`
                }
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                  <Icon
                    className={`shrink-0 h-[22px] w-[22px] ${
                      isActive ? 'text-blue-600' : collapsed ? '' : 'credit-nav-icon-inactive'
                    }`}
                  />
                </span>
                {!collapsed ? <span>{label}</span> : null}
              </button>
            )
          })}
        </nav>
      </div>

      <div
        className={`mt-auto flex items-center border-t border-slate-100 py-4 ${
          collapsed ? 'justify-center px-2' : 'gap-3 px-4'
        }`}
      >
        <img
          src={publicImages.profileLawrence}
          alt=""
          className={`shrink-0 rounded-full object-cover ${
            collapsed ? 'h-8 w-8' : 'h-9 w-9'
          }`}
        />
        {!collapsed ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="credit-heading truncate text-sm">{getAdminUser()?.name || 'Admin User'}</p>
            </div>
            <div className="relative flex">
              <button 
                type="button" 
                className="text-slate-400 hover:text-slate-600" 
                aria-label="Profile menu"
                onClick={() => setShowLogoutPopup(!showLogoutPopup)}
              >
                <IconMoreVertical className="text-slate-400" />
              </button>
              
              {showLogoutPopup && (
                <div className="absolute bottom-6 -right-2 mb-2 w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50">
                  <p className="mb-3 text-sm font-medium text-slate-700">Do you want to logout?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowLogoutPopup(false)
                        onLogout && onLogout()
                      }}
                      className="flex-1 rounded-lg bg-red-50 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowLogoutPopup(false)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </aside>
  )
}
