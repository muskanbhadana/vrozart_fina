import { useEffect, useMemo, useState } from 'react'
import { getAuthToken } from '../config/auth.js'

// Stepper items configuration
const STEPS = [
  { key: 'application_started', label: 'Application Started' },
  { key: 'kyc_documents_verified', label: 'KYC & Documents Verified' },
  { key: 'bank_selection', label: 'Bank Selection' },
  { key: 'file_under_bank_review', label: 'File Under Bank Review' },
  { key: 'loan_approved', label: 'Loan Approved' },
  { key: 'loan_processing', label: 'Loan Processing' },
]

function getJourneyConfig(status) {
  switch (status) {
    case 'kyc':
      return {
        stageName: 'KYC & Documents Verified',
        completedCount: 1,
        percent: 16,
      }
    case 'financial_upload':
      return {
        stageName: 'Bank Selection',
        completedCount: 2,
        percent: 33,
      }
    case 'under_review':
      return {
        stageName: 'File Under Bank Review',
        completedCount: 3,
        percent: 50,
      }
    case 'approved':
      return {
        stageName: 'Loan Approved',
        completedCount: 5,
        percent: 83,
      }
    case 'rejected':
      return {
        stageName: 'Application Rejected',
        completedCount: 3,
        percent: 50,
      }
    default:
      return {
        stageName: 'Application Started',
        completedCount: 1,
        percent: 16,
      }
  }
}

function getAssigneeName(val) {
  if (!val) return ''
  if (typeof val === 'object') {
    return val.name || val.employeeId || ''
  }
  return String(val)
}

export default function ApplicationDetailsPage({ application, onBack, onViewVault, onAssignApplication, onReviewChat }) {
  const [details, setDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const applicationId = application?.id ?? application?.applicationId
    if (!applicationId) return

    async function loadDetails() {
      setIsLoading(true)
      setFetchError(null)
      try {
        const token = await getAuthToken()
        const response = await fetch(
          `http://168.144.70.172:8000/api/admin/applications/${encodeURIComponent(applicationId)}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!response.ok) {
          throw new Error('Failed to load application details')
        }
        const data = await response.json()
        if (cancelled) return

        const item = data.application ?? data
        setDetails({
          id: item.applicationId ?? item.id ?? item._id ?? item.application_id ?? applicationId,
          applicantName: item.applicantName ?? item.fullName ?? item.name ?? item.customerName ?? '',
          phone: item.phone ?? item.contactNumber ?? item.mobile ?? '',
          email: item.email ?? item.contactEmail ?? '',
          businessName: item.businessName ?? item.companyName ?? item.business_name ?? '',
          status: (item.status ?? item.stageKey ?? item.stage ?? 'application_started').toLowerCase(),
          date: item.createdAt ?? item.updatedAt ?? item.date ?? '',
          assignedTo: getAssigneeName(item.assignedTo ?? item.assignTo ?? item.assignee ?? item.assigneeName ?? item.assigned_to),
          stage: item.stage ?? item.currentStage ?? item.stageKey ?? '',
          businessDescription: item.businessDescription ?? '',
        })
      } catch (error) {
        if (!cancelled) {
          setFetchError(error.message)
          console.error('Failed to fetch application detail:', error)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadDetails()
    return () => {
      cancelled = true
    }
  }, [application])

  // Graceful fallback for layout
  const app = useMemo(() => {
    return (
      details ?? application ?? {
        id: 'VZF-29382',
        applicantName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@example.com',
        businessName: 'Godrej Traders Pvt Ltd',
        status: 'under_review',
        date: '5 h',
      }
    )
  }, [details, application])

  const journey = useMemo(
    () => getJourneyConfig(app.stage ?? app.stageKey ?? app.status),
    [app.stage, app.stageKey, app.status]
  )

  // Stepper calculations
  const totalSteps = STEPS.length
  const completedCount = journey.completedCount
  const percent = journey.percent

  // Track metrics for the timeline line indicator
  const trackStart = (0.5 / totalSteps) * 100
  const trackSpan = ((totalSteps - 1) / totalSteps) * 100
  const progressWidth = (trackSpan * percent) / 100

  // Format date display
  const dateDisplay = useMemo(() => {
    if (app.date.includes('May') || app.date.includes('2026')) {
      return app.date
    }
    // relative formats like '5 h', '1 d' -> humanized date timestamp
    const daysOffset = parseInt(app.date) || 0
    const baseDate = new Date(2026, 4, 20, 16, 0) // May 20, 2026 4:00 PM
    if (daysOffset > 0 && app.date.includes('d')) {
      baseDate.setDate(baseDate.getDate() - daysOffset)
    }
    return baseDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }) + ` at ` + baseDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }, [app.date])

  return (
    <div className="flex min-h-0 flex-col gap-6">
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

      {/* Title Header with action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="admin-heading text-xl font-bold text-slate-900">Applications Details</h2>
          <p className="admin-subtitle mt-0.5 text-xs text-slate-500 font-medium">
            Application ID: {app.id}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onAssignApplication}
            className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#475569] focus:outline-none"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7a4 4 0 118 0 4 4 0 01-8 0zm-3 13a7 7 0 0114 0M19 8v6m3-3h-6"
              />
            </svg>
            Assign Application
          </button>
          <button
            type="button"
            onClick={onViewVault}
            className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#475569] focus:outline-none"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            VaultX
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#2563EB] focus:outline-none"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download NoName.Pdf
          </button>
        </div>
      </div>

      {/* Applicant Information Section */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Applicant Information</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Applicant Name</span>
            <span className="text-sm font-semibold text-slate-800">{app.applicantName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Phone Number</span>
            <span className="text-sm font-semibold text-slate-800 tabular-nums">{app.phone}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Email</span>
            <span className="text-sm font-semibold text-slate-800">{app.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Business Name</span>
            <span className="text-sm font-semibold text-slate-800">{app.businessName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Assigned To</span>
            <span className="text-sm font-semibold text-slate-800">{getAssigneeName(app.assignedTo || app.assignTo) || '-'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Date</span>
            <span className="text-sm font-semibold text-slate-800">{dateDisplay}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Current Stage</span>
            <span className="text-sm font-semibold text-slate-800">{journey.stageName}</span>
          </div>
        </div>
      </div>

      {/* Loan Journey Progress Section */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-slate-900">Loan Journey Progress</h3>
            <span className="text-xs font-semibold text-[#4A72B2]">{percent}% completed</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-[#4A72B2]">{completedCount}/6</span>
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
            {STEPS.map((step, index) => {
              const isCompleted = index < completedCount
              const isActive = index === completedCount

              return (
                <div
                  key={step.key}
                  className="relative z-10 flex flex-col items-center"
                  style={{ width: `${100 / totalSteps}%` }}
                >
                  {isCompleted ? (
                    /* Completed step circle */
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A72B2] text-white shadow-sm">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : isActive ? (
                    /* Active step circle */
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4A72B2] bg-white shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-[#4A72B2]" aria-hidden="true" />
                    </div>
                  ) : (
                    /* Pending step circle */
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-200 bg-white" />
                  )}

                  <p className="mt-3.5 max-w-[110px] text-center text-[11px] font-semibold leading-normal text-slate-600">
                    {step.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Button at bottom */}
        <button
          type="button"
          onClick={onReviewChat}
          className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/60 py-3.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          Review Chat
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
