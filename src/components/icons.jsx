export function GoogleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function FacebookIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function AppleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

export function ArrowRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowLeftIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  )
}

export function ChevronDownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function ChevronLeftIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function ChevronRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function ChevronsUpDownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={`block shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 15l5 5 5-5M7 9l5-5 5 5" />
    </svg>
  )
}

export function PlusIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function SendEnterIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10l-4 4 4 4M5 14h12" />
    </svg>
  )
}

export function WaveformIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="4" y="8" width="2" height="8" rx="1" />
      <rect x="8" y="5" width="2" height="14" rx="1" />
      <rect x="12" y="7" width="2" height="10" rx="1" />
      <rect x="16" y="4" width="2" height="16" rx="1" />
      <rect x="20" y="9" width="2" height="6" rx="1" />
    </svg>
  )
}

export function FinnaBrainIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function DashboardIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

/** Finnabrain mark from circle.svg, cropped to match dashboard icon visual weight */
export function FinnabrainCircleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="12 12 21 21" fill="none" aria-hidden="true">
      <path
        d="M12.56 29.7198C12.3405 29.9421 12.1761 30.2126 12.08 30.5098C12.0051 30.8119 12.0051 31.1278 12.08 31.4298C12.1425 31.81 12.3247 32.1603 12.6 32.4298C12.8695 32.7052 13.2198 32.8874 13.6 32.9498C13.9021 33.0248 14.2179 33.0248 14.52 32.9498C14.8172 32.8537 15.0878 32.6893 15.31 32.4698C15.53 32.2497 15.6915 31.9782 15.78 31.6798C15.855 31.3778 15.855 31.0619 15.78 30.7598C15.7061 30.3835 15.5256 30.0364 15.26 29.7598C15.0186 29.5154 14.7144 29.3423 14.381 29.2594C14.0476 29.1765 13.6978 29.187 13.37 29.2898C13.0685 29.3637 12.7901 29.5115 12.56 29.7198Z"
        fill="#4672B8"
      />
      <path
        d="M29.76 12.5601C29.5441 12.7834 29.3832 13.0539 29.29 13.3501C29.1981 13.648 29.1809 13.964 29.24 14.2701C29.3139 14.6464 29.4944 14.9935 29.76 15.2701C30.0366 15.5357 30.3837 15.7162 30.76 15.7901C31.0674 15.8436 31.383 15.8245 31.6817 15.7342C31.9803 15.6439 32.2537 15.485 32.48 15.2701C32.6921 15.0373 32.844 14.7561 32.9224 14.451C33.0009 14.146 33.0035 13.8264 32.93 13.5201C32.8561 13.1438 32.6756 12.7967 32.41 12.5201C32.1334 12.2545 31.7863 12.074 31.41 12.0001C31.1043 11.927 30.7857 11.927 30.48 12.0001C30.2 12.1288 29.9536 12.3205 29.76 12.5601Z"
        fill="#4672B8"
      />
      <path
        d="M25.57 16.7499L27.46 14.8599C25.9908 13.9024 24.2738 13.3949 22.52 13.3999C22.3 13.3999 22.08 13.3999 21.86 13.3999C20.2824 13.5075 18.7602 14.0253 17.4441 14.902C16.128 15.7786 15.0637 16.9838 14.3566 18.3982C13.6494 19.8126 13.3238 21.3871 13.4121 22.966C13.5004 24.5448 13.9995 26.0732 14.86 27.3999L16.75 25.5099C15.9686 24.0254 15.7914 22.2963 16.2555 20.6842C16.7196 19.0721 17.789 17.7018 19.24 16.8599C20.2011 16.3117 21.2847 16.0142 22.391 15.995C23.4972 15.9758 24.5905 16.2354 25.57 16.7499Z"
        fill="#4672B8"
      />
      <path
        d="M19.48 28.21L17.58 30.1C19.3246 31.2326 21.4052 31.7318 23.4739 31.5143C25.5425 31.2967 27.4737 30.3754 28.9445 28.9046C30.4153 27.4338 31.3366 25.5026 31.5542 23.434C31.7718 21.3653 31.2725 19.2847 30.14 17.54L28.25 19.43C28.748 20.3637 29.0098 21.4051 29.0125 22.4633C29.0152 23.5215 28.7587 24.5642 28.2655 25.5004C27.7722 26.4366 27.0572 27.2377 26.1829 27.8339C25.3086 28.43 24.3016 28.8029 23.25 28.92C21.9503 29.0725 20.6351 28.8248 19.48 28.21Z"
        fill="#4672B8"
      />
    </svg>
  )
}

export function VaultIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  )
}

export function BellIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5M10 20a2 2 0 004 0" />
    </svg>
  )
}

export function HeadsetIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0116 0v4a3 3 0 01-3 3h-1M4 16v-2a3 3 0 013-3h0M20 16v-2a3 3 0 00-3-3h0M8 20h8" />
    </svg>
  )
}

export function BuildingIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V6l8-4 8 4v14H4zM9 20v-6h6v6" />
    </svg>
  )
}

export function ReportDocIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M12 3l7 4v14H5V7l7-4z" />
    </svg>
  )
}

export function CheckCircleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
    </svg>
  )
}

export function DownloadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v10M8 10l4 4 4-4M5 20h14" />
    </svg>
  )
}

export function EyeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export function TrendUpIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l6-6 4 4 6-8" />
    </svg>
  )
}

export function ShieldCheckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  )
}

export function CreditCardIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path strokeLinecap="round" d="M2 10h20" />
    </svg>
  )
}

export function DocumentIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  )
}
