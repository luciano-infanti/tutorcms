'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AlertCircle, Users, Flag, MessageSquare, Edit, Trash2, Plus, Save, Lightbulb, Check, X } from 'lucide-react'
import { hasPermission } from '@/config/roles'

export default function AdminPage() {
    const { data: session, status } = useSession()
    const userRole = (session?.user as any)?.role || 'Tutor'

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-light-subtext dark:text-gemini-subtext animate-pulse">Loading session...</div>
            </div>
        )
    }

    const [activeTab, setActiveTab] = useState<'banner' | 'reports' | 'questions' | 'users' | 'suggestions'>('banner')

    // Banner state
    const [bannerMessage, setBannerMessage] = useState('')
    const [isBannerActive, setIsBannerActive] = useState(false)
    const [savingBanner, setSavingBanner] = useState(false)

    // Reports state
    const [reports, setReports] = useState<any[]>([])
    const [loadingReports, setLoadingReports] = useState(false)

    // Questions state
    const [questions, setQuestions] = useState<any[]>([])
    const [loadingQuestions, setLoadingQuestions] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<any>(null)
    const [newQuestion, setNewQuestion] = useState({ question: '', answer: '', category: 'General' })

    // Users state
    const [users, setUsers] = useState<any[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)

    // Suggestions state
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)

    // Check GM permission
    if (!hasPermission(userRole, 'canViewAdminDashboard')) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold text-white">Access Denied</h1>
                    <p className="text-zinc-400">You don't have permission to view this page.</p>
                </div>
            </div>
        )
    }

    // Load data based on active tab
    useEffect(() => {
        if (activeTab === 'banner') loadBanner()
        if (activeTab === 'reports') loadReports()
        if (activeTab === 'questions') loadQuestions()
        if (activeTab === 'users') loadUsers()
        if (activeTab === 'suggestions') loadSuggestions()
    }, [activeTab])

    const loadBanner = async () => {
        try {
            const res = await fetch('/api/admin/banner')
            const data = await res.json()
            setBannerMessage(data.banner_message || '')
            setIsBannerActive(data.is_banner_active || false)
        } catch (error) {
            console.error('Failed to load banner:', error)
        }
    }

    const saveBanner = async () => {
        setSavingBanner(true)
        try {
            const res = await fetch('/api/admin/banner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: bannerMessage, isActive: isBannerActive })
            })
            if (res.ok) alert('Banner saved!')
            else alert('Failed to save banner')
        } catch (error) {
            alert('Failed to save banner')
        } finally {
            setSavingBanner(false)
        }
    }

    const loadReports = async () => {
        setLoadingReports(true)
        try {
            const res = await fetch('/api/admin/reports')
            const data = await res.json()
            setReports(data.reports || [])
        } catch (error) {
            console.error('Failed to load reports:', error)
        } finally {
            setLoadingReports(false)
        }
    }

    const resolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
        try {
            const res = await fetch('/api/admin/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId, status })
            })
            if (res.ok) {
                setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r))
            }
        } catch (error) {
            alert('Failed to update report')
        }
    }

    const loadQuestions = async () => {
        setLoadingQuestions(true)
        try {
            const res = await fetch('/api/admin/questions')
            const data = await res.json()
            setQuestions(data.questions || [])
        } catch (error) {
            console.error('Failed to load questions:', error)
        } finally {
            setLoadingQuestions(false)
        }
    }

    const deleteQuestion = async (questionId: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return
        try {
            const res = await fetch(`/api/admin/questions?id=${questionId}`, { method: 'DELETE' })
            if (res.ok) {
                setQuestions(prev => prev.filter(q => q.id !== questionId))
                alert('Question deleted!')
            }
        } catch (error) {
            alert('Failed to delete question')
        }
    }

    const saveQuestion = async (question: any) => {
        try {
            const res = await fetch('/api/admin/questions', {
                method: question.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(question)
            })
            if (res.ok) {
                loadQuestions()
                setEditingQuestion(null)
                setNewQuestion({ question: '', answer: '', category: 'General' })
                alert('Question saved!')
            }
        } catch (error) {
            alert('Failed to save question')
        }
    }

    const loadUsers = async () => {
        setLoadingUsers(true)
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            setUsers(data.users || [])
        } catch (error) {
            console.error('Failed to load users:', error)
        } finally {
            setLoadingUsers(false)
        }
    }

    const loadSuggestions = async () => {
        setLoadingSuggestions(true)
        try {
            const res = await fetch('/api/admin/suggestions')
            const data = await res.json()
            setSuggestions(data.suggestions || [])
        } catch (error) {
            console.error('Failed to load suggestions:', error)
        } finally {
            setLoadingSuggestions(false)
        }
    }

    const updateSuggestionStatus = async (suggestionId: string, status: 'approved' | 'rejected') => {
        try {
            const res = await fetch('/api/admin/suggestions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suggestionId, status })
            })
            if (res.ok) {
                setSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, status } : s))
            }
        } catch (error) {
            alert('Failed to update suggestion')
        }
    }

    return (
        <div className="space-y-8 pt-4">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold text-light-text dark:text-gemini-text">Admin Dashboard</h1>
                <p className="text-light-subtext dark:text-gemini-subtext">Manage the system and moderate content.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-light-border dark:border-gemini-surfaceHighlight overflow-x-auto no-scrollbar pb-1">
                {[
                    { id: 'banner', label: 'Global Banner', icon: MessageSquare },
                    { id: 'reports', label: 'Reports', icon: Flag },
                    { id: 'questions', label: 'Questions', icon: Edit },
                    { id: 'users', label: 'Users', icon: Users },
                    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                            : 'border-transparent text-light-subtext dark:text-gemini-subtext hover:text-light-text dark:hover:text-gemini-text hover:bg-gray-50 dark:hover:bg-gemini-surfaceHighlight/50 rounded-t-lg'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gemini-surface rounded-[24px] border border-light-border dark:border-gemini-surfaceHighlight p-6 sm:p-8 shadow-sm min-h-[400px]">
                {activeTab === 'banner' && (
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-xl font-bold text-light-text dark:text-gemini-text">Global Banner</h2>
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gemini-bg rounded-xl border border-light-border dark:border-gemini-surfaceHighlight">
                                <input
                                    type="checkbox"
                                    checked={isBannerActive}
                                    onChange={(e) => setIsBannerActive(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-light-text dark:text-gemini-text font-medium">Banner Active</label>
                            </div>
                            <textarea
                                value={bannerMessage}
                                onChange={(e) => setBannerMessage(e.target.value)}
                                placeholder="Enter banner message..."
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gemini-bg border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text resize-none transition-all"
                                rows={4}
                            />
                            <button
                                onClick={saveBanner}
                                disabled={savingBanner}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                            >
                                <Save className="w-4 h-4" />
                                {savingBanner ? 'Saving...' : 'Save Banner'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-light-text dark:text-gemini-text">Reports</h2>
                        {loadingReports ? (
                            <p className="text-light-subtext dark:text-gemini-subtext">Loading...</p>
                        ) : reports.length === 0 ? (
                            <div className="text-center py-12 text-light-subtext dark:text-gemini-subtext bg-gray-50 dark:bg-gemini-bg rounded-xl border border-dashed border-light-border dark:border-gemini-surfaceHighlight">
                                No pending reports
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reports.map(report => (
                                    <div key={report.id} className="bg-gray-50 dark:bg-gemini-bg rounded-xl p-5 border border-light-border dark:border-gemini-surfaceHighlight hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <p className="text-light-text dark:text-gemini-text font-medium text-lg">{report.reason}</p>
                                                <p className="text-sm text-light-subtext dark:text-gemini-subtext mt-1 font-mono bg-gray-200 dark:bg-black/20 inline-block px-2 py-0.5 rounded">ID: {report.question_id}</p>
                                                <p className="text-xs text-light-subtext dark:text-gemini-subtext mt-2 flex items-center gap-2">
                                                    Status:
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${report.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </p>
                                            </div>
                                            {report.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => resolveReport(report.id, 'resolved')}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg font-medium transition-colors shadow-sm"
                                                    >
                                                        Resolve
                                                    </button>
                                                    <button
                                                        onClick={() => resolveReport(report.id, 'dismissed')}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg font-medium transition-colors shadow-sm"
                                                    >
                                                        Dismiss
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-light-text dark:text-gemini-text">Questions</h2>
                            <button
                                onClick={() => setEditingQuestion({ question: '', answer: '', category: 'General' })}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Question
                            </button>
                        </div>

                        {editingQuestion && (
                            <div className="bg-gray-50 dark:bg-gemini-bg rounded-xl p-6 border border-blue-200 dark:border-blue-900/30 space-y-4 shadow-inner">
                                <h3 className="font-semibold text-light-text dark:text-gemini-text mb-2">
                                    {editingQuestion.id ? 'Edit Question' : 'New Question'}
                                </h3>
                                <input
                                    type="text"
                                    value={editingQuestion.question_text || editingQuestion.question}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value, question: e.target.value })}
                                    placeholder="Question"
                                    className="w-full px-4 py-3 bg-white dark:bg-gemini-surface border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text transition-all"
                                />
                                <textarea
                                    value={editingQuestion.answer_text || editingQuestion.answer}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, answer_text: e.target.value, answer: e.target.value })}
                                    placeholder="Answer"
                                    className="w-full px-4 py-3 bg-white dark:bg-gemini-surface border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text resize-none transition-all"
                                    rows={4}
                                />
                                <input
                                    type="text"
                                    value={editingQuestion.category}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                                    placeholder="Category"
                                    className="w-full px-4 py-3 bg-white dark:bg-gemini-surface border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text transition-all"
                                />
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => saveQuestion(editingQuestion)}
                                        className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium shadow-sm transition-all"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingQuestion(null)}
                                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {loadingQuestions ? (
                            <p className="text-light-subtext dark:text-gemini-subtext">Loading...</p>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {questions.map(q => (
                                    <div key={q.id} className="bg-gray-50 dark:bg-gemini-bg rounded-xl p-5 border border-light-border dark:border-gemini-surfaceHighlight hover:border-blue-300 dark:hover:border-blue-700/50 transition-all group">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <p className="text-light-text dark:text-gemini-text font-medium text-lg mb-1">{q.question_text}</p>
                                                <p className="text-sm text-light-subtext dark:text-gemini-subtext leading-relaxed">{q.answer_text}</p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-md uppercase tracking-wide">
                                                        {q.category}
                                                    </span>
                                                    <span className="text-xs text-light-subtext dark:text-gemini-subtext font-medium">
                                                        Score: {q.score}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingQuestion(q)}
                                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteQuestion(q.id)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-light-text dark:text-gemini-text">Users</h2>
                        {loadingUsers ? (
                            <p className="text-light-subtext dark:text-gemini-subtext">Loading...</p>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {users.map(user => (
                                    <div key={user.id} className="bg-gray-50 dark:bg-gemini-bg rounded-xl p-4 border border-light-border dark:border-gemini-surfaceHighlight flex items-center justify-between hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gemini-surface" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-light-text dark:text-gemini-text font-medium">{user.email}</p>
                                                <p className="text-sm text-light-subtext dark:text-gemini-subtext">
                                                    {user.character_name || 'No character'} • {user.server || 'No server'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'GM' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            user.role === 'Senior Tutor' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                                'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'suggestions' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-light-text dark:text-gemini-text">Suggestions</h2>
                        {loadingSuggestions ? (
                            <p className="text-light-subtext dark:text-gemini-subtext">Loading...</p>
                        ) : suggestions.length === 0 ? (
                            <div className="text-center py-12 text-light-subtext dark:text-gemini-subtext bg-gray-50 dark:bg-gemini-bg rounded-xl border border-dashed border-light-border dark:border-gemini-surfaceHighlight">
                                No pending suggestions
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {suggestions.map(suggestion => (
                                    <div key={suggestion.id} className="bg-gray-50 dark:bg-gemini-bg rounded-xl p-5 border border-light-border dark:border-gemini-surfaceHighlight hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${suggestion.type === 'new_question' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        suggestion.type === 'edit_proposal' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                        {suggestion.type.replace('_', ' ')}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${suggestion.status === 'pending' ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                                                        suggestion.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {suggestion.status}
                                                    </span>
                                                </div>
                                                {suggestion.question && (
                                                    <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide mb-1">Regarding Question</p>
                                                        <p className="text-sm text-blue-800 dark:text-blue-200 italic">"{suggestion.question.question_text}"</p>
                                                    </div>
                                                )}
                                                <p className="text-light-text dark:text-gemini-text font-medium text-lg whitespace-pre-wrap">{suggestion.content}</p>
                                                <div className="mt-3 flex items-center gap-2 text-sm text-light-subtext dark:text-gemini-subtext">
                                                    <span>By: {suggestion.user?.email || 'Unknown'}</span>
                                                    {suggestion.user?.character_name && <span>({suggestion.user.character_name})</span>}
                                                    <span>•</span>
                                                    <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            {suggestion.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateSuggestionStatus(suggestion.id, 'approved')}
                                                        className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => updateSuggestionStatus(suggestion.id, 'rejected')}
                                                        className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
