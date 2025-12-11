'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Wand2 } from 'lucide-react'
import { CharacterCounter } from '@/components/ui/CharacterCounter'

import { CustomDropdown } from '@/components/ui/CustomDropdown'

interface AddQuestionModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (question: any) => void
    initialData?: {
        question_text: string
        answer_text: string
        category: string
    } | null
}

export default function AddQuestionModal({ isOpen, onClose, onAdd, initialData }: AddQuestionModalProps) {
    const [formData, setFormData] = useState({
        question_text: '',
        answer_text: '',
        category: ''
    })
    const [previousText, setPreviousText] = useState<{
        question_text?: string
        answer_text?: string
    }>({})
    const [categories, setCategories] = useState<any[]>([])
    const [customCategories, setCustomCategories] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRewriting, setIsRewriting] = useState<'question' | 'answer' | null>(null)
    const MAX_CHARS = 248

    useEffect(() => {
        if (isOpen) {
            fetchCategories()
            if (initialData) {
                setFormData(initialData)
            } else {
                setFormData({ question_text: '', answer_text: '', category: '' })
            }
        }
    }, [isOpen, initialData])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
        }
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories')
            const data = await res.json()
            setCategories(data.categories || [])
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.answer_text.length > MAX_CHARS) return

        setIsSubmitting(true)
        await onAdd(formData)
        setIsSubmitting(false)
        setFormData({ question_text: '', answer_text: '', category: '' })
        onClose()
    }

    const handleRewrite = async (field: 'question' | 'answer') => {
        const text = field === 'question' ? formData.question_text : formData.answer_text
        if (!text) return

        setIsRewriting(field)
        try {
            const res = await fetch('/api/ai/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, type: field })
            })
            const data = await res.json()

            if (!res.ok) {
                const errorMessage = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to rewrite text')
                throw new Error(errorMessage)
            }

            if (data.rewritten) {
                // Save current text before overwriting
                setPreviousText(prev => ({
                    ...prev,
                    [field === 'question' ? 'question_text' : 'answer_text']: text
                }))

                setFormData(prev => ({
                    ...prev,
                    [field === 'question' ? 'question_text' : 'answer_text']: data.rewritten
                }))
            }
        } catch (error: any) {
            console.error('Rewrite error full object:', error)
            alert(error.message || 'Failed to rewrite text. Please try again.')
        } finally {
            setIsRewriting(null)
        }
    }

    // Helper to format to Camel Case
    const toCamelCase = (str: string) => {
        return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
    }

    const categoryOptions = [
        ...categories.map(c => ({ value: c.name, label: toCamelCase(c.name) })),
        ...customCategories.map(c => ({ value: c, label: toCamelCase(c) }))
    ]

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Edit Question' : 'Add New Question'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
                            <div className="flex items-center gap-2">
                                {previousText.question_text && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, question_text: previousText.question_text! }))
                                            setPreviousText(prev => ({ ...prev, question_text: undefined }))
                                        }}
                                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline transition-colors cursor-pointer"
                                    >
                                        Undo
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRewrite('question')}
                                    disabled={!formData.question_text || isRewriting === 'question'}
                                    className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    <Wand2 className={`w-3 h-3 ${isRewriting === 'question' ? 'animate-spin' : ''}`} />
                                    {isRewriting === 'question' ? 'Rewriting...' : 'Magic Rewrite'}
                                </button>
                            </div>
                        </div>
                        <input
                            type="text"
                            required
                            value={formData.question_text}
                            onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                            placeholder="What is the question?"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Answer</label>
                            <div className="flex items-center gap-3">
                                {previousText.answer_text && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, answer_text: previousText.answer_text! }))
                                            setPreviousText(prev => ({ ...prev, answer_text: undefined }))
                                        }}
                                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline transition-colors cursor-pointer"
                                    >
                                        Undo
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRewrite('answer')}
                                    disabled={!formData.answer_text || isRewriting === 'answer'}
                                    className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    <Wand2 className={`w-3 h-3 ${isRewriting === 'answer' ? 'animate-spin' : ''}`} />
                                    {isRewriting === 'answer' ? 'Rewriting...' : 'Magic Rewrite'}
                                </button>
                                <CharacterCounter current={formData.answer_text.length} max={MAX_CHARS} />
                            </div>
                        </div>
                        <textarea
                            required
                            value={formData.answer_text}
                            onChange={(e) => setFormData({ ...formData, answer_text: e.target.value })}
                            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white resize-none transition-all ${formData.answer_text.length > MAX_CHARS
                                ? 'border-red-500 focus:ring-red-500/50'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                            placeholder="Type the answer here..."
                            rows={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                        <CustomDropdown
                            options={categoryOptions}
                            value={formData.category}
                            onChange={(value) => setFormData({ ...formData, category: value })}
                            placeholder="Select a category"
                            allowCreate={true}
                            onCreate={(value) => {
                                setCustomCategories(prev => [...prev, value])
                                setFormData({ ...formData, category: value })
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.question_text || !formData.answer_text || !formData.category}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {!initialData && <Plus className="w-4 h-4" />}
                                    {initialData ? 'Save Changes' : 'Add Question'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    )
}
