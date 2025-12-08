'use client'

import { signIn } from "next-auth/react"
import { LogIn } from "lucide-react"

export function LoginScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
            <div className="text-center space-y-6 p-8 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-indigo-500/10 rounded-full">
                        <LogIn className="w-8 h-8 text-indigo-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold">Authentication Required</h1>
                <p className="text-zinc-400">You must sign in with your Google account to access the dashboard.</p>

                <button
                    onClick={() => signIn('google')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <LogIn className="w-4 h-4" />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
