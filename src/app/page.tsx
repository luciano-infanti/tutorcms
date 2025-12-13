'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function GlobalGate() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // In a real app, we'd verify this server-side via an API route to set the cookie securely.
        // For this scaffold, we'll do a simple client-side check and set a cookie.
        // Ideally, use a Server Action or API route.

        // Check against env variable (exposed for this check, or hardcoded for now if env not avail)
        // Note: In client component, we can't access server-side env vars unless prefixed with NEXT_PUBLIC_
        // or passed down. For security, this should be an API call.

        // Let's assume we use a simple API route for verification to keep secrets secret.
        try {
            const res = await fetch('/api/auth/gate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            if (res.ok) {
                router.push('/dashboard')
                router.refresh()
            } else {
                setError('Access Denied')
            }
        } catch (err) {
            setError('Something went wrong')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 py-8">
            {/* Logo no topo */}
            <div className="mb-8 flex justify-center">
                <img
                    src="/image4.png"
                    alt="Logo"
                    width={250}
                    height={250}
                    className="object-contain"
                    style={{ maxWidth: '250px', maxHeight: '250px', width: 'auto', height: 'auto', display: 'block' }}
                    loading="eager"
                />
            </div>
            
            <div className="max-w-md w-full p-8 bg-zinc-900 rounded-xl border border-zinc-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-indigo-500/10 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        Seja bem-vindo à FAQ do <span style={{ color: '#ffb808' }}>RubinOT</span>
                    </h1>
                    <p className="text-zinc-400 text-center mt-2">
                        Please enter the global access password to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
                    >
                        Enter System
                    </button>
                </form>
            </div>
        </div>
    )
}
