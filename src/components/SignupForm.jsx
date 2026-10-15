import { useState, useEffect } from 'react'
import AuthHeader from './AuthHeader'
import GhostButton from './GhostButton'
import InputField from './InputField'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
}

export default function SignupForm({ onNext, onBack, error, onChange }) {
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vrozart_signup_form')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return INITIAL_FORM
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    sessionStorage.setItem('vrozart_signup_form', JSON.stringify(form))
  }, [form])

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    if (onChange) onChange()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let isValid = true
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Please enter your name.'
      isValid = false
    }

    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email.'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email.'
      isValid = false
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.'
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) return
    onNext?.({ ...form, email: form.email.trim() })
  }

  const isValid =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.phone.trim().length > 0

  return (
    <div className="flex flex-col px-8 py-10 sm:px-12 sm:py-14 md:px-14 md:py-16">
      <AuthHeader
        subtitle="Sign up to begin your loan journey in minutes."
        subtitleClassName="mt-6 text-center text-base font-normal text-gray-600"
      />

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <InputField
          id="name"
          label="Name"
          placeholder="Enter name"
          autoComplete="name"
          value={form.name}
          onChange={updateField('name')}
          error={errors.name}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="sarah.lopez@company.ai"
          autoComplete="email"
          value={form.email}
          onChange={updateField('email')}
          error={errors.email}
        />
        <InputField
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="Enter phone number"
          autoComplete="tel"
          value={form.phone}
          onChange={updateField('phone')}
          error={errors.phone || error}
        />

        <div className="pt-2">
          <GhostButton type="submit" disabled={!isValid}>
            Get Started
          </GhostButton>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onBack}
          className="font-medium text-brand-blue transition-colors hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
