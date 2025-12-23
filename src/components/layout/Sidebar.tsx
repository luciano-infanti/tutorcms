'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LayoutDashboard, User, FileText, Shield, LogOut, Lightbulb, Scale, Info, Sparkles, ExternalLink, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { hasPermission, UserRole } from '@/config/roles'

const navItems = [
    { name: 'FAQ Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Rules', href: '/rules', icon: Scale },
    { name: 'Server Info', href: '/server-info', icon: Info },
    { name: 'Extras', href: '/extras', icon: Sparkles },
    { name: 'Profile', href: '/profile', icon: User },
]

const adminItem = { name: 'Admin Panel', href: '/admin', icon: Shield }
const promoteItem = { name: 'Promote Players', href: '/promote', icon: UserPlus }

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const userRole = (session?.user as any)?.role as UserRole

    const canViewAdmin = hasPermission(userRole, 'canViewAdminDashboard')
    const canPromote = hasPermission(userRole, 'canPromotePlayerToTutor')
    const showStaffSection = canViewAdmin || canPromote

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba8503e3-de95-4237-bfb2-b8307e3469b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:28',message:'Sidebar role check',data:{userRole,userRoleType:typeof userRole,userRoleLength:userRole?.length,canViewAdmin,canPromote,showStaffSection,sessionEmail:(session?.user as any)?.email},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B'})}).catch(()=>{});
    // #endregion

    return (
        <div className="w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-6 border-b border-zinc-800">
                <h1 className="text-xl font-bold text-indigo-500">Tutor Helper</h1>
                <p className="text-xs text-zinc-500">Rubinot Staff Tool</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    )
                })}

                {showStaffSection && (
                    <>
                        <div className="my-4 border-t border-zinc-800" />
                        
                        {/* Admin Panel - CM and GM only */}
                        {canViewAdmin && (
                            <Link
                                href={adminItem.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    pathname === adminItem.href
                                        ? "bg-red-500/10 text-red-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
                                )}
                            >
                                <Shield className="w-5 h-5" />
                                {adminItem.name}
                            </Link>
                        )}

                        {/* Promote Players - SeniorTutor, GM, and CM */}
                        {canPromote && (
                            <Link
                                href={promoteItem.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    pathname === promoteItem.href
                                        ? "bg-green-500/10 text-green-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
                                )}
                            >
                                <UserPlus className="w-5 h-5" />
                                {promoteItem.name}
                            </Link>
                        )}
                    </>
                )}
            </nav>

            <div className="px-4 py-2">
                <a
                    href="https://wiki.rubinot.com/pt-BR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer"
                >
                    <ExternalLink className="w-5 h-5" />
                    RubinOT Wiki
                </a>
            </div>

            <div className="p-4 border-t border-zinc-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
