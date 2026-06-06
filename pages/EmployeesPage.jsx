import { useEffect, useMemo, useState } from 'react'
import { getAuthToken } from '../config/auth.js'
import { IconChevronDown, IconFilter, IconSearch } from '../components/AdminIcons.jsx'

function PlusIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function IconCheckOutline({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function parseDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [roles, setRoles] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Add Employee Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // Fetch roles from API
  useEffect(() => {
    let cancelled = false

    async function fetchRoles() {
      try {
        const token = await getAuthToken()
        const response = await fetch('http://168.144.70.172:8000/api/admin/employees/roles', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch roles')
        const data = await response.json()
        if (cancelled) return
        setRoles(data.items ?? [])
      } catch (error) {
        console.error('Failed to load roles:', error)
      }
    }

    fetchRoles()
    return () => { cancelled = true }
  }, [])

  const fetchEmployeesData = async () => {
    try {
      const token = await getAuthToken()
      // Increased limit slightly to ensure newly added show up if there are many
      const response = await fetch('http://168.144.70.172:8000/api/admin/employees?limit=50&offset=0', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch employees')
      }
      const data = await response.json()

      const normalized = (data.items ?? []).map((item) => ({
        id: item.employeeId ?? item.id,
        name: item.name ?? '',
        phone: item.phone ?? '',
        email: item.email ?? '',
        role: item.role ?? '',
        status: (item.status ?? '').toLowerCase(),
        date: parseDate(item.createdAt),
      }))

      setEmployees(normalized)
    } catch (error) {
      console.error('Failed to load employees:', error)
    }
  }

  useEffect(() => {
    fetchEmployeesData()
  }, [])

  // Helper: get role label from id (or return the raw value if not found)
  const getRoleLabel = (roleValue) => {
    const found = roles.find((r) => r.id === roleValue)
    return found ? found.label : roleValue
  }

  const handleRoleChange = async (id, newRoleId) => {
    // Optimistic update
    const prevRole = employees.find((e) => e.id === id)?.role
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, role: newRoleId } : emp)))

    try {
      const token = await getAuthToken()
      const roleObj = roles.find((r) => r.id === newRoleId) || { label: newRoleId }

      const res = await fetch(`http://168.144.70.172:8000/api/admin/employees/${id}/role`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: roleObj.label }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to update role')
      }

      const data = await res.json()

      // Determine final role value to store in local state. Try to match with known roles,
      // otherwise use returned value or the selected id.
      const returnedRole = data?.employee?.role
      const match = roles.find((r) => r.id === returnedRole || r.label === returnedRole)
      const finalRoleValue = match ? match.id : returnedRole ?? newRoleId

      setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, role: finalRoleValue } : emp)))
    } catch (err) {
      console.error('Failed to update role:', err)
      // Revert optimistic update
      setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, role: prevRole } : emp)))
    }
  }

  const isValidPhone = (value) => {
    const trimmed = String(value || '').trim()
    if (!trimmed) return false

    const digitsOnly = trimmed.replace(/\D/g, '')
    if (/^\d{10}$/.test(digitsOnly)) return true
    return /^\+\d{1,15}$/.test(trimmed)
  }

  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    if (!newName || !newEmail || !newPhone || !newRole || !newPassword) return

    const trimmedPhone = newPhone.trim()
    if (!isValidPhone(trimmedPhone)) {
      setPhoneError('Enter a valid mobile number (10-digit Indian or E.164 format).')
      return
    }

    try {
      const token = await getAuthToken()
      const response = await fetch('http://168.144.70.172:8000/api/admin/employees', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: newName,
          email: newEmail,
          phone: newPhone,
          role: newRole,
          password: newPassword,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to create employee')
      }

      const data = await response.json()
      // Ensure we have a valid object even if data.employee is missing
      const item = data.employee || data || {}
      const normalizedEmployee = {
        id: item.employeeId || item.id || `emp_${Date.now()}`,
        name: item.name || newName,
        phone: item.phone || newPhone,
        email: item.email || newEmail,
        role: item.role || newRole,
        status: (item.status || 'active').toLowerCase(),
        date: parseDate(item.createdAt || new Date().toISOString()),
      }

      // Prepend to top of the list so it is immediately visible
      setEmployees((prev) => [normalizedEmployee, ...prev])
      
      setNewName('')
      setNewEmail('')
      setNewPhone('')
      setNewRole('')
      setNewPassword('')
      setPhoneError('')
      setIsAddModalOpen(false)
      
      // Fetch latest data from server in background to ensure sync
      fetchEmployeesData()
    } catch (error) {
      console.error('Failed to create employee:', error)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter((emp) => {
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter
      if (!matchesStatus) return false
      if (!q) return true
      return (
        emp.id.toLowerCase().includes(q) ||
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.phone.includes(q)
      )
    })
  }, [employees, query, statusFilter])

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-5">
      {/* Heading & Add Employee Button */}
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="admin-heading text-lg">Employees</h2>
          <p className="admin-subtitle mt-0.5 text-sm">Manage platform employees and role assignments</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#475569] focus:outline-none"
          >
            <PlusIcon />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees..."
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="admin-table-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex-1 overflow-auto">
          <table className="admin-table w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
              <tr className="border-b border-slate-200/80">
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Employee ID
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Name
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Phone Number
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Email
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Role
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Status
                </th>
                <th className="admin-table-head whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#475569] tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="admin-heading truncate whitespace-nowrap px-4 py-3.5 text-sm font-semibold">
                    {row.id}
                  </td>
                  <td className="admin-table-cell truncate whitespace-nowrap px-4 py-3.5 text-sm font-medium">
                    {row.name}
                  </td>
                  <td className="admin-table-muted truncate whitespace-nowrap px-4 py-3.5 text-sm tabular-nums">
                    {row.phone}
                  </td>
                  <td className="admin-table-muted truncate whitespace-nowrap px-4 py-3.5 text-sm">
                    {row.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                    <div className="relative inline-flex items-center gap-1.5 cursor-pointer">
                      <select
                        value={row.role}
                        onChange={(e) => handleRoleChange(row.id, e.target.value)}
                        className="appearance-none bg-transparent pr-6 text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {/* If current role isn't in fetched list, show it as-is */}
                        {!roles.some((r) => r.id === row.role || r.label === row.role) && (
                          <option value={row.role}>{row.role}</option>
                        )}
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <IconChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 text-xs font-semibold">
                      <IconCheckOutline className="h-3.5 w-3.5 text-[#2E7D32]" />
                      Active
                    </span>
                  </td>
                  <td className="admin-table-muted whitespace-nowrap px-4 py-3.5 text-sm">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="admin-subtitle border-t border-slate-100 px-4 py-8 text-center text-sm">
            No employees match your filters.
          </p>
        ) : null}
      </div>

      {/* Add New Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px]">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            {/* Circular Close Button with blue 'x' */}
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false)
                setPhoneError('')
              }}
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#3B82F6] shadow-md border border-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-base font-bold text-slate-900">Add New Employee</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Create a new employee account with role assignment.
            </p>

            <form onSubmit={handleCreateEmployee} className="mt-5 flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="email@vrozart.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newPhone}
                  onChange={(e) => {
                    setNewPhone(e.target.value)
                    if (phoneError) setPhoneError('')
                  }}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 ${
                    phoneError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-200 focus:border-slate-300 focus:ring-slate-100'
                  }`}
                />
                {phoneError && (
                  <span className="text-xs text-red-500 mt-0.5">{phoneError}</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* Role Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Role *</label>
                <div className="relative w-full">
                  <select
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-3.5 pr-9 py-2 text-sm text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 appearance-none cursor-pointer"
                  >
                    <option value="" disabled hidden>Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-[#334155] hover:bg-[#475569] text-white py-2.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Create Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
