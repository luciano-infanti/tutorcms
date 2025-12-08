import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession()

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
                <div className="text-center space-y-6 p-8 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl max-w-md w-full">
                    <h1 className="text-2xl font-bold">Authentication Required</h1>
                    <p className="text-zinc-400">You must sign in with your Google account to access the dashboard.</p>

                    <a
                        href="/api/auth/signin"
                        className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
                    >
                        Sign in with Google
                    </a>
                </div>
            </div>
        )
    }

    // We can pass the role to the sidebar
    const userRole = (session?.user as any)?.role

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
            <Sidebar userRole={userRole} />
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
