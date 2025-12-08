import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { ROLES, getUserRole } from "@/config/roles"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = getUserRole(user.email)
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role
            }
            return session
        },
    },
    pages: {
        signIn: '/', // Redirect to gate if trying to sign in (or we can make a custom signin page)
        // Actually, after gate, we probably want a specific login button.
        // Let's keep it default for now or redirect to a custom login page if needed.
    },
})

export { handler as GET, handler as POST }
