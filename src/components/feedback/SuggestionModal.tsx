'use client'

import { useState } from 'react'
import { X, Lightbulb } from 'lucide-react'

interface SuggestionModalProps {
    onClose: () => void
    onSubmit: (type: string, content: string, questionId?: string) => Promise<void>
    questionId?: string
    questionText?: string
}

export function SuggestionModal({ onClose, onSubmit, questionId, questionText }: SuggestionModalProps) {
    const [type, setType] = useState(questionId ? 'edit_proposal' : 'general_feedback')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        try {
            await onSubmit(type, content, questionId)
            onClose()
        } catch (error) {
            console.error('Failed to submit suggestion:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gemini-surface rounded-[24px] border border-light-border dark:border-gemini-surfaceHighlight shadow-2xl max-w-md w-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-gemini-surfaceHighlight">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h2 className="text-xl font-bold text-light-text dark:text-gemini-text">Make a Suggestion</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-light-subtext dark:text-gemini-subtext mb-2">
                            Suggestion Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gemini-bg border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text transition-all appearance-none"
                        >
                            <option value="general_feedback">General Feedback</option>
                            <option value="new_question">New Question Idea</option>
                            <option value="edit_proposal">Edit Proposal</option>
                        </select>
                    </div>

                    {questionText && (
                        <div>
                            <label className="block text-sm font-medium text-light-subtext dark:text-gemini-subtext mb-2">
                                Regarding Question
                            </label>
                            <input
                                type="text"
                                value={questionText}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-black/20 border border-light-border dark:border-gemini-surfaceHighlight rounded-xl text-light-text dark:text-gemini-text opacity-70 cursor-not-allowed"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-light-subtext dark:text-gemini-subtext mb-2">
                            What would you like to change?
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type your suggestion here..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gemini-bg border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text placeholder-gray-400 dark:placeholder-gray-600 resize-none transition-all"
                            rows={5}
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
