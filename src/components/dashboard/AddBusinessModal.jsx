import { useState } from 'react'

export default function AddBusinessModal({ onClose, onContinue }) {
  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    let isValid = true
    const newErrors = {}

    if (!businessName.trim()) {
      newErrors.businessName = 'Please enter your business name.'
      isValid = false
    }

    if (!businessDescription.trim()) {
      newErrors.businessDescription = 'Please fill out this field.'
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) return
    onContinue?.(businessName.trim(), businessDescription.trim())
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-business-title"
    >
      <div className="relative w-full max-w-[620px] rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6] text-white">
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 id="add-business-title" className="text-base font-bold text-slate-900">Add New Business</h3>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">Enter your business details to get started</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 flex gap-3 rounded-xl bg-blue-50/50 p-4 border border-blue-100/50">
          <div className="text-blue-500 shrink-0 mt-0.5">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="6" r="2" fill="currentColor" />
              <circle cx="6" cy="18" r="2" fill="currentColor" />
              <circle cx="18" cy="18" r="2" fill="currentColor" />
              <line x1="12" y1="8" x2="6.8" y2="16" stroke="currentColor" />
              <line x1="12" y1="8" x2="17.2" y2="16" stroke="currentColor" />
              <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-800">Business Information</h4>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500">
              Provide accurate information about your business. This will help us understand your financing needs and tailor our services accordingly.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Business Name *</label>
            <input
              type="text"
              placeholder="e.g., Acme Trading Pvt Ltd"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value)
                setErrors((p) => ({ ...p, businessName: '' }))
              }}
              className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.businessName
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-slate-300 focus:ring-slate-100'
              }`}
            />
            {errors.businessName && (
              <p className="text-xs font-semibold text-red-500 animate-fade-in pl-1">
                {errors.businessName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Business Description *</label>
            <textarea
              rows={4}
              maxLength={500}
              placeholder="Describe your business operations, industry, and what makes it unique..."
              value={businessDescription}
              onChange={(e) => {
                setBusinessDescription(e.target.value)
                setErrors((p) => ({ ...p, businessDescription: '' }))
              }}
              className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-none ${
                errors.businessDescription
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-slate-300 focus:ring-slate-100'
              }`}
            />
            <div className="flex items-start justify-between px-1">
              <div className="flex-1">
                {errors.businessDescription && (
                  <p className="text-xs font-semibold text-red-500 animate-fade-in">
                    {errors.businessDescription}
                  </p>
                )}
              </div>
              <span
                className={`shrink-0 text-[11px] font-medium transition-colors ${
                  businessDescription.length >= 450 ? 'text-amber-500' : 'text-slate-400'
                }`}
              >
                Words: {businessDescription.trim() ? businessDescription.trim().split(/\s+/).length : 0} | Characters: {businessDescription.length} / 500
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#334155] hover:bg-[#475569] text-white py-2.5 text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6m0-6l6 6" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#4A72B2] hover:bg-[#3d6299] text-white py-2.5 text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}