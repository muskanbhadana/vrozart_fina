import { useState } from 'react'
import { publicImages } from '../assets/images.js'
import { login } from '../config/auth.js'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [apiError, setApiError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    // Reset errors
    setEmailError(null)
    setPasswordError(null)
    setApiError(null)

    let hasError = false

    if (!trimmedEmail) {
      setEmailError('Please enter your email or phone number')
      hasError = true
    }
    if (!trimmedPassword) {
      setPasswordError('Please enter your password')
      hasError = true
    }

    if (hasError) return

    setIsLoading(true)

    try {
      await login(trimmedEmail, trimmedPassword)
      onLogin() // Notify parent component (AdminApp)
    } catch (err) {
      setApiError(err.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8eaef] p-4 sm:p-6 md:p-10 font-sans">
      <div className="grid w-full max-w-[1100px] overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl md:grid-cols-2">

        {/* Left Side - Login Form (matches AuthShell children wrapper) */}
        <div className="bg-[#f8f9fb]">
          <div className="flex flex-col px-8 py-10 sm:px-12 sm:py-14 md:px-14 md:py-16">

            {/* Header matches AuthHeader exactly */}
            <div className="flex justify-center">
              <img src={publicImages.logo} alt="VROZART FINANCE" className="h-7 w-auto object-contain" />
            </div>

            <h1 className="mt-10 text-center text-[26px] font-bold leading-snug tracking-tight text-[#1a1a1a] sm:text-[28px]">
              Finance built around<br />relationships, not paperwork.
            </h1>

            <div className="mt-8 text-center">
              <h2 className="text-xl font-bold text-gray-800">Log In</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">to Admin Panel</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email or Phone number</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError(null)
                    setApiError(null)
                  }}
                  placeholder="Enter your email or phone number"
                  className="w-full rounded-full border border-gray-200 bg-white px-5 py-3.5 text-[15px] text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                {emailError && (
                  <p className="mt-2 text-xs font-semibold text-red-500 pl-5">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError(null)
                      setApiError(null)
                    }}
                    placeholder="Enter password"
                    className="w-full rounded-full border border-gray-200 bg-white px-5 py-3.5 pr-12 text-[15px] text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {(passwordError || apiError) && (
                  <p className="mt-2 text-xs font-semibold text-red-500 pl-5">
                    {passwordError || apiError}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot Password?
                </button>
              </div>

              <div className="mt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-70"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                  {!isLoading && (
                    <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - HeroPanel matches frontend exactly */}
        <div className="relative flex min-h-[320px] flex-col overflow-hidden rounded-b-3xl bg-gradient-to-br from-[#e8d5f5] via-[#e3eef9] to-[#b8d9f5] md:min-h-full md:rounded-b-none md:rounded-r-3xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />

          <img
            src={publicImages.composition}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="relative z-10 mt-auto flex flex-1 flex-col justify-end p-8 md:p-10">
            <p className="max-w-[340px] text-[15px] font-medium leading-relaxed text-[#3d3d3d]">
              Seamlessly access smarter business financing, secure document management, and AI-powered
              financial guidance — all in one unified platform.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-6 rounded-full bg-blue-500/80 transition-all"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white transition-all hover:bg-blue-500/50"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white transition-all hover:bg-blue-500/50"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
