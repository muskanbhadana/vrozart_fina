import { useEffect, useMemo, useState } from 'react'
import { getAuthToken } from '../config/auth.js'
import { IconDocument, IconSearch } from '../components/AdminIcons.jsx'

function formatRole(role) {
  if (!role) return ''
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function SelectEmployeePage({ onBack, onAssign }) {
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchEmployees() {
      setIsLoading(true)
      try {
        const token = await getAuthToken()
        const response = await fetch('http://168.144.70.172:8000/api/admin/employees?limit=20&offset=0', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch employees')
        }
        const data = await response.json()
        if (cancelled) return

        const normalized = (data.items ?? []).map((item) => ({
          id: item.id, // Keep original DB UUID
          employeeId: item.employeeId ?? item.id,
          name: item.name ?? '',
          role: formatRole(item.role ?? ''),
        }))

        setEmployees(normalized)
      } catch (error) {
        console.error('Failed to load employees:', error)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchEmployees()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter((row) => {
      if (!q) return true
      return (
        String(row.employeeId || '').toLowerCase().includes(q) ||
        String(row.name || '').toLowerCase().includes(q) ||
        String(row.role || '').toLowerCase().includes(q)
      )
    })
  }, [employees, query])

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
          <h2 className="admin-heading text-lg">Select Employee</h2>
          <p className="admin-subtitle mt-0.5 text-sm">Select the employee</p>
        </div>
        {selectedId && (
          <button
            type="button"
            onClick={() => {
              const selectedEmp = employees.find(e => e.id === selectedId)
              onAssign?.(selectedEmp)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Assign Application &rarr;
          </button>
        )}
      </div>

      <div className="relative min-w-0">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, employee ID"
          className="w-full rounded-xl border border-slate-100 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pb-4">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading employees...</p>
        ) : (
          <>
            {filtered.map((row) => {
              const isSelected = selectedId === row.id
              return (
                <label
                  key={row.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                    isSelected ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200/50 text-slate-500">
                      <IconDocument className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{row.name}</div>
                      <div className="mt-1 text-xs text-slate-500">Employee ID: {row.employeeId || 'N/A'}</div>
                      <div className="mt-0.5 text-xs text-slate-500">Role: {row.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-slate-100'}`}>
                      {isSelected && (
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="employeeSelection"
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
              <p className="py-8 text-center text-sm text-slate-500">No employees match your search.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
