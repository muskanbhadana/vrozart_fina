import { useEffect, useMemo, useState } from 'react'
import { getAuthToken } from '../config/auth.js'
import ApplicationStatusBadge from '../components/ApplicationStatusBadge.jsx'
import { IconDocument, IconSearch } from '../components/AdminIcons.jsx'

function normalizeStatus(raw) {
  if (!raw) return ''
  const s = raw.toLowerCase().trim()
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

function normalizeApplication(item) {
  return {
    id: item.applicationId ?? item.id ?? item._id ?? item.application_id ?? 'N/A',
    applicantName: item.fullName ?? item.applicantName ?? item.name ?? item.customerName ?? '',
    businessName: item.businessName ?? item.companyName ?? item.business_name ?? '',
    status: normalizeStatus(item.status ?? ''),
  }
}

export default function SelectApplicationPage({ onBack, onContinue }) {
  const [applications, setApplications] = useState([])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

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
      if (!q) return true
      return (
        row.id.toLowerCase().includes(q) ||
        row.applicantName.toLowerCase().includes(q) ||
        row.businessName.toLowerCase().includes(q)
      )
    })
  }, [applications, query])

  return (
    <div className="flex min-h-0 flex-col gap-5">
      <div className="flex items-center justify-between rounded-xl bg-zinc-700 px-4 py-3">
        <div className="w-8" />
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
        >
          &lt; Back
        </button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="admin-heading text-lg">Select Application</h2>
          <p className="admin-subtitle mt-0.5 text-sm">Select the application</p>
        </div>
        {selectedId && (
          <button
            type="button"
            onClick={() => {
              const selectedApp = applications.find(a => a.id === selectedId)
              onContinue?.(selectedApp)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Continue &rarr;
          </button>
        )}
      </div>

      <div className="relative min-w-0">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, ID, or business..."
          className="w-full rounded-xl border border-slate-100 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pb-4">
        {filtered.map((row) => {
          const isSelected = selectedId === row.id
          return (
            <label
              key={row.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200/50 text-slate-500">
                  <IconDocument className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{row.applicantName}</div>
                  <div className="mt-1 text-xs text-slate-500">Application ID: {row.id}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{row.businessName}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ApplicationStatusBadge status={row.status} />
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white'}`}>
                  {isSelected && (
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="radio"
                  name="applicationSelection"
                  value={row.id}
                  checked={isSelected}
                  onChange={() => setSelectedId(row.id)}
                  className="sr-only"
                />
              </div>
            </label>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No applications match your search.</p>
        )}
      </div>
    </div>
  )
}
