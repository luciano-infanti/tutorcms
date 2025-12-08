'use client'

import { useState } from 'react'
import { Copy, ThumbsUp, Pin, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionProps {
    id: string
    question: string
    answer: string
    category: string
    score: number
    isPinned?: boolean
    onVote?: (id: string) => void
    onPin?: (id: string) => void
}

export function QuestionCard({
    id, question, answer, category, score, isPinned, onVote, onPin
}: QuestionProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(answer)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full font-medium">
                            {category}
                        </span>
                        {isPinned && (
                            <span className="flex items-center gap-1 text-indigo-400 text-xs font-medium">
                                <Pin className="w-3 h-3 fill-current" /> Pinned
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
                    <div
                        className="text-zinc-300 leading-relaxed cursor-pointer hover:text-white transition-colors relative"
                        onClick={handleCopy}
                        title="Click to copy answer"
                    >
                        {answer}
                        {copied && (
                            <span className="absolute -top-8 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2">
                                Copied!
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onPin?.(id)}
                        className={cn(
                            "p-2 rounded-lg hover:bg-zinc-800 transition-colors",
                            isPinned ? "text-indigo-400" : "text-zinc-500"
                        )}
                        title="Pin Question"
                    >
                        <Pin className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onVote?.(id)}
                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-green-400 transition-colors flex flex-col items-center gap-1"
                        title="Upvote"
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{score}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
