import { useEffect, useMemo, useRef, useState } from 'react'
import { LEAD_STATUS, LEAD_STATUS_FILTER_OPTIONS } from '../data/leads.js'
import { getAuthToken } from '../config/auth.js'
import { IconChevronDown, IconEye, IconFilter, IconSearch } from '../components/AdminIcons.jsx'

function rowKey(row) {
  return `${row.id}-${row.applicantName}-${row.businessName}-${row.status}`
}

// Custom SVG Icons for Badges
function IconCheck({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function IconPaperPlane({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

function IconFolderPlus({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  )
}

// WhatsApp premium icon
function IconWhatsApp({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.808 1.452 5.568 0 10.1-4.529 10.103-10.098.002-2.699-1.047-5.236-2.951-7.141-1.905-1.905-4.437-2.954-7.135-2.955-5.572 0-10.105 4.53-10.108 10.1-.001 1.761.464 3.48 1.347 5.02l-.995 3.637 3.736-.98-.01.005zm10.744-7.404c-.292-.146-1.727-.852-1.994-.95-.266-.097-.461-.146-.656.146-.195.292-.756.95-.927 1.146-.171.195-.341.219-.633.073-.292-.147-1.23-.453-2.344-1.447-.866-.772-1.451-1.725-1.621-2.018-.17-.293-.018-.452.129-.597.132-.131.292-.341.439-.512.146-.17.195-.292.292-.487.097-.195.049-.365-.024-.512-.073-.146-.656-1.583-.9-2.17-.236-.57-.478-.49-.656-.499-.17-.008-.365-.01-.56-.01-.196 0-.512.073-.78.365-.268.293-1.024 1.001-1.024 2.441 0 1.439 1.048 2.83 1.194 3.025.147.195 2.062 3.149 4.996 4.413.698.301 1.244.48 1.669.615.702.224 1.34.193 1.844.118.563-.083 1.727-.706 1.972-1.389.244-.682.244-1.267.17-1.388-.073-.122-.268-.195-.56-.341z" />
    </svg>
  )
}

function UploadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function PlusIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function LeadsPage({ onViewDetails, onAddLead }) {
  const [leads, setLeads] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const token = await getAuthToken()
      const prevLeads = [...leads]
      
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus.toLowerCase() } : l))
      
      const statusPayload = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase()
      const res = await fetch(`http://168.144.70.172:8000/api/admin/leads/${encodeURIComponent(leadId)}/status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusPayload })
      })
      
      if (!res.ok) {
        setLeads(prevLeads)
        console.error('Failed to update status')
      }
    } catch (err) {
      console.error('Status update error', err)
      fetchLeads()
    }
  }

  const fetchLeads = async (isCancelled = () => false) => {
    try {
      const token = await getAuthToken()
      const response = await fetch('http://168.144.70.172:8000/api/admin/leads?limit=20&offset=0', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to load leads')
      }
      const data = await response.json()
      if (isCancelled()) return

      const normalized = (data.items ?? []).map((item) => ({
        id: item.leadId ?? item.id,
        applicantName: item.fullName ?? '',
        phone: item.phone ?? '',
        email: item.email ?? '',
        businessName: item.businessName ?? '',
        submittedBy: item.submittedBy ?? '',
        status: (item.status ?? '').toLowerCase(),
        date: formatDate(item.createdAt ?? item.updatedAt),
      }))

      setLeads(normalized)
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchLeads(() => cancelled)
    
    const handleClickOutside = () => setOpenDropdownId(null)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      cancelled = true
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter((row) => {
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      if (!matchesStatus) return false
      if (!q) return true
      return (
        row.id.toLowerCase().includes(q) ||
        row.applicantName.toLowerCase().includes(q) ||
        row.businessName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.phone.includes(q)
      )
    })
  }, [leads, query, statusFilter])

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-5">
      {/* Title & Header Action Buttons */}
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="admin-heading text-lg">Leads</h2>
          <p className="admin-subtitle mt-0.5 text-sm">Manage all incoming leads</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#475569] focus:outline-none"
          >
            <UploadIcon />
            Upload Excel
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setImportResult(null)
              setUploading(true)
              try {
                const token = await getAuthToken()
                const fd = new FormData()
                fd.append('file', file, file.name)

                const resp = await fetch('http://168.144.70.172:8000/api/admin/leads/import', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                  },
                  body: fd,
                })

                if (!resp.ok) {
                  const text = await resp.text()
                  throw new Error(text || 'Upload failed')
                }

                const json = await resp.json()
                setImportResult(json)
                fetchLeads()
              } catch (err) {
                console.error('Import failed', err)
                setImportResult({ success: false, error: String(err) })
              } finally {
                setUploading(false)
                // reset input so same file can be uploaded again if needed
                e.target.value = null
              }
            }}
          />
          <button
            type="button"
            onClick={() => onAddLead?.()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#2563EB] focus:outline-none"
          >
            <PlusIcon />
            Add Lead
          </button>
        </div>
      </div>

      {uploading || importResult ? (
        <div className="shrink-0 rounded-md border border-slate-200/80 bg-white p-3 text-sm">
          {uploading ? (
            <div>Uploading file... please wait.</div>
          ) : importResult?.success ? (
            <div>
              Import complete — <strong>{importResult.imported ?? 0}</strong> imported, <strong>{importResult.failed ?? 0}</strong> failed.
            </div>
          ) : (
            <div className="text-rose-600">Import failed: {importResult?.error ?? 'Unknown error'}</div>
          )}
        </div>
      ) : null}

      {/* Search & Status Filters */}
      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ID, or business..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
            <IconFilter className="h-4 w-4" aria-hidden />
          </span>
          <div className="relative min-w-[10.5rem]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
              aria-label="Filter by status"
            >
              {LEAD_STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="admin-table-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex-1 overflow-auto">
          <table className="admin-table w-full min-w-[1100px] text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
              <tr className="border-b border-slate-200/80">
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Lead ID
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Applicant Name
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Phone Number
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Email
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Business Name
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Summited By
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Status
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Created At
                </th>
                <th className="admin-table-head w-24 px-4 py-3.5 text-center text-xs font-semibold text-[#475569] tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => {
                const statusConfig = LEAD_STATUS[row.status]
                return (
                  <tr
                    key={rowKey(row)}
                    onClick={() => onViewDetails?.(row)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/70"
                  >
                    <td className="admin-heading truncate whitespace-nowrap px-4 py-3.5 text-sm font-semibold">
                      {row.id}
                    </td>
                    <td className="admin-table-cell truncate whitespace-nowrap px-4 py-3.5 text-sm font-medium">
                      {row.applicantName}
                    </td>
                    <td className="admin-table-muted truncate whitespace-nowrap px-4 py-3.5 text-sm tabular-nums">
                      {row.phone}
                    </td>
                    <td className="admin-table-muted truncate whitespace-nowrap px-4 py-3.5 text-sm">
                      {row.email}
                    </td>
                    <td className="admin-table-cell truncate whitespace-nowrap px-4 py-3.5 text-sm font-medium">
                      {row.businessName}
                    </td>
                    <td className="admin-table-cell truncate whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-500">
                      {row.submittedBy}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(openDropdownId === row.id ? null : row.id)
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors hover:opacity-80 focus:outline-none ${statusConfig.className}`}
                      >
                        {statusConfig.iconName === 'new' && <IconFolderPlus />}
                        {statusConfig.iconName === 'contacted' && <IconPaperPlane />}
                        {statusConfig.iconName === 'converted' && <IconCheck />}
                        {statusConfig.label}
                      </button>

                      {openDropdownId === row.id && (
                        <div 
                          className="absolute z-50 mt-2 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg"
                          style={{ top: '100%', left: '1rem', minWidth: 'max-content' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {Object.entries(LEAD_STATUS).map(([statusKey, config]) => (
                            <button
                              key={statusKey}
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null)
                                if (row.status !== statusKey) {
                                  updateLeadStatus(row.id, statusKey)
                                }
                              }}
                              className="flex w-full items-center justify-start rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors focus:outline-none"
                            >
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
                                {config.iconName === 'new' && <IconFolderPlus />}
                                {config.iconName === 'contacted' && <IconPaperPlane />}
                                {config.iconName === 'converted' && <IconCheck />}
                                {config.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="admin-table-muted whitespace-nowrap px-4 py-3.5 text-sm">
                      {row.date}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onViewDetails?.(row)
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 text-slate-500 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-700"
                          aria-label={`View ${row.applicantName}`}
                        >
                          <IconEye className="h-4 w-4" />
                        </button>
                        {(row.status === 'new' || row.status === 'contacted') && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              // WhatsApp Action - stops propagation to row click
                              const formattedPhone = row.phone.replace(/[\s+]/g, '')
                              window.open(`https://wa.me/${formattedPhone}`, '_blank')
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A] transition-colors hover:bg-[#DCFCE7] hover:text-[#15803D]"
                            aria-label={`WhatsApp ${row.applicantName}`}
                          >
                            <IconWhatsApp className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="admin-subtitle border-t border-slate-100 px-4 py-8 text-center text-sm">
            No leads match your filters.
          </p>
        ) : null}
      </div>
    </div>
  )
}
