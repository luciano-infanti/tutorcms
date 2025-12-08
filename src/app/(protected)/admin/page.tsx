'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function AdminPage() {
    const { data: session } = useSession()
    const role = (session?.user as any)?.role

    // Basic client-side protection (Server-side is better in layout/middleware)
    if (session && role !== 'GM') {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-zinc-400">You do not have permission to view this page.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-zinc-400">Manage users, reports, and global settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                    <h3 className="text-lg font-medium text-white mb-2">Pending Reports</h3>
                    <p className="text-3xl font-bold text-indigo-500">0</p>
                </div>
                <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                    <h3 className="text-lg font-medium text-white mb-2">Suggestions</h3>
                    <p className="text-3xl font-bold text-indigo-500">0</p>
                </div>
                <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                    <h3 className="text-lg font-medium text-white mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-indigo-500">0</p>
                </div>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                <h3 className="text-lg font-medium text-white mb-4">Global Banner</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter banner message..."
                        className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg"
                    />
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}
