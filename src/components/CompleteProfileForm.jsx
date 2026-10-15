import { useState, useEffect } from 'react'
import AuthHeader from './AuthHeader'
import GhostButton from './GhostButton'
import InputField from './InputField'
import { ArrowLeftIcon } from './icons'

export default function CompleteProfileForm({ phone, onComplete, onBack, error, onChange }) {
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vrozart_complete_profile')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return { fullName: '', email: '' }
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    sessionStorage.setItem('vrozart_complete_profile', JSON.stringify(form))
  }, [form])

  const updateField = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    setErrors((p) => ({ ...p, [field]: '' }))
    if (onChange) onChange()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let isValid = true
    const newErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.'
      isValid = false
    }

    if (!form.email.trim()) {
      newErrors.email = 'Please enter a valid email address.'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address."
      isValid = false
    }

    setErrors(newErrors)
    if (!isValid) return

    onComplete?.({ fullName: form.fullName.trim(), email: form.email.trim() })
  }

  const isValid = form.fullName.trim().length > 0 && form.email.trim().length > 0

  return (
    <div className="relative flex flex-col px-8 py-10 sm:px-12 sm:py-14 md:px-14 md:py-16">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 p-2 text-gray-400 transition-colors hover:text-gray-600 sm:left-6 sm:top-6"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      )}
      <AuthHeader subtitle="Complete your profile" />

      <p className="mt-4 text-center text-sm text-gray-500">Phone: {phone}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <InputField
          id="fullName"
          label="Full name"
          placeholder="Enter full name"
          value={form.fullName}
          onChange={updateField('fullName')}
          error={errors.fullName}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={updateField('email')}
          error={errors.email || error}
        />

        <div className="pt-2">
          <GhostButton type="submit" disabled={!isValid}>
            Continue
          </GhostButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button type="button" onClick={onBack} className="font-medium text-brand-blue hover:underline">
          Sign in
        </button>
      </p>
    </div>
  )
}
