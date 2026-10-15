import { useState, useEffect } from 'react'
import AuthHeader from './AuthHeader'
import { AppleIcon, ArrowRightIcon, FacebookIcon, GoogleIcon } from './icons'

function SocialButton({ variant, children }) {
  const styles = {
    google: 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
    facebook: 'border border-facebook bg-facebook text-white hover:bg-[#166fe5]',
    apple: 'border border-black bg-black text-white hover:bg-gray-900',
  }

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-3 rounded-full px-5 py-3.5 text-[15px] font-medium transition-all active:scale-[0.98] ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

export default function LoginForm({ onNext, onRegister, error, onChange }) {
  const [email, setEmail] = useState(() => {
    return sessionStorage.getItem('vrozart_login_email') || ''
  })

  useEffect(() => {
    sessionStorage.setItem('vrozart_login_email', email)
  }, [email])

  const handleNext = (e) => {
    e.preventDefault()
    onNext(email)
  }

  return (
    <div className="flex flex-col px-8 py-10 sm:px-12 sm:py-14 md:px-14 md:py-16">
      <AuthHeader />

      <div className="mt-8 space-y-3">
        <SocialButton variant="google">
          <GoogleIcon />
          Sign in with Google
        </SocialButton>
        <SocialButton variant="facebook">
          <FacebookIcon />
          Sign in with Facebook
        </SocialButton>
        <SocialButton variant="apple">
          <AppleIcon />
          Sign in with Apple
        </SocialButton>
      </div>

      <form onSubmit={handleNext} noValidate className="mt-8">
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="email"
          type="text"
          autoComplete="email tel"
          placeholder="Enter your Phone Number "
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (onChange) onChange()
          }}
          className={`w-full rounded-full border bg-white px-5 py-3.5 text-[15px] text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:ring-2 ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20'
            }`}
        />
        {error && (
          <p className="mt-2 text-xs font-semibold text-red-500 animate-fade-in pl-5">
            {error}
          </p>
        )}


        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 transition-all hover:bg-gray-50 active:scale-95"
          >
            Next
            <ArrowRightIcon />
          </button>
        </div>
      </form>
    </div>
  )
}
