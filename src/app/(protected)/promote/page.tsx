'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AlertCircle, Users, UserPlus, Check, Search, X } from 'lucide-react'
import { hasPermission, UserRole } from '@/config/roles'

interface Player {
    id: string
    email: string
    character_name: string | null
    server: string | null
    avatar_url: string | null
    created_at: string
    last_seen: string | null
}

export default function PromotePage() {
    const { data: session, status } = useSession()
    const userRole = ((session?.user as any)?.role || 'Player') as UserRole

    const [players, setPlayers] = useState<Player[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [promotingId, setPromotingId] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        if (status === 'authenticated' && hasPermission(userRole, 'canPromotePlayerToTutor')) {
            loadPlayers()
        }
    }, [status, userRole])

    const loadPlayers = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/promote')
            const data = await res.json()
            setPlayers(data.users || [])
        } catch (error) {
            console.error('Failed to load players:', error)
        } finally {
            setLoading(false)
        }
    }

    const promotePlayer = async (userId: string) => {
        setPromotingId(userId)
        try {
            const res = await fetch('/api/promote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })

            if (res.ok) {
                const data = await res.json()
                setSuccessMessage(data.message || 'Player promoted successfully!')
                // Remove from list
                setPlayers(prev => prev.filter(p => p.id !== userId))
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to promote player')
            }
        } catch (error) {
            console.error('Promote error:', error)
            alert('Failed to promote player')
        } finally {
            setPromotingId(null)
        }
    }

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-light-subtext dark:text-gemini-subtext animate-pulse">Loading session...</div>
            </div>
        )
    }

    // Check permission
    if (!hasPermission(userRole, 'canPromotePlayerToTutor')) {
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

    const filteredPlayers = players.filter(player => {
        const searchLower = search.toLowerCase()
        return (
            player.email.toLowerCase().includes(searchLower) ||
            (player.character_name?.toLowerCase().includes(searchLower)) ||
            (player.server?.toLowerCase().includes(searchLower))
        )
    })

    return (
        <div className="space-y-8 pt-4 max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold text-light-text dark:text-gemini-text">Promote Players</h1>
                <p className="text-light-subtext dark:text-gemini-subtext">
                    Promote Players to Tutor status. Only users with the Player role are shown here.
                </p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-700 dark:text-green-300 font-medium">{successMessage}</p>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-12 pr-10 py-3 rounded-xl bg-white dark:bg-gemini-surface border border-light-border dark:border-gemini-surfaceHighlight focus:ring-2 focus:ring-green-500/50 focus:outline-none transition-all text-light-text dark:text-gemini-text placeholder-gray-400"
                    placeholder="Search by email, character name, or server..."
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute inset-y-0 right-3 my-auto h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Players List */}
            <div className="bg-white dark:bg-gemini-surface rounded-[24px] border border-light-border dark:border-gemini-surfaceHighlight p-6 sm:p-8">
                {loading ? (
                    <div className="text-center py-12 text-light-subtext dark:text-gemini-subtext">
                        Loading players...
                    </div>
                ) : filteredPlayers.length === 0 ? (
                    <div className="text-center py-12 text-light-subtext dark:text-gemini-subtext bg-gray-50 dark:bg-gemini-bg rounded-xl border border-dashed border-light-border dark:border-gemini-surfaceHighlight">
                        {search ? 'No players match your search' : 'No players awaiting promotion'}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredPlayers.map(player => (
                            <div
                                key={player.id}
                                className="bg-gray-50 dark:bg-gemini-bg rounded-xl p-4 border border-light-border dark:border-gemini-surfaceHighlight flex items-center justify-between hover:border-green-200 dark:hover:border-green-900/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {player.avatar_url ? (
                                        <img
                                            src={player.avatar_url}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gemini-surface"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-light-text dark:text-gemini-text font-medium">{player.email}</p>
                                        <p className="text-sm text-light-subtext dark:text-gemini-subtext">
                                            {player.character_name || 'No character'} • {player.server || 'No server'}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            Joined: {new Date(player.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => promotePlayer(player.id)}
                                    disabled={promotingId === player.id}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white rounded-xl font-medium transition-all"
                                >
                                    {promotingId === player.id ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Promoting...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Promote to Tutor
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Promoting a Player to Tutor grants them the ability to vote on questions, 
                    submit reports, and make suggestions. This action cannot be undone from this page.
                </p>
            </div>
        </div>
    )
}

