'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Lightbulb, Send } from 'lucide-react'

function SuggestionsContent() {
    const searchParams = useSearchParams()
    const questionId = searchParams.get('questionId')
    const questionText = searchParams.get('questionText')

    const [type, setType] = useState(questionId ? 'edit_proposal' : 'general_feedback')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (questionText) {
            setContent(`Suggestion for question: "${questionText}"\n\n`)
        }
    }, [questionText])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    content,
                    questionId: questionId || undefined
                })
            })

            if (!res.ok) throw new Error('Failed to submit suggestion')

            alert('Suggestion submitted successfully!')
            setContent('')
            if (!questionId) setType('general_feedback')
        } catch (error) {
            console.error('Error submitting suggestion:', error)
            alert('Failed to submit suggestion. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 pt-4">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold text-light-text dark:text-gemini-text">Suggestions</h1>
                <p className="text-light-subtext dark:text-gemini-subtext">Help us improve the server with your feedback and ideas.</p>
            </div>

            <div className="max-w-2xl bg-white dark:bg-gemini-surface rounded-[24px] border border-light-border dark:border-gemini-surfaceHighlight p-6 sm:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-light-text dark:text-gemini-text">Suggestion Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { id: 'general_feedback', label: 'General Feedback' },
                                { id: 'new_question', label: 'New Question Idea' },
                                { id: 'edit_proposal', label: 'Edit Proposal' }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setType(option.id)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${type === option.id
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                            : 'bg-gray-50 dark:bg-gemini-bg border-transparent text-light-subtext dark:text-gemini-subtext hover:bg-gray-100 dark:hover:bg-gemini-surfaceHighlight'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-light-text dark:text-gemini-text">Your Suggestion</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-gemini-bg border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function SuggestionsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuggestionsContent />
        </Suspense>
    )
}
