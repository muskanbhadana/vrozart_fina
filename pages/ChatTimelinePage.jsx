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

export default function ChatTimelinePage({ application, onBack }) {
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
        const response = await fetch(
          `http://168.144.70.172:8000/api/admin/applications/${encodeURIComponent(applicationId)}/timeline`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
                  const attachmentCount = (msg.attachments ?? []).filter((a) => a && a !== 'string').length

                  return (
                    <div
                      key={msg.messageId}
                      className={`mb-3 flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[75%] gap-2.5 ${isCustomer ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div
                          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            isCustomer
                              ? 'bg-[#DBEAFE] text-[#2563EB]'
                              : 'bg-[#334155] text-white'
                          }`}
                        >
                          {isCustomer ? (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div>
                          {/* Speaker label */}
                          <p className={`mb-1 text-[10px] font-semibold text-slate-400 ${isCustomer ? 'text-right' : 'text-left'}`}>
                            {msg.speaker ?? (isCustomer ? 'Customer' : 'AI')}
                          </p>

                          <div
                            className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                              isCustomer
                                ? 'rounded-tr-md bg-[#3B82F6] text-white'
                                : 'rounded-tl-md bg-[#F1F5F9] text-slate-800'
                            }`}
                          >
                            {/* Message content - preserve line breaks */}
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                            {/* Attachments indicator */}
                            {attachmentCount > 0 && (
                              <AttachmentBadge count={attachmentCount} />
                            )}
                          </div>

                          {/* Timestamp */}
                          <p className={`mt-1 text-[10px] text-slate-400 ${isCustomer ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
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
