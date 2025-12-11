import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getUserRole } from "@/config/roles"
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Server-side Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Server-side Supabase client with admin privileges
// We use a lazy initialization or check to prevent build-time crashes if env vars are missing
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null as any

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
                    // Update avatar if user exists (do NOT overwrite role)
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({
                            avatar_url: user.image || null,
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
                // Fetch the latest role from the database to ensure the token is up to date
                // This allows role changes in the DB to be reflected in the session upon sign in
                const { data: dbUser } = await supabase
                    .from('users')
                    .select('role')
                    .eq('email', user.email)
                    .single()

                if (dbUser) {
                    token.role = dbUser.role
                } else {
                    // Fallback to config role only if DB fetch fails (shouldn't happen for valid users)
                    token.role = getUserRole(user.email)
                }
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
