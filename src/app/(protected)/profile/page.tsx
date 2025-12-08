'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Save } from 'lucide-react'

const SERVERS = [
    "Auroria", "Belaria", "Bellum", "Elysian", "Lunarian",
    "Mystian", "Solarian", "Spectrum", "Tenebrium", "Vesperia"
]

export default function ProfilePage() {
    const { data: session } = useSession()
    const [charName, setCharName] = useState('')
    const [server, setServer] = useState(SERVERS[0])
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        alert('Profile updated! (Simulation)')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-zinc-400">Manage your tutor identity.</p>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Avatar" className="w-full h-full rounded-full" />
                        ) : (
                            <User className="w-8 h-8 text-zinc-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium text-white">{session?.user?.name || 'User'}</h3>
                        <p className="text-sm text-zinc-500">{session?.user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded">
                            {(session?.user as any)?.role || 'Tutor'}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Character Name</label>
                        <input
                            type="text"
                            value={charName}
                            onChange={(e) => setCharName(e.target.value)}
                            placeholder="e.g. GM Thais"
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Server</label>
                        <select
                            value={server}
                            onChange={(e) => setServer(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {SERVERS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}
