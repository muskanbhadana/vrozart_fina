import { useState } from 'react'
import AuthHeader from './AuthHeader'
import OtpInput from './OtpInput'
import { ArrowRightIcon, ArrowLeftIcon } from './icons'

const OTP_LENGTH = 6

export default function OtpForm({ email, onSignIn, error, onChange, onBack }) {
  const [otp, setOtp] = useState('')

  const handleOtpChange = (val) => {
    setOtp(val)
    if (onChange) onChange()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp.length !== OTP_LENGTH) return
    onSignIn?.(otp)
  }

  return (
    <div className="relative flex flex-col px-8 py-10 sm:px-12 sm:py-14 md:px-14 md:py-16">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 sm:left-6 sm:top-6 p-2 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      )}
      <AuthHeader />

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        <p className="text-center text-sm text-gray-500">
          Enter the secure code we just sent to your email address
        </p>
        <p className="mt-1 text-center text-sm font-semibold text-gray-900">{email}</p>

        <div className="mt-8">
          <OtpInput value={otp} onChange={handleOtpChange} />
        </div>
        {error && (
          <p className="mt-4 text-center text-xs font-semibold text-red-500 animate-fade-in">
            {error}
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={otp.length !== OTP_LENGTH}
            className="inline-flex items-center gap-2 rounded-full bg-[#4A72B2] px-8 py-3 text-[15px] font-medium text-white transition-all hover:bg-[#3d6299] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign In
            <ArrowRightIcon />
          </button>
        </div>
      </form>
    </div>
  )
}
