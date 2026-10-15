import { ArrowRightIcon } from './icons'

export default function GhostButton({
  type = 'button',
  children,
  showArrow = true,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-[15px] font-medium text-gray-800 transition-all hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      {showArrow && <ArrowRightIcon />}
    </button>
  )
}
