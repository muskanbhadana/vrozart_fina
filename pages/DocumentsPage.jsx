import { useEffect, useState } from 'react'
import { getAuthToken } from '../config/auth.js'

/* ── Inline icons ── */
function IconArrowLeft({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function IconFolder({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h6l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" className="text-slate-200" />
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconFileText({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function IconCheckCircle({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconAlertCircle({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
  )
}

function IconXCircle({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconEye({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconDownload({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function IconCheckSolid({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function IconXSolid({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function IconExclamationSolid({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4" />
    </svg>
  )
}

/* ── Status badge config ── */
const DOC_STATUS = {
  pending: null,
  verified: {
    label: 'Verified',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70',
  },
  issue_raised: {
    label: 'Issue Raised',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/70',
  },
  missing: {
    label: 'Missing',
    className: 'bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200/70',
  },
}

/* ── Document row component ── */
function DocumentRow({ doc, onActionClick }) {
  const statusConfig = DOC_STATUS[doc.status]
  const showActions = doc.status === 'pending'
  const isMissing = doc.status === 'missing'

  return (
    <div className={`flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-slate-200 hover:shadow-md ${isMissing ? 'opacity-70' : ''}`}>
      {/* Top row: Icon, Info, Eye/Download */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <IconFileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="truncate text-[14px] font-bold text-slate-800">{doc.name}</p>
            {!isMissing && doc.uploadDate ? (
              <p className="mt-0.5 text-[12px] font-medium text-slate-400">
                Uploaded on {doc.uploadDate} &bull; {doc.size}
              </p>
            ) : (
              <p className="mt-0.5 text-[12px] font-medium text-slate-400">
                Not uploaded yet
              </p>
            )}
          </div>
        </div>

        {!isMissing && (
          <div className="flex shrink-0 items-center gap-3 text-slate-400">
            {doc.viewUrl && (
              <a href={doc.viewUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-600">
                <IconEye className="h-4 w-4" />
              </a>
            )}
            {doc.downloadUrl && (
              <a href={doc.downloadUrl} download className="transition-colors hover:text-slate-600">
                <IconDownload className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Status badge (when already actioned) */}
      {!showActions && statusConfig && (
        <div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${statusConfig.className}`}
          >
            {statusConfig.label}
          </span>
        </div>
      )}

      {/* Action buttons (when pending) */}
      {showActions && (
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => onActionClick(doc.id, 'approved')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#15803d]"
          >
            <IconCheckCircle className="h-3.5 w-3.5" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => onActionClick(doc.id, 'issue_raised')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#B33B4D] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#9f3343]"
          >
            <IconAlertCircle className="h-3.5 w-3.5" />
            Raise Issue
          </button>
          <button
            type="button"
            onClick={() => onActionClick(doc.id, 'rejected')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#B33B4D] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#9f3343]"
          >
            <IconXCircle className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Main Component ── */
export default function DocumentsPage({ application, onBack }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [popup, setPopup] = useState({ isOpen: false, type: null, docId: null })

  useEffect(() => {
    let cancelled = false
    async function fetchDocuments() {
      try {
        const token = await getAuthToken()
        const appId = application?.id || application?.applicationId
        if (!appId) {
          if (!cancelled) setLoading(false)
          return
        }

        const res = await fetch(`http://168.144.70.172:8000/api/credit-analyst/applications/${encodeURIComponent(appId)}/documents`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error('Failed to fetch documents')
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
    fetchDocuments()
    return () => { cancelled = true }
  }, [application])

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading documents...</div>
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-red-500 mb-4">Failed to load documents.</p>
        <button onClick={onBack} className="text-blue-500 underline text-sm">Go Back</button>
      </div>
    )
  }

  const businessName = data.businessName || application?.businessName || 'Business'
  const loanType = data.loanType || 'Business Loan'
  const summary = data.summary || {}
  const overallStatus = data.overallStatus || 'Document Pending'

  // Map API documents to local UI model
  const documents = (data.documents || []).map((d) => {
    let status = 'missing'
    if (d.fileId) {
      if (d.reviewStatus === 'PENDING') status = 'pending'
      else if (d.reviewStatus === 'APPROVED') status = 'approved'
      else if (d.reviewStatus === 'REJECTED') status = 'rejected'
      else if (d.reviewStatus === 'ISSUE_RAISED') status = 'issue_raised'
      else status = 'verified'
    }

    return {
      id: d.fileId || d.docKind || Math.random().toString(),
      name: d.name,
      uploadDate: d.uploadedOn,
      size: d.sizeFormatted,
      status: status,
      viewUrl: d.viewUrl,
      downloadUrl: d.downloadUrl
    }
  })

  // We recalculate these locally so if the user clicks "Approve" (locally for now), the UI updates.
  const verifiedCount = summary.verifiedCount || 0
  const totalCount = summary.totalCount || documents.length
  const pendingCount = summary.pendingCount || 0
  const hasPending = pendingCount > 0

  const openPopup = (docId, type) => {
    setPopup({ isOpen: true, type, docId })
  }

  const closePopup = () => {
    setPopup({ isOpen: false, type: null, docId: null })
  }

  const confirmAction = async () => {
    // Note: Here you would typically make an API call to update the reviewStatus of the document
    // For now, we simply close the popup to mirror the original functionality visually.
    // E.g. await fetch(`/api/credit-analyst/applications/.../documents/${popup.docId}/review`, { ... })
    closePopup()
  }

  return (
    <>
      <div className="flex min-h-0 flex-col gap-6 animate-fade-in">
        {/* ── Dark banner ── */}
        <div className="flex h-16 items-center justify-end rounded-2xl bg-[#404040] px-4 shadow-sm">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>

        {/* ── Documents heading ── */}
        <div>
          <h2 className="text-[17px] font-bold text-slate-800">Documents</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">User Document Upload</p>
        </div>

        {/* ── Business info card ── */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-sm">
          <div>
            <p className="text-[15px] font-bold text-slate-800">{businessName}</p>
            <p className="mt-0.5 text-[13px] font-medium text-slate-400">{loanType}</p>
          </div>
          {overallStatus === 'Document Pending' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B33B4D] bg-[#FFF5F5] px-4 py-1.5 text-[12px] font-bold text-[#B33B4D]">
              <IconCheckCircle className="h-3.5 w-3.5" />
              Document Pending
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-[12px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-200/70">
              <IconCheckCircle className="h-3.5 w-3.5" />
              {overallStatus}
            </span>
          )}
        </div>

        {/* ── Document Completion ── */}
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-sm">
          <h3 className="text-[14px] font-bold text-slate-800">Document Completion</h3>
          <p className="mt-0.5 text-[12px] font-medium text-slate-400">
            {summary.label || `${verifiedCount} of ${totalCount} documents verified`}
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-[5px] overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-black transition-[width] duration-500 ease-out"
              style={{ width: `${summary.percentVerified || ((verifiedCount / totalCount) * 100)}%` }}
            />
          </div>

          {hasPending && (
            <p className="mt-3 text-[12px] font-medium text-slate-500">
              {summary.pendingLabel || `${pendingCount} documents pending verification`}
            </p>
          )}
        </div>

        {/* ── Document list ── */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onActionClick={openPopup} />
          ))}
        </div>
      </div>

      {/* ── Action Modal ── */}
      {popup.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl animate-scale-in">
            {/* Modal Icon */}
            <div className="mb-4 flex justify-center">
              {popup.type === 'approved' && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A] text-white">
                  <IconCheckSolid className="h-7 w-7" />
                </div>
              )}
              {popup.type === 'rejected' && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B33B4D] text-white">
                  <IconXSolid className="h-7 w-7" />
                </div>
              )}
              {popup.type === 'issue_raised' && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B33B4D] text-white">
                  <IconExclamationSolid className="h-7 w-7" />
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="text-center">
              <h3 className="text-[18px] font-bold text-slate-900">
                {popup.type === 'approved' && 'Approve Document'}
                {popup.type === 'rejected' && 'Reject Document'}
                {popup.type === 'issue_raised' && 'Raise Issue'}
              </h3>
              
              <p className="mx-auto mt-2 text-[13px] font-medium text-slate-500 leading-relaxed max-w-[280px]">
                {popup.type === 'approved' && 'Are you sure you want to approve this document?'}
                {popup.type === 'rejected' && 'Are you sure you want to reject this document? This action cannot be undone.'}
                {popup.type === 'issue_raised' && 'Just jot down the problem in the document.'}
              </p>
            </div>

            {/* Textarea for Raise Issue */}
            {popup.type === 'issue_raised' && (
               <div className="mt-5">
                 <textarea
                   className="w-full rounded-xl border-none bg-slate-100 p-4 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#B33B4D]/20 resize-none h-24"
                   placeholder="What's the issue? Let us know!..."
                 />
               </div>
            )}

            {/* Modal Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closePopup}
                className="flex-1 rounded-xl bg-[#404040] py-3 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#2e2e2e]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction}
                className={`flex-1 rounded-xl py-3 text-[13px] font-bold text-white shadow-sm transition-colors ${
                  popup.type === 'approved' ? 'bg-[#16A34A] hover:bg-[#15803d]' : 'bg-[#B33B4D] hover:bg-[#9f3343]'
                }`}
              >
                {popup.type === 'approved' && 'Approve'}
                {popup.type === 'rejected' && 'Reject'}
                {popup.type === 'issue_raised' && 'Raise Issue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

