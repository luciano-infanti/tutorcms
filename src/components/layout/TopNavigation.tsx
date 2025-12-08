'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon, LogOut, Shield } from 'lucide-react'

export function TopNavigation() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const { theme, toggleTheme } = useTheme()
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'GM'

    return (
        <nav className="fixed top-0 w-full z-50 bg-light-bg/90 dark:bg-gemini-bg/90 backdrop-blur-md border-b border-light-border dark:border-gemini-surfaceHighlight transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Area */}
                    <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                            T
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg leading-none tracking-tight text-light-text dark:text-gemini-text">Tutor Helper</span>
                            <span className="text-[10px] uppercase tracking-wider text-light-subtext dark:text-gemini-subtext font-medium">Rubinot Staff</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link
                            href="/dashboard"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pathname === '/dashboard'
                                    ? 'bg-white dark:bg-gemini-surface shadow-sm text-blue-600 dark:text-gemini-accent border border-light-border dark:border-gemini-border'
                                    : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight'
                                }`}
                        >
                            FAQ Dashboard
                        </Link>
                        <Link
                            href="/documents"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pathname === '/documents'
                                    ? 'bg-white dark:bg-gemini-surface shadow-sm text-blue-600 dark:text-gemini-accent border border-light-border dark:border-gemini-border'
                                    : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight'
                                }`}
                        >
                            Documents
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${pathname === '/admin'
                                        ? 'bg-white dark:bg-gemini-surface shadow-sm text-red-500 dark:text-red-400 border border-light-border dark:border-gemini-border'
                                        : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight focus:outline-none transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Profile Avatar */}
                        <Link href="/profile">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gemini-surface flex items-center justify-center overflow-hidden">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-white">
                                            {session?.user?.name?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>

                        {/* Sign Out (Small) */}
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="p-2 rounded-full text-light-subtext dark:text-gemini-subtext hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
