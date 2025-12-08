'use client'

import { useState, memo } from 'react'
import { Copy, ThumbsUp, Pin, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionProps {
    id: string
    question: string
    answer: string
    category: string
    score: number
    isPinned?: boolean
    highlight?: string
    onVote?: (id: string) => Promise<void>
    onPin?: (id: string) => Promise<void>
    onReport?: (id: string) => void
}

// Helper to highlight text
const HighlightedText = memo(({ text, highlight }: { text: string; highlight?: string }) => {
    if (!highlight || !highlight.trim()) return <>{text}</>

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-gray-900 dark:text-yellow-100 rounded-sm px-0.5 font-medium">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    )
})
HighlightedText.displayName = 'HighlightedText'

export const QuestionCard = memo(function QuestionCard({
    id, question, answer, category, score, isPinned, highlight, onVote, onPin, onReport
}: QuestionProps) {
    const [copied, setCopied] = useState(false)
    const [voting, setVoting] = useState(false)
    const [pinning, setPinning] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(answer)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleVote = async () => {
        if (!onVote || voting) return
        setVoting(true)
        try {
            await onVote(id)
        } finally {
            setVoting(false)
        }
    }

    const handlePin = async () => {
        if (!onPin || pinning) return
        setPinning(true)
        try {
            await onPin(id)
        } finally {
            setPinning(false)
        }
    }

    return (
        <article
            className="bg-white dark:bg-gemini-surface rounded-[24px] p-6 sm:p-7 shadow-sm border border-light-border dark:border-gemini-surfaceHighlight hover:shadow-md transition-all duration-300 group relative animate-fade-in"
        >

            {/* Header: Category & Actions */}
            <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 tracking-wide uppercase">
                    {category}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handlePin}
                        disabled={pinning}
                        className={cn(
                            "p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gemini-surfaceHighlight transition-colors",
                            isPinned ? "text-blue-600 dark:text-gemini-accent" : "text-gray-400 dark:text-gray-500"
                        )}
                        title={isPinned ? "Unpin" : "Pin"}
                    >
                        <Pin className={cn("w-4 h-4", isPinned && "fill-current")} />
                    </button>
                    <button
                        onClick={handleVote}
                        disabled={voting}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gemini-surfaceHighlight text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center gap-1"
                        title="Upvote"
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{score}</span>
                    </button>
                    <button
                        onClick={() => onReport?.(id)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gemini-surfaceHighlight text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Report"
                    >
                        <Flag className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-medium text-light-text dark:text-gemini-text mb-3 leading-tight">
                <HighlightedText text={question} highlight={highlight} />
            </h3>

            <div
                className="text-light-subtext dark:text-gemini-subtext leading-relaxed cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors relative"
                onClick={handleCopy}
                title="Click to copy answer"
            >
                <HighlightedText text={answer} highlight={highlight} />
                {copied && (
                    <span className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2">
                        Copied!
                    </span>
                )}
            </div>

            {/* Pinned Indicator (Always visible if pinned) */}
            {isPinned && (
                <div className="absolute top-6 right-6 text-blue-600 dark:text-gemini-accent opacity-100 group-hover:opacity-0 transition-opacity">
                    <Pin className="w-5 h-5 fill-current" />
                </div>
            )}
        </article>
    )
})
