'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check, Tag } from 'lucide-react'


interface Category {
    id: string
    name: string
    count?: number
}

export function CategoriesTab() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [newCategory, setNewCategory] = useState('')

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/admin/categories')
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setCategories(data.categories || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!newCategory.trim()) return
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory.trim() })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(prev => [...prev, { ...data.category, count: 0 }])
            setNewCategory('')
            setError('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleUpdate = async () => {
        if (!editingId || !editName.trim()) return
        const originalName = categories.find(c => c.id === editingId)?.name

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingId,
                    oldName: originalName,
                    newName: editName.trim()
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            // Update local state
            setCategories(prev => prev.map(c =>
                c.id === editingId ? { ...c, name: editName.trim() } : c
            ))

            setEditingId(null)
            setEditName('')
            setError('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete category "${name}"?`)) return

        try {
            const res = await fetch(`/api/admin/categories?id=${id}&name=${encodeURIComponent(name)}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(prev => prev.filter(c => c.id !== id))
            setError('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-gray-100 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Manage Categories
                </h2>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-400">
                    <p>{error}</p>
                </div>
            )}

            {/* Add New */}
            <div className="flex gap-4">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category Name..."
                    className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-100"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button
                    onClick={handleAdd}
                    disabled={!newCategory.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No categories found.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Questions</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {editingId === cat.id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {cat.count || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingId === cat.id ? (
                                                <>
                                                    <button
                                                        onClick={handleUpdate}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                        title="Save"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(null)
                                                            setEditName('')
                                                        }}
                                                        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(cat.id)
                                                            setEditName(cat.name)
                                                        }}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id, cat.name)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
