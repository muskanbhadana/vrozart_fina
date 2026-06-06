import { useEffect, useState } from 'react'
import { getAuthToken } from '../config/auth.js'

function IconVaultX({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-3m0 0a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}

function IconCheckSmall({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function IconEdit({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function IconShare({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}

function IconChevronRightSmall({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}



/* ── Info Field component ── */
function InfoField({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[12px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 truncate text-[14px] font-semibold text-slate-800">{value}</p>
    </div>
  )
}


/* ── Main Component ── */
export default function ApplicationDetailsPage({ application, onBack, onViewDocuments }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchDetails() {
      try {
        const token = await getAuthToken()
        const appId = application?.id || application?.applicationId
        if (!appId) {
          if (!cancelled) setLoading(false)
          return
        }

        const res = await fetch(`http://168.144.70.172:8000/api/credit-analyst/applications/${encodeURIComponent(appId)}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Failed to fetch details')
        
        const json = await res.json()
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setLoading(false)
      }
    }

    fetchDetails()
    return () => { cancelled = true }
  }, [application])

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading details...</div>
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-red-500 mb-4">Failed to load application details.</p>
        <button onClick={onBack} className="text-blue-500 underline text-sm">Go Back</button>
      </div>
    )
  }

  const appData = data.application || {}
  const loanJourney = data.loanJourney || {}

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  }

  const app = {
    id: appData.applicationId || appData.id || '',
    applicantName: appData.applicantName || '',
    phone: appData.phone || '',
    email: appData.email || '',
    businessName: appData.businessName || '',
    date: formatDate(appData.createdAt),
    currentStage: loanJourney.currentStep?.label || appData.currentStage || '',
  }

  const progressPercent = loanJourney.percentCompleted || 0
  const journeySteps = (loanJourney.steps || []).map((s) => ({
    id: s.step || s.key,
    label: s.label,
    completed: s.completed,
    active: s.inProgress
  }))

  const totalSteps = journeySteps.length || 6
  const completedCount = journeySteps.filter(s => s.completed).length
  const trackStart = (0.5 / totalSteps) * 100
  const trackSpan = ((totalSteps - 1) / totalSteps) * 100
  const progressWidth = (trackSpan * progressPercent) / 100

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Header Bar with Back Button */}
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

      {/* ── Application details header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="credit-heading text-[18px]">Applications Details</h2>
          <p className="credit-subtitle mt-0.5 text-sm">Application ID: {app.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onViewDocuments}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3f3f46] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#27272a]"
          >
            <IconVaultX className="h-4 w-4 opacity-90" />
            VaultX
          </button>
        </div>
      </div>

      {/* ── Applicant Information ── */}
      <div>
        <h3 className="credit-heading mb-4 text-[15px]">Applicant Information</h3>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            <InfoField label="Applicant Name" value={app.applicantName} />
            <InfoField label="Phone Number" value={app.phone} />
            <InfoField label="Email" value={app.email} />
            <InfoField label="Business Name" value={app.businessName} />
            <InfoField label="Date" value={app.date} />
            <InfoField label="Current Stage" value={app.currentStage} />
          </div>
        </div>
      </div>

      {/* ── Loan Journey Progress ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="credit-heading text-[15px]">Loan Journey Progress</h3>
            <p className="credit-subtitle mt-0.5 text-sm">{progressPercent}% completion</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            >
              <IconEdit className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-[12px] font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-100"
            >
              <IconShare className="h-3.5 w-3.5" />
              Share Drive
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-bold text-slate-900">Loan Journey Progress</h3>
              <span className="text-xs font-semibold text-[#4A72B2]">{progressPercent}% completed</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-[#4A72B2]">{completedCount}/{totalSteps}</span>
              <span className="text-[11px] font-medium text-gray-400">Steps Done</span>
            </div>
          </div>

          {/* Horizontal Stepper Timeline */}
          <div className="mt-8 overflow-x-auto pb-4 pt-2">
            <div className="relative flex min-w-[700px] justify-between px-2">
              {/* Background progress bars */}
              <div
                className="absolute top-[18px] h-[2px] bg-[#e5e7eb]"
                style={{ left: `${trackStart}%`, width: `${trackSpan}%` }}
              />
              <div
                className="absolute top-[18px] h-[2px] bg-[#4A72B2] transition-all duration-500"
                style={{ left: `${trackStart}%`, width: `${progressWidth}%` }}
              />

              {/* Stepper Node Points */}
              {journeySteps.map((step, index) => {
                const isCompleted = step.completed
                const isActive = step.active

                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center"
                    style={{ width: `${100 / totalSteps}%` }}
                  >
                    {isCompleted ? (
                      /* Completed step circle */
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A72B2] text-white shadow-sm">
                        <img src="/images/Icon.svg" alt="" className="h-5 w-5" aria-hidden="true" />
                      </div>
                    ) : isActive ? (
                      /* Active step circle */
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4A72B2] bg-white shadow-sm">
                        <div className="h-3 w-3 rounded-full bg-[#4A72B2]" aria-hidden="true" />
                      </div>
                    ) : (
                      /* Incomplete step circle */
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-slate-200" aria-hidden="true" />
                      </div>
                    )}

                    <p
                      className={`mt-3 text-center text-[11px] font-semibold leading-tight ${
                        isCompleted || isActive ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Review Chat link */}
        <div className="mt-5 flex justify-start">
          <button
            type="button"
            onClick={onViewDocuments}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Review Chat
            <IconChevronRightSmall className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
