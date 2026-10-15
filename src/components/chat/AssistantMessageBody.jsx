import { MESSAGE_TYPE } from '../../utils/chatMessage'
import { mergeUploadStatuses, parseAssistantContent } from '../../utils/messageParser'
import DocumentChecklist from './DocumentChecklist'
import OptionChips from './OptionChips'
import QuestionCard from './QuestionCard'
import { DocumentIcon, DownloadIcon, EyeIcon } from '../icons'

function PdfDocumentCard({ pdfUrl, name = 'No Name' }) {
  return (
    <div className="mt-4 max-w-[280px] rounded-xl bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500">
          <DocumentIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-gray-900">{name}</p>
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mt-0.5">
            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
            Document Pdf
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0 bg-gray-50 rounded-lg p-0.5">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-all"
            title="View PDF"
          >
            <EyeIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-all"
            title="Download PDF"
          >
            <DownloadIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AssistantMessageBody({
  message,
  uploadStatusMap,
  selectedOption,
  onOptionSelect,
  onUploadSelect,
  disabled,
}) {
  const parsed =
    message.ui ?? parseAssistantContent(message.content)
  const isLegacyChecklist = message.type === MESSAGE_TYPE.UPLOAD_CHECKLIST

  if (isLegacyChecklist) {
    const items = mergeUploadStatuses(message.uploadItems ?? [], uploadStatusMap ?? {})
    return (
      <div className="rounded-2xl border border-gray-100/90 bg-[#f4f6f9] px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
        <DocumentChecklist
          items={items}
          onSelect={onUploadSelect}
          disabled={disabled}
        />
      </div>
    )
  }

  if (parsed.kind === 'document_checklist') {
    const items = mergeUploadStatuses(parsed.items ?? [], uploadStatusMap ?? {})
    return (
      <div className="space-y-3">
        {parsed.content && (
          <p className="text-[15px] leading-relaxed text-gray-700">{parsed.content}</p>
        )}
        <div className="rounded-2xl border border-gray-100/90 bg-[#f4f6f9] px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
          <DocumentChecklist
            items={items}
            onSelect={onUploadSelect}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  if (parsed.kind === 'question') {
    return (
      <QuestionCard question={parsed.content} preamble={parsed.preamble}>
        <OptionChips
          options={parsed.options}
          selectedOption={selectedOption}
          onSelect={onOptionSelect}
          disabled={disabled}
        />
      </QuestionCard>
    )
  }

  const textContent = parsed.content || message.content || ''
  const urlRegex = /(https?:\/\/[^\s]+)/g

  if (!urlRegex.test(textContent)) {
    return (
      <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-800">
        {textContent && <p>{textContent}</p>}
        {message.pdfUrl && <PdfDocumentCard pdfUrl={message.pdfUrl} />}
      </div>
    )
  }

  const parts = textContent.split(urlRegex)
  
  return (
    <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-800">
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          const isPdf = /\.pdf(\?.*)?$/i.test(part) || part.toLowerCase().includes('.pdf');
          
          // Hide the raw URL if it exactly matches the pdfUrl we are already rendering a card for below
          if (message.pdfUrl && part.trim() === message.pdfUrl.trim()) {
            return null;
          }

          const isImage = /\.(jpeg|jpg|gif|png|webp|svg|bmp)(\?.*)?$/i.test(part) || (part.includes('s3.amazonaws.com') && !isPdf);
          if (isImage) {
            return (
              <div key={i} className="my-2 max-w-[240px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <img
                  src={part}
                  alt="Attachment"
                  className="h-auto w-full object-cover"
                />
              </div>
            )
          }
          
          if (isPdf) {
            return (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#4A72B2] underline break-all hover:text-[#3b5d95] font-medium">
                View PDF Document
              </a>
            )
          }

          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#4A72B2] underline break-all hover:text-[#3b5d95]">
              {part}
            </a>
          )
        }
        return <span key={i}>{part}</span>
      })}
      {message.pdfUrl && <PdfDocumentCard pdfUrl={message.pdfUrl} />}
    </div>
  )
}
