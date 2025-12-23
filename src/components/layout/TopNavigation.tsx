'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon, LogOut, Shield, User, Scale, Info, Sparkles, ExternalLink, UserPlus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { hasPermission, UserRole } from '@/config/roles'

export function TopNavigation() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const { theme, toggleTheme } = useTheme()
    const userRole = ((session?.user as any)?.role || 'Player') as UserRole
    const canViewAdmin = hasPermission(userRole, 'canViewAdminDashboard')
    const canPromote = hasPermission(userRole, 'canPromotePlayerToTutor')

    const [userInfo, setUserInfo] = useState<{ character_name: string | null, server: string | null }>({ character_name: null, server: null })
    const [showDropdown, setShowDropdown] = useState(false)
    const [avatarError, setAvatarError] = useState(false)

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (session?.user?.email) {
                const { data } = await supabase
                    .from('users')
                    .select('character_name, server')
                    .eq('email', session.user.email)
                    .single()

                if (data) {
                    setUserInfo(data)
                }
            }
        }
        fetchUserInfo()
    }, [session])

    return (
        <nav className="fixed top-0 w-full z-50 bg-light-bg/90 dark:bg-gemini-bg/90 backdrop-blur-md border-b border-light-border dark:border-gemini-surfaceHighlight transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Area */}
                    <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer group">
                        <img
                            src="https://wiki.rubinot.com/brand/logo.webp"
                            alt="RubinOT"
                            className="w-8 h-8 object-contain group-hover:scale-105 transition-transform cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg leading-none tracking-tight text-light-text dark:text-gemini-text">RubinOT</span>
                            <span className="text-[10px] uppercase tracking-wider text-light-subtext dark:text-gemini-subtext font-medium">Staff Helper</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link
                            href="/dashboard"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pathname === '/dashboard'
                                ? 'bg-white dark:bg-gemini-surface text-blue-600 dark:text-gemini-accent border border-light-border dark:border-gemini-border'
                                : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight cursor-pointer'
                                }`}
                        >
                            FAQ Dashboard
                        </Link>
                        <Link
                            href="/rules"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pathname === '/rules'
                                ? 'bg-white dark:bg-gemini-surface text-blue-600 dark:text-gemini-accent border border-light-border dark:border-gemini-border'
                                : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight cursor-pointer'
                                }`}
                        >
                            Rules
                        </Link>
                        <Link
                            href="/server-info"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pathname === '/server-info'
                                ? 'bg-white dark:bg-gemini-surface text-blue-600 dark:text-gemini-accent border border-light-border dark:border-gemini-border'
                                : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight cursor-pointer'
                                }`}
                        >
                            Server Info
                        </Link>
                        <Link
                            href="/extras"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pathname === '/extras'
                                ? 'bg-white dark:bg-gemini-surface text-blue-600 dark:text-gemini-accent border border-light-border dark:border-gemini-border'
                                : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight cursor-pointer'
                                }`}
                        >
                            Extras
                        </Link>

                        {/* Admin Panel - CM and GM only */}
                        {canViewAdmin && (
                            <Link
                                href="/admin"
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${pathname === '/admin'
                                    ? 'bg-white dark:bg-gemini-surface text-red-500 dark:text-red-400 border border-light-border dark:border-gemini-border'
                                    : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight cursor-pointer'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </Link>
                        )}

                        {/* Promote Players - SeniorTutor, GM, CM (but not shown if already has Admin access to avoid duplication for CM/GM) */}
                        {canPromote && !canViewAdmin && (
                            <Link
                                href="/promote"
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${pathname === '/promote'
                                    ? 'bg-white dark:bg-gemini-surface text-green-500 dark:text-green-400 border border-light-border dark:border-gemini-border'
                                    : 'text-light-subtext dark:text-gemini-subtext hover:bg-gray-200 dark:hover:bg-gemini-surfaceHighlight cursor-pointer'
                                    }`}
                            >
                                <UserPlus className="w-4 h-4" />
                                Promote
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Wiki Link */}
                        <a
                            href="https://wiki.rubinot.com/pt-BR"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gemini-surfaceHighlight transition-colors text-light-subtext dark:text-gemini-subtext cursor-pointer"
                            title="RubinOT Wiki"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span className="text-sm font-medium">RubinOT Wiki</span>
                        </a>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gemini-surfaceHighlight transition-colors relative overflow-hidden w-10 h-10 flex items-center justify-center cursor-pointer"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            <div className="relative w-5 h-5">
                                <Sun className={`w-5 h-5 text-yellow-500 absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                                <Moon className={`w-5 h-5 text-blue-400 absolute inset-0 transition-all duration-500 transform ${theme === 'light' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                            </div>
                        </button>

                        {/* User Info & Avatar Dropdown */}
                        <div
                            className="relative flex items-center gap-3"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            {/* User Info */}
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-light-text dark:text-gemini-text">
                                    {userInfo.character_name || session?.user?.name || 'User'}
                                </span>
                                <span className="text-xs text-light-subtext dark:text-gemini-subtext">
                                    {userInfo.server || 'No Server'}
                                </span>
                            </div>

                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gemini-surface flex items-center justify-center overflow-hidden">
                                    {session?.user?.image && !avatarError ? (
                                        <img
                                            src={session.user.image}
                                            alt="User"
                                            className="w-full h-full object-cover"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-white">
                                            {session?.user?.name
                                                ? session.user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                                                : 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute top-full right-0 w-48 pt-2 animate-fade-in z-50">
                                    <div className="bg-white dark:bg-gemini-surface rounded-xl shadow-lg border border-light-border dark:border-gemini-surfaceHighlight py-1">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-light-text dark:text-gemini-text hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

