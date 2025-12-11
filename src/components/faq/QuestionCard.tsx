'use client'

import { useState, memo } from 'react'
import { Copy, ThumbsUp, Pin, Flag, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionProps {
    id: string
    question: string
    answer: string
    category: string
    score: number
    highlight?: string
    isPinned?: boolean
    onVote?: (id: string) => Promise<void>
    onReport?: (id: string) => void
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onCopy?: () => void
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
    id, question, answer, category, score, highlight, isPinned, onVote, onReport, onEdit, onDelete, onCopy
}: QuestionProps) {
    const [copied, setCopied] = useState(false)
    const [voting, setVoting] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(answer)
        if (onCopy) {
            onCopy()
        } else {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
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

    return (
        <article
            className="bg-white dark:bg-gemini-surface rounded-[24px] p-6 sm:p-7 border border-light-border dark:border-gemini-surfaceHighlight hover:bg-gray-50 dark:hover:bg-gemini-surfaceHighlight/50 hover:border-gray-200 dark:hover:border-gemini-border transition-all duration-200 group relative animate-fade-in cursor-pointer"
        >

            {/* Header: Category & Actions */}
            <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 tracking-wide uppercase">
                    {category}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                    {onEdit && (
                        <>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                            <button
                                onClick={() => onEdit(id)}
                                className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
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
                    <span className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded animate-in fade-in slide-in-from-bottom-2">
                        Copied!
                    </span>
                )}
            </div>

            {/* Pinned Indicator (Always visible if pinned) */}
            {
                isPinned && (
                    <div className="absolute top-6 right-6 text-blue-600 dark:text-gemini-accent opacity-100 group-hover:opacity-0 transition-opacity">
                        <Pin className="w-5 h-5 fill-current" />
                    </div>
                )
            }
        </article >
    )
})
