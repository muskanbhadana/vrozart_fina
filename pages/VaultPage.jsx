import { useEffect, useMemo, useState } from 'react'
import { getAuthToken } from '../config/auth.js'

export default function VaultPage({ application, onBack }) {
  const [documents, setDocuments] = useState([])
  const [summary, setSummary] = useState(null)
  const [apiMeta, setApiMeta] = useState({ businessName: '', loanType: '', overallStatus: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const app = useMemo(() => {
    return (
      application ?? {
        id: '',
        applicantName: '',
        businessName: '',
        status: '',
      }
    )
  }, [application])

  const applicationId = app.id ?? app.applicationId ?? ''

  useEffect(() => {
    if (!applicationId) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function fetchDocuments() {
      setIsLoading(true)
      setFetchError(null)
      try {
        const token = await getAuthToken()
        const response = await fetch(
          `http://168.144.70.172:8000/api/admin/applications/${encodeURIComponent(applicationId)}/documents`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!response.ok) {
          throw new Error('Failed to load documents')
        }
        const data = await response.json()
        if (cancelled) return

        setDocuments(data.documents ?? [])
        setSummary(data.summary ?? null)
        setApiMeta({
          businessName: data.businessName ?? app.businessName ?? '',
          loanType: data.loanType ?? 'Business Loan',
          overallStatus: data.overallStatus ?? '',
        })
      } catch (error) {
        if (!cancelled) {
          setFetchError(error.message)
          console.error('Failed to fetch documents:', error)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchDocuments()
    return () => {
      cancelled = true
    }
  }, [applicationId, app.businessName])

  // Progress metrics from summary or computed from documents
  const totalDocs = summary?.totalCount ?? documents.length
  const verifiedDocs = summary?.verifiedCount ?? documents.filter((d) => d.verificationStatus === 'Verified').length
  const progressPercent = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0
  const progressLabel = summary?.label ?? `${verifiedDocs} of ${totalDocs} documents verified`
  const pendingLabel = summary?.pendingLabel ?? `${totalDocs - verifiedDocs} documents pending verification`

  // Determine the overall status badge style
  const overallStatus = apiMeta.overallStatus.toLowerCase()
  const isAllVerified = verifiedDocs === totalDocs && totalDocs > 0
  const statusBadge = isAllVerified
    ? { bg: 'bg-[#E6F4EA]', text: 'text-[#137333]', border: 'border-[#A8DAB5]/60', dot: 'bg-[#137333]', label: 'All Verified' }
    : { bg: 'bg-[#FFF5F5]', text: 'text-[#C94A49]', border: 'border-red-200/80', dot: 'bg-[#C94A49]', label: apiMeta.overallStatus || 'Document Pending' }

  function getStatusConfig(verificationStatus) {
    const s = (verificationStatus ?? '').toLowerCase()
    if (s === 'verified') {
      return {
        key: 'verified',
        label: 'Verified',
        pillClass: 'bg-[#E6F4EA] text-[#137333] border-[#A8DAB5]/60',
        icon: (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ),
      }
    }
    if (s === 'missing') {
      return {
        key: 'missing',
        label: 'Missing',
        pillClass: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]/60',
        icon: (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      }
    }
    // Default: Verification Pending
    return {
      key: 'pending',
      label: 'Verification Pending',
      pillClass: 'bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]/60',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
  }

  function handleViewDocument(doc) {
    if (doc.viewUrl) {
      window.open(doc.viewUrl, '_blank', 'noopener,noreferrer')
    }
  }

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

      {/* Main heading */}
      <div>
        <h2 className="admin-heading text-xl font-bold text-slate-900">Documents</h2>
        <p className="admin-subtitle mt-0.5 text-xs text-slate-500 font-medium">
          User Document Upload
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-12 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading documents…</p>
        </div>
      )}

      {/* Error State */}
      {fetchError && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 p-8 shadow-sm">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2 text-sm font-semibold text-red-700">{fetchError}</p>
          <p className="mt-1 text-xs text-red-500">Please try again or check the application ID.</p>
        </div>
      )}

      {/* Content — only show after loading */}
      {!isLoading && !fetchError && (
        <>
          {/* Business Info Header Card */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {apiMeta.businessName || app.businessName || '—'}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{apiMeta.loanType}</p>
            </div>

            <div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border ${statusBadge.border} ${statusBadge.bg} px-3.5 py-1 text-xs font-semibold ${statusBadge.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                {statusBadge.label}
              </span>
            </div>
          </div>

          {/* Document Completion Progress Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Document Completion</h4>
              <span className="text-xs font-semibold text-slate-500">
                {progressLabel}
              </span>
            </div>

            {/* Progress bar track */}
            <div className="mt-3.5 h-2.5 w-full rounded-full bg-slate-100">
              <div
                className="h-2.5 rounded-full bg-[#0F172A] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-3.5 text-xs font-semibold text-slate-400">
              {pendingLabel}
            </p>
          </div>

          {/* Stack list of Document Cards */}
          {documents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-10 shadow-sm">
              <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm font-medium text-slate-400">No documents found for this application.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {documents.map((doc, index) => {
              const statusCfg = getStatusConfig(doc.verificationStatus)
              const isMissing = statusCfg.key === 'missing'
              const docKey = doc.fileId ?? `missing-${doc.docKind ?? index}`

              // Build the metadata line
              const metaParts = []
              if (doc.uploadedOnLabel) {
                metaParts.push(doc.uploadedOnLabel)
              } else if (doc.uploadedOn) {
                metaParts.push(`Uploaded on ${doc.uploadedOn}`)
              }
              if (doc.sizeFormatted) {
                metaParts.push(doc.sizeFormatted)
              }
              const metaText = metaParts.length > 0 ? metaParts.join(' • ') : null

              return (
                <div
                  key={docKey}
                  className={`flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
                    isMissing
                      ? 'border-red-100 bg-red-50/30 hover:border-red-200/70'
                      : 'border-slate-100 hover:border-slate-200/70'
                  }`}
                >
                  {/* Left side: Icon & Text Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                        isMissing
                          ? 'bg-red-50 border-red-100 text-red-400'
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      {isMissing ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="truncate text-sm font-bold text-slate-800 leading-tight">
                        {doc.name}
                      </h5>
                      {metaText ? (
                        <p className="truncate text-xs font-semibold text-slate-400 mt-1">
                          {metaText}
                        </p>
                      ) : isMissing ? (
                        <p className="truncate text-xs font-semibold text-red-400 mt-1">
                          Not uploaded yet
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Right side: Status and View actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold border ${statusCfg.pillClass}`}
                    >
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>

                    {/* View details eye button — disabled for missing docs */}
                    <button
                      type="button"
                      onClick={() => handleViewDocument(doc)}
                      disabled={isMissing || !doc.viewUrl}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors focus:outline-none ${
                        isMissing || !doc.viewUrl
                          ? 'border-slate-100 bg-slate-50/30 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 bg-slate-50/50 text-slate-400 hover:bg-white hover:text-slate-600'
                      }`}
                      aria-label={`View ${doc.name}`}
                      title={isMissing ? 'Document not uploaded' : 'View Document'}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
