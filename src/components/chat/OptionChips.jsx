export default function OptionChips({ options, selectedOption, onSelect, disabled }) {
  if (!options?.length) return null

  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {options.map((option) => {
        const label = typeof option === 'string' ? option : (option.label || option.value)
        const value = typeof option === 'string' ? option : (option.value || option.label)
        const isSelected = selectedOption === value || selectedOption === label

        return (
          <button
            key={value}
            type="button"
            disabled={disabled || Boolean(selectedOption)}
            onClick={() => onSelect?.(value)}
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-all duration-200 disabled:cursor-default disabled:opacity-60 ${
              isSelected
                ? 'border-[#4A72B2] bg-[#4A72B2] text-white shadow-[0_2px_8px_rgba(74,114,178,0.35)] disabled:shadow-none'
                : 'border-gray-200 bg-white text-gray-800 shadow-sm hover:border-[#b8cce8] hover:bg-[#f8fbff] hover:shadow-md'
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                isSelected
                  ? 'border-white bg-white/20'
                  : 'border-gray-300 bg-white'
              }`}
              aria-hidden="true"
            />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
