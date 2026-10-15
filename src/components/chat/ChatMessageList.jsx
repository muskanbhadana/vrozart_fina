import { useEffect, useRef, useState } from 'react'
import AssistantAvatar from './AssistantAvatar'
import ChatMessage from './ChatMessage'

export default function ChatMessageList({
  messages,
  isLoading,
  isInitializing,
  onUploadSelect,
  onOptionSelect,
  uploadStatusMap,
  selectedOptions,
  interactionDisabled,
}) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)
  const prevLenRef = useRef(messages?.length ?? 0)
  const isAtBottomRef = useRef(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 60
      isAtBottomRef.current = atBottom
    }

    container.addEventListener('scroll', onScroll)
    onScroll()
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const prevLen = prevLenRef.current
    const nextLen = messages?.length ?? 0

    const shouldScroll = (() => {
      if (isInitializing) return true
      if (nextLen > prevLen && isAtBottomRef.current) return true
      // when loading assistant reply, scroll to show typing indicator
      if (isLoading && isAtBottomRef.current) return true
      return false
    })()

    if (shouldScroll) {
      bottomRef.current?.scrollIntoView({ behavior: prevLen === 0 ? 'auto' : 'smooth' })
    }

    prevLenRef.current = nextLen
  }, [messages, isLoading, isInitializing])

  if (isInitializing) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#4A72B2] [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#4A72B2] [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#4A72B2] [animation-delay:300ms]" />
          <span>Starting chat…</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-6 py-8 md:px-10 min-h-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 w-full">
        {messages.map((message, idx) => (
          <ChatMessage
            key={message.id ?? `msg-${idx}`}
            message={message}
            uploadStatusMap={uploadStatusMap}
            selectedOption={selectedOptions?.[message.id]}
            onOptionSelect={
              message.role === 'assistant' && onOptionSelect
                ? (option) => onOptionSelect(message.id, option)
                : undefined
            }
            onUploadSelect={onUploadSelect}
            disabled={interactionDisabled}
          />
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <AssistantAvatar />
            <div className="flex items-center gap-3 rounded-2xl bg-[#eceef2] px-4 py-3">
              <div className="flex items-center gap-1 shrink-0">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
              </div>
              <span className="text-sm font-medium text-gray-500 animate-pulse">
                FinnaBrain AI is analyzing your documents, please wait...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
