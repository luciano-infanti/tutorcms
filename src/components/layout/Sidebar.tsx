'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, FileText, Shield, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

const navItems = [
    { name: 'FAQ Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Documents', href: '/documents', icon: FileText },
]

const adminItem = { name: 'Admin Panel', href: '/admin', icon: Shield }

export function Sidebar({ userRole }: { userRole?: string }) {
    const pathname = usePathname()
    const isAdmin = userRole === 'GM'

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
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    )
                })}

                {isAdmin && (
                    <>
                        <div className="my-4 border-t border-zinc-800" />
                        <Link
                            href={adminItem.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                pathname === adminItem.href
                                    ? "bg-red-500/10 text-red-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                            )}
                        >
                            <Shield className="w-5 h-5" />
                            {adminItem.name}
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-zinc-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
