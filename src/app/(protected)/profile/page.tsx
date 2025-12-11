'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Save } from 'lucide-react'
import { SERVERS } from '@/config/constants'

export default function ProfilePage() {
    const { data: session } = useSession()
    const [charName, setCharName] = useState('')
    const [server, setServer] = useState('Auroria')
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [avatarError, setAvatarError] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile')
                const data = await res.json()
                setCharName(data.characterName || '')
                setServer(data.server || 'Auroria')
            } catch (error) {
                console.error('Failed to fetch profile:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (session) {
            fetchProfile()
        }
    }, [session])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterName: charName, server })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update profile')
            }

            alert('Profile updated successfully!')
        } catch (error: any) {
            console.error('Save error:', error)
            alert(error.message || 'Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center py-12 text-zinc-500">Loading profile...</div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pt-4">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold text-light-text dark:text-gemini-text">Profile Settings</h1>
                <p className="text-light-subtext dark:text-gemini-subtext">Manage your tutor identity.</p>
            </div>

            <div className="bg-white dark:bg-gemini-surface rounded-[24px] border border-light-border dark:border-gemini-surfaceHighlight p-6 sm:p-8 space-y-8">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gemini-surface overflow-hidden flex items-center justify-center">
                            {session?.user?.image && !avatarError ? (
                                <img
                                    src={session.user.image}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    onError={() => setAvatarError(true)}
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-2xl font-medium text-white">
                                    {session?.user?.name
                                        ? session.user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                                        : <User className="w-8 h-8 text-gray-400" />}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-light-text dark:text-gemini-text">{session?.user?.name || 'User'}</h3>
                        <p className="text-light-subtext dark:text-gemini-subtext">{session?.user?.email}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full border border-indigo-100 dark:border-indigo-500/20">
                            {(session?.user as any)?.role || 'Tutor'}
                        </span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-light-subtext dark:text-gemini-subtext mb-1.5">Character Name</label>
                        <input
                            type="text"
                            value={charName}
                            onChange={(e) => setCharName(e.target.value)}
                            placeholder="e.g. GM Thais"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gemini-bg border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light-subtext dark:text-gemini-subtext mb-1.5">Server</label>
                        <select
                            value={server}
                            onChange={(e) => setServer(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gemini-bg border border-light-border dark:border-gemini-surfaceHighlight rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-light-text dark:text-gemini-text transition-all appearance-none"
                        >
                            {SERVERS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-light-border dark:border-gemini-surfaceHighlight flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}
