import { APPLICATION_STATUS } from '../data/applications.js'
import { APPLICATION_STAGE, APPLICATION_STATUS as CREDIT_APPLICATION_STATUS } from '../data/creditApplications.js'
import { StatusIcon } from './AdminIcons.jsx'

// Color palette for unknown/unmapped statuses — each gets a unique, vibrant color
const FALLBACK_COLORS = [
  'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/70',
  'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200/70',
  'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200/70',
  'bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-200/70',
  'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200/70',
  'bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200/70',
  'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70',
  'bg-fuchsia-50 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-200/70',
]

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function getFallbackConfig(status) {
  const idx = hashString(status || '') % FALLBACK_COLORS.length
  return {
    className: FALLBACK_COLORS[idx],
    icon: 'clock',
  }
}

export default function ApplicationStatusBadge({ status }) {
  const config = APPLICATION_STATUS[status]

  if (config) {
    return (
      <span
        className={`inline-flex h-6 min-w-[6.5rem] max-w-[8.5rem] items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium leading-none ${config.className}`}
      >
        <StatusIcon name={config.icon} className="h-3 w-3 shrink-0 opacity-80" />
        <span className="truncate">{config.label}</span>
      </span>
    )
  }

  // Unknown status — show with a unique color from the palette
  const fallback = getFallbackConfig(status)
  const label = status || 'Unknown'

  return (
    <span
      className={`inline-flex h-6 min-w-[6.5rem] max-w-[8.5rem] items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium leading-none ${fallback.className}`}
    >
      <StatusIcon name={fallback.icon} className="h-3 w-3 shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </span>
  )
}

export function ApplicationStageBadge({ stage }) {
  const config = APPLICATION_STAGE[stage]

  if (config) {
    return (
      <span
        className={`inline-flex h-6 min-w-[6.5rem] max-w-[8.5rem] items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium leading-none ${config.className}`}
      >
        <StatusIcon name={config.icon} className="h-3 w-3 shrink-0 opacity-80" />
        <span className="truncate">{config.label}</span>
      </span>
    )
  }

  const fallback = getFallbackConfig(stage)
  const label = stage || 'Unknown'

  return (
    <span
      className={`inline-flex h-6 min-w-[6.5rem] max-w-[8.5rem] items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium leading-none ${fallback.className}`}
    >
      <StatusIcon name={fallback.icon} className="h-3 w-3 shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </span>
  )
}

export function CreditStatusBadge({ status }) {
  const config = CREDIT_APPLICATION_STATUS[status]

  if (config) {
    return (
      <span
        className={`inline-flex h-6 min-w-[6.5rem] max-w-[8.5rem] items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium leading-none ${config.className}`}
      >
        <StatusIcon name={config.icon} className="h-3 w-3 shrink-0 opacity-80" />
        <span className="truncate">{config.label}</span>
      </span>
    )
  }

  const fallback = getFallbackConfig(status)
  const label = status || 'Unknown'

  return (
    <span
      className={`inline-flex h-6 min-w-[6.5rem] max-w-[8.5rem] items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium leading-none ${fallback.className}`}
    >
      <StatusIcon name={fallback.icon} className="h-3 w-3 shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </span>
  )
}
