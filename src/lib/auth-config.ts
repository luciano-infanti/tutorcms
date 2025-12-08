import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getUserRole } from "@/config/roles"
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Server-side Supabase client with admin privileges
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false

            try {
                // Check if user exists
                const { data: existingUser, error: fetchError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', user.email)
                    .maybeSingle()

                if (fetchError) {
                    console.error('Error fetching user:', fetchError)
                    // Allow sign-in even if DB check fails
                    return true
                }

                if (!existingUser) {
                    // Generate a UUID for the new user
                    const userId = crypto.randomUUID()

                    // Create new user
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert({
                            id: userId,
                            email: user.email,
                            role: getUserRole(user.email),
                            avatar_url: user.image || null,
                        })

                    if (insertError) {
                        console.error('Error creating user:', insertError)
                        // Still allow sign-in even if DB insert fails
                        // This prevents blocking authentication
                    }
                } else {
                    // Update avatar and role if user exists
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({
                            avatar_url: user.image || null,
                            role: getUserRole(user.email)
                        })
                        .eq('email', user.email)

                    if (updateError) {
                        console.error('Error updating user:', updateError)
                    }
                }

                return true
            } catch (error) {
                console.error('SignIn callback error:', error)
                // Don't block sign-in on DB errors
                return true
            }
        },
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
        signIn: '/',
    },
}
