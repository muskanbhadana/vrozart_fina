import { useEffect, useMemo, useState } from 'react'
import { STATUS_FILTER_OPTIONS } from '../data/creditApplications.js'
import { CreditStatusBadge, ApplicationStageBadge } from '../components/ApplicationStatusBadge.jsx'
import { IconChevronDown, IconFilter, IconSearch, IconEye } from '../components/CreditIcons.jsx'
import { getAuthToken } from '../config/auth.js'

function rowKey(row, index) {
  return `${row.id}-${row.applicantName}-${row.businessName}-${row.status}-${index}`
}

export default function AssignedApplicationsPage({ onViewDetails }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        const token = await getAuthToken()
        const res = await fetch('http://168.144.70.172:8000/api/credit-analyst/applications/assigned?limit=100&offset=0', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!cancelled) {
          const items = (data.items || []).map(item => ({
            ...item,
            id: item.applicationId || item.id,
          }))
          setApplications(items)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return applications.filter((row) => {
      // Check both raw status and statusKey if they exist
      const rowStatus = row.status?.toLowerCase() || ''
      const rowStatusKey = row.statusKey?.toLowerCase() || ''
      const filterLower = statusFilter.toLowerCase()
      
      const matchesStatus = 
        statusFilter === 'all' || 
        rowStatus === filterLower || 
        rowStatusKey === filterLower

      if (!matchesStatus) return false
      if (!q) return true
      return (
        row.id?.toLowerCase().includes(q) ||
        row.applicantName?.toLowerCase().includes(q) ||
        row.businessName?.toLowerCase().includes(q) ||
        row.email?.toLowerCase().includes(q) ||
        row.phone?.toLowerCase().includes(q)
      )
    })
  }, [applications, query, statusFilter])

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-5">
      <div>
        <h2 className="credit-heading text-lg">Assigned Applications</h2>
        <p className="credit-subtitle mt-0.5 text-sm">
          Review and verify documents for your assigned applications.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="credit-table-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading applications...</div>
          ) : (
            <table className="credit-table w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                <tr className="border-b border-slate-200/80">
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Application ID
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Applicant Name
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Phone Number
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Email
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Business Name
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Status
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Stage
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-left text-[13px] font-bold text-slate-900">
                    Date
                  </th>
                  <th className="credit-table-head whitespace-nowrap px-4 py-4 text-center text-[13px] font-bold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row, index) => (
                  <tr
                    key={rowKey(row, index)}
                    onClick={() => onViewDetails?.(row)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/70"
                  >
                    <td className="credit-heading truncate whitespace-nowrap px-4 py-3.5 text-sm font-semibold">
                      {row.id}
                    </td>
                    <td className="credit-table-cell truncate whitespace-nowrap px-4 py-3.5 text-sm font-medium">
                      {row.applicantName}
                    </td>
                    <td className="credit-table-muted truncate whitespace-nowrap px-4 py-3.5 text-sm tabular-nums">
                      {row.phone}
                    </td>
                    <td className="credit-table-muted truncate whitespace-nowrap px-4 py-3.5 text-sm">
                      {row.email}
                    </td>
                    <td className="credit-table-cell truncate whitespace-nowrap px-4 py-3.5 text-sm font-medium">
                      {row.businessName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <CreditStatusBadge status={row.statusKey || row.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <ApplicationStageBadge stage={row.stageKey || row.stage || row.currentStage} />
                    </td>
                    <td className="credit-table-muted whitespace-nowrap px-4 py-3.5 text-sm tabular-nums">
                      {row.date || (row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                        aria-label="View details"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && filtered.length === 0 ? (
          <p className="credit-subtitle border-t border-slate-100 px-4 py-8 text-center text-sm">
            No applications match your filters.
          </p>
        ) : null}
      </div>
    </div>
  )
}
