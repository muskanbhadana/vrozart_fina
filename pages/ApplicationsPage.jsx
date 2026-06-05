import { useEffect, useMemo, useState } from 'react'
import { STATUS_FILTER_OPTIONS } from '../data/applications.js'
import { getAuthToken } from '../config/auth.js'
import ApplicationStatusBadge from '../components/ApplicationStatusBadge.jsx'
import { IconChevronDown, IconEye, IconFilter, IconSearch, IconUserPlus } from '../components/AdminIcons.jsx'

function rowKey(row) {
  return `${row.id}-${row.applicantName}-${row.businessName}-${row.status}`
}

function formatDate(raw) {
  if (!raw) return '-'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  const day = d.getDate()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month},${year}`
}

function normalizeStatus(raw) {
  if (!raw) return ''
  const s = raw.toLowerCase().trim()
  // Map common API status values to our known keys
  const statusMap = {
    'under_review': 'under_review',
    'under review': 'under_review',
    'underreview': 'under_review',
    'pending': 'under_review',
    'in_review': 'under_review',
    'in_progress': 'in_progress',
    'in progress': 'in_progress',
    'inprogress': 'in_progress',
    'processing': 'in_progress',
    'approved': 'approved',
    'accept': 'approved',
    'accepted': 'approved',
    'created': 'created',
    'new': 'created',
    'submitted': 'created',
    'financial_upload': 'financial_upload',
    'financial upload': 'financial_upload',
    'financialupload': 'financial_upload',
    'financial': 'financial_upload',
    'rejected': 'rejected',
    'reject': 'rejected',
    'declined': 'rejected',
    'kyc': 'kyc',
    'kyc_pending': 'kyc',
    'kyc_verification': 'kyc',
  }
  return statusMap[s] || s
}

function getAssigneeName(val) {
  if (!val) return ''
  if (typeof val === 'object') {
    return val.name || val.employeeId || ''
  }
  return String(val)
}

function normalizeApplication(item) {
  const rawAssignee = item.assignTo ?? item.assignedTo ?? item.assignee ?? item.assigneeName ?? item.assigned_to
  return {
    id: String(item.applicationId ?? item.id ?? item._id ?? item.application_id ?? 'N/A'),
    applicantName: String(item.fullName ?? item.applicantName ?? item.name ?? item.customerName ?? ''),
    phone: String(item.phone ?? item.contactNumber ?? item.mobile ?? ''),
    email: String(item.email ?? item.contactEmail ?? ''),
    businessName: String(item.businessName ?? item.companyName ?? item.business_name ?? ''),
    status: normalizeStatus(item.status ?? ''),
    date: item.date ?? item.createdAt ?? item.updatedAt ?? '',
    assignTo: getAssigneeName(rawAssignee),
  }
}

export default function ApplicationsPage({ onViewDetails, onAssignClick, onAssignApplication }) {
  const [applications, setApplications] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let cancelled = false

    async function fetchApplications() {
      try {
        const token = await getAuthToken()
        const response = await fetch('http://168.144.70.172:8000/api/admin/applications?limit=20&offset=0', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to load applications')
        }
        const data = await response.json()
        if (cancelled) return

        const items = data.items ?? data.applications ?? data.data ?? []
        const normalized = (items ?? []).map(normalizeApplication)
        setApplications(normalized)
      } catch (error) {
        console.error('Failed to fetch applications:', error)
      }
    }

    fetchApplications()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return applications.filter((row) => {
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      if (!matchesStatus) return false
      if (!q) return true
      return (
        row.id.toLowerCase().includes(q) ||
        row.applicantName.toLowerCase().includes(q) ||
        row.businessName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.phone.toLowerCase().includes(q)
      )
    })
  }, [applications, query, statusFilter])

  return (
    <div className="flex min-h-0 flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="admin-heading text-lg">Applications</h2>
          <p className="admin-subtitle mt-0.5 text-sm">Manage all loan applications</p>
        </div>
        <button
          type="button"
          onClick={onAssignClick}
          className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#475569] focus:outline-none"
        >
          <IconUserPlus className="h-3.5 w-3.5" />
          Assign Application
        </button>
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

      <div className="admin-table-card overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="max-h-[430px] overflow-auto">
          <table className="admin-table w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/90">
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Application ID
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
                  Stage
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Date
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Assign To
                </th>
                <th className="admin-table-head w-16 px-4 py-3.5 text-center text-xs font-semibold text-[#475569] tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={rowKey(row)} className="transition-colors hover:bg-slate-50/70">
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
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <ApplicationStatusBadge status={row.status} />
                  </td>
                  <td className="admin-table-muted whitespace-nowrap px-4 py-3.5 text-sm">
                    {formatDate(row.date)}
                  </td>
                  <td className="admin-table-muted truncate whitespace-nowrap px-4 py-3.5 text-sm">
                    {row.assignTo ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                        {row.assignTo}
                      </span>
                    ) : (
                      <span className="tracking-[3px] text-slate-300">- - - - - - - - -</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetails?.(row)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 text-slate-500 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-700"
                        aria-label={`View ${row.applicantName}`}
                        title="View Details"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAssignApplication?.(row)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 text-slate-500 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-700"
                        aria-label={`Assign ${row.applicantName}`}
                        title="Assign Application"
                      >
                        <IconUserPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="admin-subtitle border-t border-slate-100 px-4 py-8 text-center text-sm">
            No applications match your filters.
          </p>
        ) : null}
      </div>
    </div>
  )
}
