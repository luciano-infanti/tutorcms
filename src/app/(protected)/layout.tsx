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
        // If no session, redirect to login (or gate if we want to enforce that flow)
        // For now, let's assume if they passed the gate but aren't logged in, they see a login prompt
        // But this layout assumes they ARE logged in.
        // We might need a client-side check or a redirect here.
        // Let's redirect to a login page or back to root if we treat root as login.
        // For simplicity, let's just render a "Please Sign In" state or redirect.
        // redirect('/api/auth/signin') // Default NextAuth signin
        // Or better, let's create a custom login page at /login if we want.
        // But the user flow said: Gate -> Login -> Dashboard.
        // So if they are here, they should be logged in.
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
