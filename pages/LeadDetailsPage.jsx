import { useState, useEffect } from 'react'
import { getAuthToken } from '../config/auth.js'

export default function LeadDetailsPage({ lead, onBack }) {
  const [remoteLead, setRemoteLead] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loanRequirement, setLoanRequirement] = useState('₹ 25000000')
  const [businessType, setBusinessType] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({ fullName: '', phone: '' })

  const LEADS_API_URL = 'http://168.144.70.172:8000/api/admin/leads'

  const isValidPhone = (value) => {
    const trimmed = String(value || '').trim()
    if (!trimmed) return false

    const digitsOnly = trimmed.replace(/\D/g, '')
    if (/^\d{10}$/.test(digitsOnly)) return true
    return /^\+\d{1,15}$/.test(trimmed)
  }

  useEffect(() => {
    async function fetchLeadById(id) {
      setIsLoading(true)
      try {
        const token = await getAuthToken()
        const response = await fetch(`${LEADS_API_URL}/${encodeURIComponent(id)}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const text = await response.text()
          throw new Error(text || `Failed to load lead ${id}`)
        }

        const data = await response.json()
        setRemoteLead(data.lead ?? data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Load lead failed', err)
      } finally {
        setIsLoading(false)
      }
    }

    const selectedLeadId = lead?.leadId || lead?.id
    if (lead && selectedLeadId) {
      fetchLeadById(selectedLeadId)
    }
  }, [lead])

  const handleAddLead = async () => {
    if (isSubmitting) return
    if (lead) return

    const trimmedFullName = fullName.trim()
    const trimmedPhone = phone.trim()
    const nextErrors = { fullName: '', phone: '' }

    if (!trimmedFullName) {
      nextErrors.fullName = 'Enter full name.'
    }

    if (!trimmedPhone || !isValidPhone(trimmedPhone)) {
      nextErrors.phone = 'Enter a valid mobile number (10-digit Indian or E.164 format).'
    }

    setErrors(nextErrors)
    if (nextErrors.fullName || nextErrors.phone) return

    setIsSubmitting(true)
    try {
      const loanReq = parseInt(String(loanRequirement).replace(/[^0-9]/g, ''), 10) || 0
      const payload = {
        full_name: trimmedFullName,
        phone: trimmedPhone,
        email: email.trim(),
        business_name: companyName.trim() || email.trim(),
        business_type: businessType.trim(),
        loan_requirement: loanReq,
      }

      const token = await getAuthToken()
      const res = await fetch(LEADS_API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to add lead')
      }

      onBack?.()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Add lead failed', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false)

  useEffect(() => {
    const source = remoteLead ?? lead
    if (source) {
      setFullName(source.applicantName || source.fullName || '')
      setEmail(source.email || '')
      setPhone(source.phone || '')
      setCompanyName(source.businessName || source.business_name || '')
      const loanValue = source.loanRequirement ?? source.loan_requirement
      if (loanValue == null || loanValue === '') {
        setLoanRequirement('₹ 25000000')
      } else if (typeof loanValue === 'number') {
        setLoanRequirement(`₹ ${loanValue.toLocaleString()}`)
      } else {
        setLoanRequirement(String(loanValue))
      }
      setBusinessType(source.businessType || source.business_type || '')
    }
  }, [lead, remoteLead])

  return (
    <div className="relative flex min-h-0 flex-col gap-6">
      {/* Dark gray header bar with Back button */}
      <div className="flex w-full items-center justify-end rounded-xl bg-[#334155] px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Title Header with action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="admin-heading text-lg font-bold text-slate-900">{lead ? 'View Lead' : 'Add Lead'}</h2>
          <p className="admin-subtitle mt-0.5 text-xs text-slate-500 font-medium">
            {lead ? 'Take a look at the details, assign the application, and send out the message!' : 'Fill out the form below to add a new lead.'}
          </p>
          {isLoading ? (
            <p className="mt-2 text-xs text-slate-500">Loading lead details…</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsBroadcastModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors focus:outline-none cursor-pointer"
          >
            {/* Circular Green WhatsApp Icon Bubble */}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shrink-0">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.808 1.452 5.568 0 10.1-4.529 10.103-10.098.002-2.699-1.047-5.236-2.951-7.141-1.905-1.905-4.437-2.954-7.135-2.955-5.572 0-10.105 4.53-10.108 10.1-.001 1.761.464 3.48 1.347 5.02l-.995 3.637 3.736-.98-.01.005zm10.744-7.404c-.292-.146-1.727-.852-1.994-.95-.266-.097-.461-.146-.656.146-.195.292-.756.95-.927 1.146-.171.195-.341.219-.633.073-.292-.147-1.23-.453-2.344-1.447-.866-.772-1.451-1.725-1.621-2.018-.17-.293-.018-.452.129-.597.132-.131.292-.341.439-.512.146-.17.195-.292.292-.487.097-.195.049-.365-.024-.512-.073-.146-.656-1.583-.9-2.17-.236-.57-.478-.49-.656-.499-.17-.008-.365-.01-.56-.01-.196 0-.512.073-.78.365-.268.293-1.024 1.001-1.024 2.441 0 1.439 1.048 2.83 1.194 3.025.147.195 2.062 3.149 4.996 4.413.698.301 1.244.48 1.669.615.702.224 1.34.193 1.844.118.563-.083 1.727-.706 1.972-1.389.244-.682.244-1.267.17-1.388-.073-.122-.268-.195-.56-.341z" />
              </svg>
            </span>
            Broadcast Message
          </button>
        </div>
      </div>

      {/* Card 1: Profile Information */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
          <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Information
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Full Name*</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: '' }))
                }
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
            {errors.fullName ? (
              <p className="text-xs text-rose-600">{errors.fullName}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Phone Number*</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                if (errors.phone) {
                  setErrors((prev) => ({ ...prev, phone: '' }))
                }
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
            {errors.phone ? (
              <p className="text-xs text-rose-600">{errors.phone}</p>
            ) : null}
          </div>
        </div>

        {!lead ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddLead}
              disabled={isSubmitting}
              className="rounded-lg bg-[#334155] hover:bg-[#475569] text-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : null}
      </div>

      {/* Card 2: Business Information */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
          <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Business Information
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter the company name"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Loan Requirement</label>
            <input
              type="text"
              value={loanRequirement}
              onChange={(e) => setLoanRequirement(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Business Type</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="Enter your business type"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        {!lead ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddLead}
              disabled={isSubmitting}
              className="rounded-lg bg-[#334155] hover:bg-[#475569] text-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : null}
      </div>

      {/* Broadcast Confirmation Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px]">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100 text-center">
            {/* Large WhatsApp Circle Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white mx-auto mb-4 shadow-sm">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.808 1.452 5.568 0 10.1-4.529 10.103-10.098.002-2.699-1.047-5.236-2.951-7.141-1.905-1.905-4.437-2.954-7.135-2.955-5.572 0-10.105 4.53-10.108 10.1-.001 1.761.464 3.48 1.347 5.02l-.995 3.637 3.736-.98-.01.005zm10.744-7.404c-.292-.146-1.727-.852-1.994-.95-.266-.097-.461-.146-.656.146-.195.292-.756.95-.927 1.146-.171.195-.341.219-.633.073-.292-.147-1.23-.453-2.344-1.447-.866-.772-1.451-1.725-1.621-2.018-.17-.293-.018-.452.129-.597.132-.131.292-.341.439-.512.146-.17.195-.292.292-.487.097-.195.049-.365-.024-.512-.073-.146-.656-1.583-.9-2.17-.236-.57-.478-.49-.656-.499-.17-.008-.365-.01-.56-.01-.196 0-.512.073-.78.365-.268.293-1.024 1.001-1.024 2.441 0 1.439 1.048 2.83 1.194 3.025.147.195 2.062 3.149 4.996 4.413.698.301 1.244.48 1.669.615.702.224 1.34.193 1.844.118.563-.083 1.727-.706 1.972-1.389.244-.682.244-1.267.17-1.388-.073-.122-.268-.195-.56-.341z" />
              </svg>
            </div>

            <h3 className="text-base font-bold text-slate-900">Broadcast Message</h3>
            <p className="mt-2 text-xs text-slate-500 font-medium px-4">
              Hey, are you sure you want to send that broadcast message?
            </p>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={async () => {
                  // Close modal immediately
                  setIsBroadcastModalOpen(false)
                  try {
                    const token = await getAuthToken()
                    const selectedId = (remoteLead && (remoteLead.leadId || remoteLead.id)) || (lead && (lead.leadId || lead.id))
                    if (!selectedId) {
                      console.error('Lead ID not available')
                      return
                    }

                    const res = await fetch(`${LEADS_API_URL}/${encodeURIComponent(selectedId)}/broadcast`, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: '',
                    })

                    let json = null
                    try {
                      json = await res.json()
                    } catch (e) {
                      // ignore JSON parse errors
                    }

                    if (!res.ok) {
                      const msg = (json && (json.error || json.message)) || res.statusText || 'Broadcast failed'
                      console.error(`Broadcast failed: ${msg}`)
                      return
                    }

                    if (json?.whatsapp && json.whatsapp.ok === false) {
                      console.error(`Broadcast result: ${json.whatsapp.error || 'failed'}`)
                    } else {
                      console.log('Broadcast request sent')
                    }
                  } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('Broadcast failed', err)
                  }
                }}
                className="flex-1 rounded-lg bg-[#334155] hover:bg-[#475569] text-white py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="flex-1 rounded-lg bg-[#334155] hover:bg-[#475569] text-white py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
