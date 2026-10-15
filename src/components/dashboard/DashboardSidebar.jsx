import { useState, useEffect, useRef } from 'react'
import { publicImages } from '../../assets/images'
import { DASHBOARD_VARIANT } from '../../hooks/useAppFlow'
import { getAvatarUrl, getDisplayName } from '../../utils/displayName'
import {
  BuildingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  VaultIcon,
} from '../icons'
import {
  DashboardNavIcon,
  FinnabrainNavIcon,
  sidebarNavItemCollapsedClass,
} from '../shared/sidebarNav'
import AddBusinessModal from './AddBusinessModal'
import { createApplicationAndStartChat } from '../../services/applicationService'
import { getToken } from '../../services/token'


function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
        active
          ? 'border border-gray-100 bg-white font-medium text-gray-800 shadow-sm'
          : 'font-medium text-gray-600 hover:bg-white/60'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default function DashboardSidebar({
  variant,
  email,
  userName,
  onOpenChat,
  onLogout,
  onSelectBusiness,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false)
  const [businesses, setBusinesses] = useState([])
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

  const displayName = userName?.trim() || getDisplayName(email) || 'Sunena'
  const avatarUrl =
    variant === DASHBOARD_VARIANT.SUBMITTED
      ? publicImages.profileLawrence
      : getAvatarUrl(email, displayName)
  const initials = getInitials(displayName)
  const isAdvanced =
    variant === DASHBOARD_VARIANT.ADVANCED || variant === DASHBOARD_VARIANT.SUBMITTED
  const showBusinesses = isAdvanced
  const useProfilePhoto = isAdvanced
  const displayNameResolved =
    variant === DASHBOARD_VARIANT.SUBMITTED
      ? userName?.trim() || 'Lawrence Cruz'
      : displayName

  useEffect(() => {
    async function fetchBusinesses() {
      if (!getToken()) return;
      try {
        const response = await fetch('http://168.144.70.172:8000/api/applications', {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const activeChatId = sessionStorage.getItem('vrozart_active_chat_id');
          const mappedBusinesses = data.map(app => ({
            id: app.applicationId,
            name: app.businessName || 'Unnamed Business',
            chatId: app.chatId,
            active: app.chatId === activeChatId
          }));
          setBusinesses(mappedBusinesses);

          // Notify parent about the currently active business
          const activeBiz = mappedBusinesses.find(b => b.active);
          if (activeBiz && onSelectBusiness) {
            onSelectBusiness(activeBiz);
          } else if (mappedBusinesses.length > 0 && onSelectBusiness) {
            // If no active one, default to first business
            onSelectBusiness(mappedBusinesses[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      }
    }
    
    fetchBusinesses();
  }, []);

  const handleAddBusinessClick = () => {
    setIsAddBusinessModalOpen(true)
  }
  const handleCloseAddBusinessModal = () => {
    setIsAddBusinessModalOpen(false)
  }
  const handleContinueAddBusiness = async (businessName, businessDescription) => {
    try {
      await createApplicationAndStartChat({ businessName, businessDescription })
    } catch (error) {
      console.error('API Error:', error);
    }
    
    setIsAddBusinessModalOpen(false)
    onOpenChat?.()
  }

  if (collapsed) {
    return (
      <aside className="relative flex h-screen w-[72px] shrink-0 flex-col items-center border-r border-gray-100 bg-[#f8fafc] py-5">
        <img
          src={publicImages.logoCompact}
          alt="Vrozart"
          className="h-8 w-[46px] object-contain"
        />
        <nav className="mt-6 flex flex-col items-center gap-2">
          <button type="button" aria-label="Dashboard" className={sidebarNavItemCollapsedClass}>
            <DashboardNavIcon />
          </button>

          <button
            type="button"
            aria-label="Finnabrain"
            onClick={onOpenChat}
            className={sidebarNavItemCollapsedClass}
          >
            <FinnabrainNavIcon />
          </button>

          <button
            type="button"
            aria-label="Vault X"
            className={sidebarNavItemCollapsedClass}
          >
            <span className="flex h-9 w-9 items-center justify-center">
              <VaultIcon className="h-[22px] w-[22px] text-gray-600" />
            </span>
          </button>
        </nav>
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-gray-600"
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </aside>
    )
  }

  return (
    <aside className="relative flex h-screen w-[260px] shrink-0 flex-col border-r border-gray-100 bg-[#f8fafc] px-5 py-6">
      <button
        type="button"
        onClick={() => setCollapsed(true)}
        aria-label="Collapse sidebar"
        className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors hover:border-gray-300 hover:text-gray-600"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
      </button>

      <div className="shrink-0">
        <img
          src={publicImages.logo}
          alt="VROZART FINANCE"
          className="h-9 w-[168px] max-w-full object-contain object-left"
        />

        <nav className="mt-7 space-y-2">
          <NavItem active label="Dashboard" icon={<DashboardNavIcon />} />
          <NavItem
            label="Finnabrain"
            onClick={onOpenChat}
            icon={<FinnabrainNavIcon />}
          />
          <NavItem
            label="Vault X"
            icon={
              <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                <VaultIcon className="h-[22px] w-[22px] text-gray-500" />
              </span>
            }
          />
        </nav>

        {showBusinesses && (
          <div className="mt-7">
            <p className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
              Businesses
            </p>
            <div className="space-y-1">
              {businesses.map((biz) => (
                <button
                  key={biz.id}
                  type="button"
                  onClick={() => {
                    if (biz.chatId) {
                      sessionStorage.setItem('vrozart_active_chat_id', biz.chatId);
                    }
                    // Update active state locally
                    setBusinesses(prev => prev.map(b => ({ ...b, active: b.id === biz.id })));
                    // Notify parent about selected business
                    onSelectBusiness?.(biz);
                    // Open the chat for this business
                    onOpenChat?.();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-[14px] px-3.5 py-3 text-left text-[15px] transition-colors ${
                    biz.active
                      ? 'bg-white font-semibold text-gray-900 shadow-[0_1px_4px_rgba(15,23,42,0.06)]'
                      : 'font-medium text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <BuildingIcon
                    className={`h-[18px] w-[18px] shrink-0 ${
                      biz.active ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                  <span className="truncate leading-snug">{biz.name}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={handleAddBusinessClick}
                className="mt-2 w-full rounded-[14px] bg-[#2f3640] px-3.5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#252b33]"
              >
                + Add Business
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto shrink-0 space-y-4 pb-1">
        <div className="rounded-[16px] bg-[#4A72B2] px-4 py-4 shadow-[0_4px_14px_rgba(74,114,178,0.25)]">
          <p className="text-[15px] font-semibold text-white">Need Help?</p>
          <p className="mt-1 text-[13px] leading-relaxed text-white/90">
            Connect with our financial advisors
          </p>
          <button
            type="button"
            onClick={onOpenChat}
            className="mt-4 w-full rounded-[12px] bg-white py-2.5 text-[14px] font-semibold text-[#4A72B2] transition-colors hover:bg-gray-50"
          >
            Chat with Finance AI
          </button>
        </div>

        <div className="relative flex w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center gap-3 rounded-[14px] bg-white px-3 py-2.5 shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition-colors hover:bg-gray-50 text-left"
          >
            {useProfilePhoto ? (
              <img
                src={avatarUrl}
                alt={displayNameResolved}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfe8f5] text-[13px] font-semibold text-[#4A72B2]">
                {initials}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-gray-900">
              {displayNameResolved}
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
      </div>

      {isAddBusinessModalOpen && (
        <AddBusinessModal
          onClose={handleCloseAddBusinessModal}
          onContinue={handleContinueAddBusiness}
        />
      )}
    </aside>
  )
}
