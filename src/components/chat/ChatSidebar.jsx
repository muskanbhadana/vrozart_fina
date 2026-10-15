import { useState, useRef, useEffect } from 'react'
import { publicImages } from '../../assets/images'
import { getAvatarUrl, getDisplayName } from '../../utils/displayName'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon } from '../icons'
import {
  DashboardNavIcon,
  FinnabrainNavIcon,
  sidebarNavItemActiveClass,
  sidebarNavItemCollapsedClass,
  sidebarNavItemExpandedClass,
} from '../shared/sidebarNav'

export default function ChatSidebar({
  email,
  userName,
  onExit,
  showDashboardNav = false,
  onOpenDashboard,
  onLogout,
}) {
  const [collapsed, setCollapsed] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const displayName = userName?.trim() || getDisplayName(email)
  const avatarUrl = getAvatarUrl(email, displayName)

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-gray-100 bg-[#f4f7fb] transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[210px]'
      }`}
    >
      <div
        className={`flex flex-1 flex-col ${
          collapsed ? 'items-center px-3 pb-5 pt-5' : 'px-4 py-5'
        }`}
      >
        <div className={collapsed ? 'flex items-center justify-center' : 'w-full'}>
          <img
            src={collapsed ? publicImages.logoCompact : publicImages.logo}
            alt="Vrozart Finance"
            className={
              collapsed
                ? 'h-8 w-[46px] object-contain'
                : 'h-8 w-full max-w-[168px] object-contain object-left'
            }
          />
        </div>

        <nav
          className={`mt-6 w-full space-y-2 ${collapsed ? 'flex flex-col items-center' : ''}`}
        >
          <button
            type="button"
            className={
              collapsed
                ? sidebarNavItemCollapsedClass
                : `${sidebarNavItemExpandedClass} ${sidebarNavItemActiveClass}`
            }
            aria-label="Finnabrain"
            aria-current="page"
          >
            <FinnabrainNavIcon />
            {!collapsed && <span>Finnabrain</span>}
          </button>

          {showDashboardNav && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className={
                collapsed ? sidebarNavItemCollapsedClass : sidebarNavItemExpandedClass
              }
              aria-label="Dashboard"
            >
              <DashboardNavIcon />
              {!collapsed && <span>Dashboard</span>}
            </button>
          )}
        </nav>

        <div
          className={`mt-auto w-full ${
            collapsed ? 'flex flex-col items-center gap-4' : 'space-y-3'
          }`}
        >
          {collapsed ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="relative flex w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center gap-2 rounded-xl border border-gray-100 bg-white px-2.5 py-2 shadow-sm transition-colors hover:bg-gray-50 text-left"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                  {displayName}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400">
                  <ChevronsUpDownIcon className="h-4 w-4" />
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-full min-w-[200px] rounded-xl border border-gray-100 bg-white p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <div className="px-3 py-2">
                    <p className="truncate text-[13px] font-medium text-gray-500">
                      {email}
                    </p>
                  </div>
                  <div className="my-1 h-[1px] bg-gray-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false)
                      onLogout()
                    }}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onExit}
            className={`flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-800 ${
              collapsed ? 'justify-center' : 'px-1'
            }`}
          >
            <ChevronLeftIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-10 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors hover:border-gray-300 hover:text-gray-600"
      >
        {collapsed ? (
          <ChevronRightIcon className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  )
}
