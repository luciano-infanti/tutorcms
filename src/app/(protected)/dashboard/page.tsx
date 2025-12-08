'use client'

import { useState, useMemo, useEffect, useDeferredValue, memo } from 'react'

import { useSession } from 'next-auth/react'
import { ReportModal } from '@/components/feedback/ReportModal'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import { SuggestionModal } from '@/components/feedback/SuggestionModal'
import { Search, ThumbsUp, Pin, Flag, Copy, X, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

type Question = Database['public']['Tables']['questions']['Row']

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

// Snackbar Component
const CopySnackbar = ({ onClose }: { onClose: () => void }) => {
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const startTime = Date.now()
        const duration = 3000

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
            setProgress(remaining)

            if (remaining === 0) {
                clearInterval(timer)
                onClose()
            }
        }, 16)

        return () => clearInterval(timer)
    }, [onClose])

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-fade-in-up">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] relative overflow-hidden">
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
                <Copy className="w-4 h-4" />
                <span className="font-medium text-sm">Copied to clipboard!</span>
                <button onClick={onClose} className="ml-auto p-1 hover:bg-white/10 dark:hover:bg-black/10 rounded-full transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const [questions, setQuestions] = useState<Question[]>([])
    const [pinnedIds, setPinnedIds] = useState<string[]>([])
    const [votedIds, setVotedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const deferredSearch = useDeferredValue(search)
    const [reportingQuestion, setReportingQuestion] = useState<{ id: string; text: string } | null>(null)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [showSuggestionModal, setShowSuggestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState<{ id: string; text: string } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('is_approved', true)

            if (error) {
                console.error('Error fetching questions:', error)
            } else {
                setQuestions(data || [])
            }

            if (session?.user?.email) {
                try {
                    // Fetch pinned
                    const pinRes = await fetch('/api/questions/pin')
                    const pinData = await pinRes.json()
                    setPinnedIds(pinData.pinnedIds || [])

                    // Fetch user votes
                    const { data: userData } = await supabase
                        .from('users')
                        .select('id')
                        .eq('email', session.user.email)
                        .single()

                    if (userData) {
                        const { data: votes } = await supabase
                            .from('votes')
                            .select('question_id')
                            .eq('user_id', userData.id)

                        setVotedIds(votes?.map(v => v.question_id) || [])
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err)
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [session])

    // Group questions by category
    const groupedQuestions = useMemo(() => {
        const filtered = questions.filter(q => {
            const matchesSearch = q.question_text.toLowerCase().includes(deferredSearch.toLowerCase()) ||
                q.answer_text.toLowerCase().includes(deferredSearch.toLowerCase())
            return matchesSearch
        }).sort((a, b) => {
            const aPinned = pinnedIds.includes(a.id)
            const bPinned = pinnedIds.includes(b.id)
            if (aPinned && !bPinned) return -1
            if (!aPinned && bPinned) return 1
            return (b.score || 0) - (a.score || 0)
        })

        const groups: Record<string, Question[]> = {}
        filtered.forEach(q => {
            if (!groups[q.category]) {
                groups[q.category] = []
            }
            groups[q.category].push(q)
        })

        // Sort categories alphabetically
        return Object.keys(groups).sort().reduce((acc, key) => {
            acc[key] = groups[key]
            return acc
        }, {} as Record<string, Question[]>)
    }, [deferredSearch, questions, pinnedIds])

    const handleVote = async (questionId: string) => {
        try {
            const res = await fetch('/api/questions/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId })
            })

            if (!res.ok) return

            const data = await res.json()
            const isVoted = data.voted

            setVotedIds(prev =>
                isVoted
                    ? [...prev, questionId]
                    : prev.filter(id => id !== questionId)
            )

            setQuestions(prev => prev.map(q =>
                q.id === questionId
                    ? { ...q, score: (q.score || 0) + (isVoted ? 1 : -1) }
                    : q
            ))
        } catch (error) {
            console.error('Vote error:', error)
        }
    }

    const handlePin = async (questionId: string) => {
        try {
            const res = await fetch('/api/questions/pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId })
            })
            const data = await res.json()
            if (!res.ok) return
            setPinnedIds(prev =>
                data.pinned ? [...prev, questionId] : prev.filter(id => id !== questionId)
            )
        } catch (error) {
            console.error('Pin error:', error)
        }
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setShowSnackbar(true)
    }

    const handleReport = async (questionId: string, reason: string) => {
        try {
            const res = await fetch('/api/questions/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, reason })
            })
            if (!res.ok) {
                alert('Failed to report')
                return
            }
            alert('Report submitted successfully!')
        } catch (error) {
            console.error('Report error:', error)
        }
    }



    const handleSuggestion = async (type: string, content: string, questionId?: string) => {
        try {
            const res = await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, content, questionId })
            })
            if (!res.ok) {
                alert('Failed to submit suggestion')
                return
            }
            alert('Suggestion submitted successfully!')
        } catch (error) {
            console.error('Suggestion error:', error)
        }
    }

    // Helper to format category names (Camel Case)
    const formatCategory = (cat: string) => {
        return cat.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="text-center space-y-3 animate-fade-in-up pt-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 pb-1">
                    RubinOT FAQ
                </h1>
                <p className="text-light-subtext dark:text-gemini-subtext text-lg max-w-lg mx-auto">
                    Everything you need to know about the server.
                </p>
            </div>

            {/* Controls */}
            <div className="sticky top-16 z-40 bg-light-bg/95 dark:bg-gemini-bg/95 py-4 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0 transition-colors duration-300">
                <div className="max-w-5xl mx-auto flex gap-4">
                    {/* Search */}
                    <div className="relative group w-full">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-12 pr-10 py-4 rounded-[28px] bg-white dark:bg-gemini-surface border border-transparent dark:border-gemini-surfaceHighlight shadow-soft hover:shadow-soft-hover focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all duration-300 text-lg placeholder-gray-400 dark:placeholder-gray-500 text-light-text dark:text-gemini-text"
                            placeholder="Ask a question..."
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>


                </div>
            </div>

            {/* Content */}
            <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
                {loading ? (
                    <div className="text-center py-12 text-light-subtext dark:text-gemini-subtext">Loading questions...</div>
                ) : Object.keys(groupedQuestions).length > 0 ? (
                    Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
                        <div key={category} className="space-y-4">
                            <h2 className="text-[12px] font-bold text-light-text dark:text-white opacity-50 pl-1 border-l-4 border-blue-500 pl-3 capitalize">
                                {formatCategory(category)}
                            </h2>
                            <div className="bg-white dark:bg-gemini-surface rounded-[24px] border border-light-border dark:border-gemini-surfaceHighlight shadow-soft hover:shadow-soft-hover transition-shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse table-fixed">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-gemini-surfaceHighlight/50 border-b border-light-border dark:border-gemini-surfaceHighlight">
                                                <th className="p-6 font-semibold text-light-subtext dark:text-gemini-subtext text-[14px] uppercase tracking-wider w-[30%]">Question</th>
                                                <th className="p-6 font-semibold text-light-subtext dark:text-gemini-subtext text-[14px] uppercase tracking-wider w-[55%]">Answer</th>
                                                <th className="p-6 font-semibold text-light-subtext dark:text-gemini-subtext text-[14px] uppercase tracking-wider w-[15%] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-light-border dark:divide-gemini-surfaceHighlight">
                                            {categoryQuestions.map(q => {
                                                const isPinned = pinnedIds.includes(q.id)
                                                const isVoted = votedIds.includes(q.id)
                                                const score = q.score || 0

                                                return (
                                                    <tr key={q.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="p-6 align-top break-words">
                                                            <div className="flex items-start gap-3">
                                                                {isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current mt-1 flex-shrink-0" />}
                                                                <span className="font-medium text-light-text dark:text-gemini-text text-[14px] leading-relaxed">
                                                                    <HighlightedText text={q.question_text} highlight={search} />
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-6 align-top break-words">
                                                            <div
                                                                className="text-light-subtext dark:text-gemini-subtext text-[14px] leading-relaxed cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                                                                onClick={() => handleCopy(q.answer_text)}
                                                                title="Click to copy"
                                                            >
                                                                <HighlightedText text={q.answer_text} highlight={search} />
                                                            </div>
                                                        </td>
                                                        <td className="p-6 align-top text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handlePin(q.id)}
                                                                        className={cn(
                                                                            "p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors",
                                                                            isPinned ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                                                                        )}
                                                                        title={isPinned ? "Unpin" : "Pin"}
                                                                    >
                                                                        <Pin className={cn("w-4 h-4", isPinned && "fill-current")} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedQuestion({ id: q.id, text: q.question_text })
                                                                            setShowSuggestionModal(true)
                                                                        }}
                                                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                                                        title="Suggest Edit"
                                                                    >
                                                                        <Lightbulb className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setReportingQuestion({ id: q.id, text: q.question_text })}
                                                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                                        title="Report"
                                                                    >
                                                                        <Flag className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleVote(q.id)}
                                                                    className={cn(
                                                                        "p-2 rounded-lg transition-all flex items-center gap-1",
                                                                        isVoted
                                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 opacity-100"
                                                                            : "hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400",
                                                                        !isVoted && score <= 1 && "opacity-0 group-hover:opacity-100"
                                                                    )}
                                                                    title={isVoted ? "Unvote" : "Upvote"}
                                                                >
                                                                    <ThumbsUp className={cn("w-4 h-4", isVoted && "fill-current")} />
                                                                    <span className="text-xs font-bold">{score}</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-light-subtext dark:text-gemini-subtext">
                        No results found for "{search}"
                    </div>
                )}
            </div>

            {showSnackbar && <CopySnackbar onClose={() => setShowSnackbar(false)} />}

            {reportingQuestion && (
                <ReportModal
                    questionId={reportingQuestion.id}
                    questionText={reportingQuestion.text}
                    onClose={() => setReportingQuestion(null)}
                    onSubmit={handleReport}
                />
            )}

            {showSuggestionModal && (
                <SuggestionModal
                    onClose={() => {
                        setShowSuggestionModal(false)
                        setSelectedQuestion(null)
                    }}
                    onSubmit={handleSuggestion}
                    questionId={selectedQuestion?.id}
                    questionText={selectedQuestion?.text}
                />
            )}
        </div>
    )
}
