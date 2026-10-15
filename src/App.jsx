import { useState } from 'react'
import AuthShell from './components/AuthShell'
import ChatPage from './components/chat/ChatPage'
import DashboardPage from './components/dashboard/DashboardPage'
import PaymentPage from './components/dashboard/PaymentPage'
import SelectBanksPage from './components/dashboard/SelectBanksPage'
import LoginForm from './components/LoginForm'
import OtpForm from './components/OtpForm'
import SignupForm from './components/SignupForm'
import CompleteProfileForm from './components/CompleteProfileForm'
import AddBusinessModal from './components/dashboard/AddBusinessModal'
import { LoanJourneyProvider } from './context/LoanJourneyContext'
import { DASHBOARD_VARIANT, useAppFlow } from './hooks/useAppFlow'
import {
  sendOtpAuto,
  requestSignupVerifyOtp,
  requestSigninVerifyOtp,
  requestSignupComplete,
  extractProfileName,
} from './services/authService'
import { createApplicationAndStartChat } from './services/applicationService'
import { getToken } from './services/token'
import { CHAT_STORAGE_KEY } from './utils/chatSession'
import { CHAT_PROGRESS_STORAGE_KEY } from './utils/chatProgress'

function clearStoredChatSession() {
  sessionStorage.removeItem(CHAT_STORAGE_KEY)
  sessionStorage.removeItem(CHAT_PROGRESS_STORAGE_KEY)
}

export default function App() {
  const {
    email,
    signupData,
    signupPendingToken,
    dashboardVariant,
    selectedBankIds,
    isChat,
    isDashboard,
    isSelectBanks,
    isPayment,
    isOtp,
    isSignup,
    isCompleteProfile,
    goToOtp,
    goToCompleteProfile,
    setUserName,
    goToChat,
    goToDashboard,
    goToSelectBanks,
    goToPayment,
    goToSignup,
    goToLogin,
    exitToLogin,
  } = useAppFlow()

  const [errorMessage, setErrorMessage] = useState(null)
  const [showInitialAddBusiness, setShowInitialAddBusiness] = useState(false)
  const [pendingProfileData, setPendingProfileData] = useState(null)

  const showError = (msg) => {
    setErrorMessage(msg)
  }

  const handleInputChange = () => {
    if (errorMessage) {
      setErrorMessage(null)
    }
  }

  const handleNext = async (phone) => {
    try {
      const res = await sendOtpAuto(phone)
      // server returns a purpose field in responses; pass it through
      const purpose = res?.purpose ?? 'signin'
      goToOtp({ phone, purpose })
    } catch (err) {
      console.error(err)
      showError(err.message || 'Failed to send OTP')
    }
  }

  const handleVerifyOtp = async (otp) => {
    try {
      const purpose = signupData?.purpose ?? 'signin'
      if (purpose === 'signup') {
        const data = await requestSignupVerifyOtp({ phone: email, otp })
        const token = data?.signupPendingToken
        if (!token) {
          showError('Signup verification failed')
          return
        }
        goToCompleteProfile(token)
        return
      }

      // signin
      const data = await requestSigninVerifyOtp({ phone: email, otp })
      clearStoredChatSession()
      const name = extractProfileName(data)
      if (name) setUserName(name)
      goToChat()
    } catch (err) {
      console.error(err)
      showError(err.message || 'Failed to verify code')
    }
  }

  const handleCompleteProfile = async ({ fullName, email: profileEmail }) => {
    setPendingProfileData({ fullName, email: profileEmail })
    setShowInitialAddBusiness(true)
    goToDashboard(DASHBOARD_VARIANT.ADVANCED)
  }

  let pageContent
  if (showInitialAddBusiness) {
    pageContent = (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <AddBusinessModal
          onClose={() => {
            setShowInitialAddBusiness(false)
            goToCompleteProfile(signupPendingToken)
          }}
          onContinue={async (businessName, businessDescription) => {
            try {
              if (pendingProfileData) {
                const { fullName, email: profileEmail } = pendingProfileData
                if (!signupPendingToken) {
                  throw new Error('Missing signup token for profile completion.')
                }
                const completeData = await requestSignupComplete({
                  signupPendingToken,
                  fullName,
                  email: profileEmail,
                })
                clearStoredChatSession()
                setUserName(extractProfileName(completeData, fullName))
                setPendingProfileData(null)
              }

              await createApplicationAndStartChat({ businessName, businessDescription })
            } catch (error) {
              console.error('API Error:', error)
              showError(error.message || 'Failed to finish signup and create business.')
              return
            }
            setShowInitialAddBusiness(false)
            goToChat()
          }}
        />
      </div>
    )
  } else if (isPayment) {
    pageContent = (
      <PaymentPage
        email={email}
        userName={signupData?.name}
        selectedBankIds={selectedBankIds}
        onBack={goToSelectBanks}
        onOpenChat={goToChat}
        onGoToDashboard={() => goToDashboard(DASHBOARD_VARIANT.SUBMITTED)}
        onLogout={exitToLogin}
      />
    )
  } else if (isSelectBanks) {
    pageContent = (
      <SelectBanksPage
        email={email}
        userName={signupData?.name}
        onBack={() => goToDashboard(DASHBOARD_VARIANT.ADVANCED)}
        onStartProcessing={goToPayment}
        onOpenChat={goToChat}
        onLogout={exitToLogin}
      />
    )
  } else if (isDashboard) {
    pageContent = (
      <DashboardPage
        variant={dashboardVariant}
        email={email}
        userName={signupData?.name}
        onOpenChat={goToChat}
        onViewAdvanced={() => goToDashboard(DASHBOARD_VARIANT.ADVANCED)}
        onViewSubmitted={() => goToDashboard(DASHBOARD_VARIANT.SUBMITTED)}
        onSelectBanks={goToSelectBanks}
        onLogout={exitToLogin}
      />
    )
  } else if (isChat) {
    pageContent = (
      <ChatPage
        email={email}
        userName={signupData?.name}
        onExit={() => goToDashboard(DASHBOARD_VARIANT.EARLY)}
        onOpenDashboard={() => goToDashboard(DASHBOARD_VARIANT.EARLY)}
        onLogout={exitToLogin}
      />
    )
  } else {
    pageContent = (
      <AuthShell>
        {isOtp ? (
          <OtpForm
            email={email}
            onSignIn={handleVerifyOtp}
            error={errorMessage}
            onChange={handleInputChange}
            onBack={goToLogin}
          />
        ) : isCompleteProfile ? (
          <CompleteProfileForm
            phone={email}
            onComplete={handleCompleteProfile}
            onBack={() => goToOtp({ phone: email, purpose: 'signup' })}
            error={errorMessage}
            onChange={handleInputChange}
          />
        ) : isSignup ? (
          <SignupForm
            onNext={() => goToLogin()}
            onBack={goToLogin}
            error={errorMessage}
            onChange={handleInputChange}
          />
        ) : (
          <LoginForm
            onNext={handleNext}
            onRegister={goToSignup}
            error={errorMessage}
            onChange={handleInputChange}
          />
        )}
      </AuthShell>
    )
  }

  const usesLoanJourney = isChat || isDashboard || isSelectBanks || isPayment

  if (usesLoanJourney) {
    return <LoanJourneyProvider>{pageContent}</LoanJourneyProvider>
  }

  return pageContent
}
