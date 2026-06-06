import { useEffect, useMemo, useRef, useState } from 'react'
import { getAuthToken } from '../config/auth.js'

function formatTime(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function groupMessagesByDate(messages) {
  const groups = []
  let currentDate = null
  let currentGroup = null

  for (const msg of messages) {
    const msgDate = formatDate(msg.createdAt)
    if (msgDate !== currentDate) {
      currentDate = msgDate
      currentGroup = { date: msgDate, messages: [] }
      groups.push(currentGroup)
    }
    currentGroup.messages.push(msg)
  }

  return groups
}

function AttachmentBadge({ count }) {
  if (!count) return null
  return (
    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      {count} file{count > 1 ? 's' : ''}
    </span>
  )
}

export default function ChatTimelinePage({ application, isCreditRoute, onBack }) {
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const scrollRef = useRef(null)

  const applicationId = application?.id ?? application?.applicationId ?? ''

  useEffect(() => {
    if (!applicationId) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function fetchTimeline() {
      setIsLoading(true)
      setFetchError(null)
      try {
        const token = await getAuthToken()
        const endpoint = isCreditRoute 
          ? `http://168.144.70.172:8000/api/credit-analyst/applications/${encodeURIComponent(applicationId)}/chat`
          : `http://168.144.70.172:8000/api/admin/applications/${encodeURIComponent(applicationId)}/timeline`

        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to load chat timeline')
        }
        const data = await response.json()
        if (cancelled) return

        setMessages(data.messages ?? [])
        setChatId(data.chatId ?? null)
      } catch (error) {
        if (!cancelled) {
          setFetchError(error.message)
          console.error('Failed to fetch timeline:', error)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchTimeline()
    return () => {
      cancelled = true
    }
  }, [applicationId])

  // Scroll to bottom on load
  useEffect(() => {
    if (!isLoading && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [isLoading, messages])

  const dateGroups = useMemo(() => groupMessagesByDate(messages), [messages])

  return (
    <div className="flex min-h-0 flex-col gap-6">
      {/* Top Header Bar with Back Button */}
      <div className="flex w-full items-center justify-between rounded-xl bg-[#334155] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Chat Timeline</h3>
            <p className="text-[11px] text-slate-300">
              {applicationId}{chatId ? ` • Chat ${chatId.slice(0, 8)}…` : ''}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading conversation…</p>
        </div>
      )}

      {/* Error State */}
      {fetchError && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 p-8 shadow-sm">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2 text-sm font-semibold text-red-700">{fetchError}</p>
        </div>
      )}

      {/* Chat Messages */}
      {!isLoading && !fetchError && (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {/* Chat stats bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
            <span className="text-xs font-semibold text-slate-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                Customer
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-[#334155]" />
                AI Assistant
              </span>
            </div>
          </div>

          {/* Scrollable message area */}
          <div
            ref={scrollRef}
            className="max-h-[520px] overflow-y-auto px-5 py-5"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="mt-2 text-sm font-medium text-slate-400">No messages found.</p>
              </div>
            )}

            {dateGroups.map((group) => (
              <div key={group.date}>
                {/* Date Separator */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <span className="relative z-10 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-400 border border-slate-100">
                    {group.date}
                  </span>
                </div>

                {/* Messages for this date */}
                {group.messages.map((msg) => {
                  const isCustomer = msg.role === 'user'
                  const attachmentFiles = msg.attachmentFiles || []
                  const isUploadMessage = isCustomer && msg.content.trim().startsWith('Uploaded:')
                  const showBubble = !isUploadMessage || (isUploadMessage && attachmentFiles.length === 0)

                  return (
                    <div
                      key={msg.messageId}
                      className={`mb-6 flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[85%] gap-3 ${isCustomer ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar (only for AI) */}
                        {!isCustomer && (
                          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white shadow-sm">
                            <svg className="h-[18px] w-[18px] text-[#4A72B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                          </div>
                        )}

                        {/* Message Content Area */}
                        <div className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
                          {/* Speaker and Time (only for AI) */}
                          {!isCustomer && (
                            <div className="mb-1.5 flex items-baseline gap-2 px-1">
                              <span className="text-[13px] font-bold text-slate-800">FinnaBrain Ai</span>
                              <span className="text-[11px] text-slate-400">{formatTime(msg.createdAt)}</span>
                            </div>
                          )}

                          {/* Message Bubble */}
                          {showBubble && (
                            <div
                              className={`rounded-2xl px-5 py-4 text-[14px] leading-relaxed shadow-sm ${
                                isCustomer
                                  ? 'bg-[#4A72B2] text-white rounded-br-sm'
                                  : 'bg-[#f8fafc] text-slate-700 border border-slate-100/50 rounded-bl-sm'
                              }`}
                            >
                              {/* Parse content for options if AI, otherwise raw text */}
                              {!isCustomer ? (
                                <div className="flex flex-col gap-4">
                                  {msg.content.split('\n\n').map((part, idx) => {
                                    const qMatch = part.match(/^(.*?\?)\s+([^?]+)\.?$/);
                                    if (qMatch) {
                                      const question = qMatch[1];
                                      const optionsStr = qMatch[2];
                                      if (optionsStr.includes(',') || optionsStr.split(' ').length <= 4) {
                                        const options = optionsStr.split(',').map(s => s.trim());
                                        return (
                                          <div key={idx} className="flex flex-col gap-3">
                                            <p className="font-semibold text-slate-800">{question}</p>
                                            <div className="flex flex-wrap gap-2.5 mt-1">
                                              {options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm">
                                                  <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-200"></div>
                                                  {opt.replace(/\.$/, '')}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      }
                                    }
                                    return <p key={idx} className="whitespace-pre-wrap break-words">{part}</p>;
                                  })}
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              )}
                            </div>
                          )}

                          {/* Attachments rendered outside the text bubble */}
                          {attachmentFiles.length > 0 && (
                            <div className={`${showBubble ? 'mt-2' : ''} flex flex-col gap-3 ${isCustomer ? 'items-end' : 'items-start'}`}>
                              {attachmentFiles.map(file => {
                                const isImage = file.mimeType?.startsWith('image/');
                                const isPdf = file.mimeType === 'application/pdf';
                                const fileUrl = file.viewUrl || file.s3Url || file.url;
                                
                                if (isImage) {
                                  return (
                                    <a key={file.fileId} href={fileUrl} target="_blank" rel="noreferrer" className="block w-40 shrink-0">
                                      <img src={fileUrl} alt={file.displayName} className="w-full rounded-lg border border-slate-200 shadow-sm object-cover bg-white" />
                                    </a>
                                  );
                                }
                                if (isPdf) {
                                  return (
                                    <a key={file.fileId} href={fileUrl} target="_blank" rel="noreferrer" className="flex flex-col rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm hover:bg-slate-50 transition-colors w-56">
                                      <p className="truncate text-[13px] text-slate-700">{file.displayName}</p>
                                      <p className="text-[11px] text-slate-400 mt-0.5">PDF uploaded</p>
                                    </a>
                                  );
                                }
                                return (
                                  <a key={file.fileId} href={fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 shadow-sm w-fit">
                                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    <span className="truncate">{file.displayName}</span>
                                  </a>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Time for customer */}
                          {isCustomer && (
                            <span className="mt-1.5 px-1 text-[11px] text-slate-400">{formatTime(msg.createdAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
