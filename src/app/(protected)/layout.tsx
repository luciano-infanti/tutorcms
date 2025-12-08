import { getServerSession } from "next-auth"
import { TopNavigation } from "@/components/layout/TopNavigation"
import { LoginScreen } from "@/components/auth/LoginScreen"

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession()

    if (!session) {
        return <LoginScreen />
    }

    return (
        <div className="min-h-screen bg-light-bg dark:bg-gemini-bg text-light-text dark:text-gemini-text transition-colors duration-300">
            <TopNavigation />
            <main className="pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-[1920px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
