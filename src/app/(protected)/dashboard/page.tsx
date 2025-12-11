'use client'

import { useState, useMemo, useEffect, useDeferredValue, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useSession } from 'next-auth/react'
import { ReportModal } from '@/components/feedback/ReportModal'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import { SuggestionModal } from '@/components/feedback/SuggestionModal'
import AddQuestionModal from '@/components/admin/AddQuestionModal'
import { Search, ThumbsUp, Pin, Flag, Copy, X, Lightbulb, Edit, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HighlightedText } from '@/components/ui/HighlightedText'
import { WikiLinker } from '@/components/ui/WikiLinker'
import { hasPermission, UserRole } from '@/config/roles'
import { useTypewriter } from '@/components/ui/TypewriterPlaceholder'
import { Snackbar } from '@/components/ui/Snackbar'

type Question = Database['public']['Tables']['questions']['Row']

export default function DashboardPage() {
    const { data: session } = useSession()
    const [questions, setQuestions] = useState<Question[]>([])
    const [votedIds, setVotedIds] = useState<string[]>([])
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const deferredSearch = useDeferredValue(search)
    const [reportingQuestion, setReportingQuestion] = useState<{ id: string; text: string } | null>(null)
    const [showSuggestionModal, setShowSuggestionModal] = useState(false)
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState<{ id: string; text: string } | null>(null)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' | 'info'; isOpen: boolean }>({
        message: '',
        type: 'success',
        isOpen: false
    })

    const placeholderText = useTypewriter({
        phrases: [
            "Ask a question...",
            "Quantas horas duram as varinhas?",
            "Como vou pra Fenrock?",
            "Onde caçar no level 100?",
            "Qual o melhor set para Knight?",
            "Como fazer a quest da Pits of Inferno?",
            "Onde fica o NPC Rashid hoje?",
            "Qual o preço da Premium Time?"
        ],
        typingSpeed: 40,
        deletingSpeed: 20,
        pauseDuration: 1500
    })

    const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setSnackbar({ message, type, isOpen: true })
    }

    const userRole = (session?.user as any)?.role as UserRole
    const canAdd = hasPermission(userRole, 'canCreateQuestions')
    const canEdit = hasPermission(userRole, 'canEditQuestions')
    const canDelete = hasPermission(userRole, 'canDeleteQuestions')

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
            return (b.score || 0) - (a.score || 0)
        })

        const groups: Record<string, Question[]> = {}
        filtered.forEach(q => {
            if (!groups[q.category]) {
                groups[q.category] = []
            }
            groups[q.category].push(q)
        })

        // Sort categories alphabetically, but "Winter Update 2025" first
        return Object.keys(groups).sort((a, b) => {
            if (a.includes('Winter Update 2025')) return -1
            if (b.includes('Winter Update 2025')) return 1
            return a.localeCompare(b)
        }).reduce((acc, key) => {
            acc[key] = groups[key]
            return acc
        }, {} as Record<string, Question[]>)
    }, [deferredSearch, questions])

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




    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        showNotification('Copied to clipboard!', 'success')
    }

    const handleReport = async (questionId: string, reason: string) => {
        try {
            const res = await fetch('/api/questions/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, reason })
            })
            if (!res.ok) {
                showNotification('Failed to report', 'error')
                return
            }
            showNotification('Report submitted successfully!', 'success')
        } catch (error) {
            console.error('Report error:', error)
            showNotification('An error occurred', 'error')
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
                showNotification('Failed to submit suggestion', 'error')
                return
            }
            showNotification('Suggestion submitted successfully!', 'success')
        } catch (error) {
            console.error('Suggestion error:', error)
            showNotification('An error occurred', 'error')
        }
    }

    const handleSaveQuestion = async (questionData: { question_text: string; answer_text: string; category: string }) => {
        try {
            const url = editingQuestion ? '/api/admin/questions' : '/api/admin/questions'
            const method = editingQuestion ? 'PUT' : 'POST'
            const body = editingQuestion ? { ...questionData, id: editingQuestion.id } : questionData

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                showNotification(editingQuestion ? 'Question updated!' : 'Question added!', 'success')
                // Refresh questions
                const { data } = await supabase.from('questions').select('*').eq('is_approved', true)
                setQuestions(data || [])
                setEditingQuestion(null)
                setShowAddQuestionModal(false)
            } else {
                showNotification(editingQuestion ? 'Failed to update question' : 'Failed to add question', 'error')
            }
        } catch (error) {
            console.error('Save question error:', error)
            showNotification('An error occurred', 'error')
        }
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return
        try {
            const res = await fetch(`/api/admin/questions?id=${questionId}`, { method: 'DELETE' })
            if (res.ok) {
                setQuestions(prev => prev.filter(q => q.id !== questionId))
                showNotification('Question deleted!', 'success')
            } else {
                showNotification('Failed to delete question', 'error')
            }
        } catch (error) {
            console.error('Delete question error:', error)
            showNotification('An error occurred', 'error')
        }
    }

    // Helper to format category names (Camel Case)
    const formatCategory = (cat: string) => {
        return cat.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
    }

    return (
        <div className="space-y-8 pb-20 pt-12">
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
                            className="block w-full pl-12 pr-10 py-4 rounded-[28px] bg-white dark:bg-gemini-surface border border-transparent dark:border-gemini-surfaceHighlight hover:bg-gray-50 dark:hover:bg-white/[0.05] focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all duration-300 text-lg placeholder-gray-400 dark:placeholder-gray-500 text-light-text dark:text-gemini-text cursor-pointer"
                            placeholder={placeholderText}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute inset-y-0 right-3 my-auto h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:brightness-105 transition-all cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {canAdd && (
                        <button
                            onClick={() => setShowAddQuestionModal(true)}
                            className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[28px] font-medium transition-all whitespace-nowrap cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                            Add Question
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
                {loading ? (
                    <div className="text-center py-12 text-light-subtext dark:text-gemini-subtext">Loading questions...</div>
                ) : Object.keys(groupedQuestions).length > 0 ? (
                    Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
                        <div key={category} className="space-y-4">
                            <h2 className="text-[12px] font-bold text-light-text dark:text-white opacity-50 pl-1 capitalize">
                                {formatCategory(category)}
                            </h2>
                            <div className="space-y-3">
                                {categoryQuestions.map(q => {
                                    const isVoted = votedIds.includes(q.id)
                                    const score = q.score || 0

                                    return (
                                        <div
                                            key={q.id}
                                            className="bg-white dark:bg-gemini-surface rounded-xl border border-light-border dark:border-gemini-surfaceHighlight hover:bg-gray-50 dark:hover:bg-gemini-surfaceHighlight/50 hover:border-gray-200 dark:hover:border-gemini-border transition-all duration-200 overflow-hidden group p-6 relative cursor-pointer"
                                            onMouseEnter={() => setHoveredId(q.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                                    {/* Question */}
                                                    <div className="flex items-start gap-3">
                                                        <span className="font-semibold text-light-text dark:text-gemini-text text-[14px] leading-relaxed">
                                                            <HighlightedText text={q.question_text} highlight={search} />
                                                        </span>
                                                    </div>

                                                    {/* Answer */}
                                                    <div
                                                        className="text-light-subtext dark:text-gemini-subtext text-[14px] leading-relaxed cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors pl-0"
                                                        onClick={() => handleCopy(q.answer_text)}
                                                        title="Click to copy"
                                                    >
                                                        <WikiLinker text={q.answer_text} highlight={search} />
                                                    </div>
                                                </div>

                                                {/* Actions - Reserved Space, Opacity Transition */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleCopy(q.answer_text)}
                                                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                                        title="Copy Answer"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedQuestion({ id: q.id, text: q.question_text })
                                                            setShowSuggestionModal(true)
                                                        }}
                                                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                                        title="Suggest Edit"
                                                    >
                                                        <Lightbulb className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setReportingQuestion({ id: q.id, text: q.question_text })}
                                                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                                                        title="Report"
                                                    >
                                                        <Flag className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleVote(q.id)}
                                                        className={cn(
                                                            "p-1.5 rounded-lg transition-all flex items-center gap-1",
                                                            isVoted
                                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 opacity-100"
                                                                : "hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 cursor-pointer",
                                                            !isVoted && score <= 1 && "opacity-0 group-hover:opacity-100"
                                                        )}
                                                        title={isVoted ? "Unvote" : "Upvote"}
                                                    >
                                                        <ThumbsUp className={cn("w-4 h-4", isVoted && "fill-current")} />
                                                        <span className="text-xs font-bold">{score}</span>
                                                    </button>

                                                    {(canEdit || canDelete) && (
                                                        <>
                                                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingQuestion(q)
                                                                        setShowAddQuestionModal(true)
                                                                    }}
                                                                    className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                                                    title="Edit Question"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {canDelete && (
                                                                <button
                                                                    onClick={() => handleDeleteQuestion(q.id)}
                                                                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                                                                    title="Delete Question"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 flex flex-col items-center gap-4">
                        <p className="text-light-subtext dark:text-gemini-subtext">
                            No results found for "{search}"
                        </p>
                        {canAdd ? (
                            <button
                                onClick={() => setShowAddQuestionModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all cursor-pointer"
                            >
                                <Plus className="w-5 h-5" />
                                Create Question
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setSelectedQuestion(null)
                                    setShowSuggestionModal(true)
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gemini-surface border border-light-border dark:border-gemini-surfaceHighlight hover:bg-gray-50 dark:hover:bg-white/5 text-light-text dark:text-gemini-text rounded-full font-medium transition-all cursor-pointer"
                            >
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                Suggest Question
                            </button>
                        )}
                    </div>
                )}
            </div>

            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
                />
            )}

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

            {showAddQuestionModal && (
                <AddQuestionModal
                    isOpen={showAddQuestionModal}
                    onClose={() => {
                        setShowAddQuestionModal(false)
                        setEditingQuestion(null)
                    }}
                    onAdd={handleSaveQuestion}
                    initialData={editingQuestion}
                />
            )}
        </div>
    )
}
