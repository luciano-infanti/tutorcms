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
                    // Update avatar and last_seen if user exists
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({
                            avatar_url: user.image || null,
                            last_seen: new Date().toISOString(),
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
            // Always fetch the latest role from the database
            // This ensures role changes are reflected immediately
            const email = user?.email || token?.email as string
            
            // #region agent log
            const fs = require('fs');
            const logEntry = {location:'auth-config.ts:jwt',message:'JWT callback',data:{hasUser:!!user,userEmail:user?.email,tokenEmail:token?.email,resolvedEmail:email},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'};
            try { fs.appendFileSync('c:\\Users\\lucia\\tutorcms\\.cursor\\debug.log', JSON.stringify(logEntry) + '\n'); } catch(e) {}
            // #endregion
            
            if (email) {
                const { data: dbUser } = await supabase
                    .from('users')
                    .select('role')
                    .eq('email', email)
                    .single()

                // #region agent log
                const logEntry2 = {location:'auth-config.ts:jwt-role',message:'JWT role fetch',data:{email,dbUserRole:dbUser?.role,dbUserRoleType:typeof dbUser?.role},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'};
                try { fs.appendFileSync('c:\\Users\\lucia\\tutorcms\\.cursor\\debug.log', JSON.stringify(logEntry2) + '\n'); } catch(e) {}
                // #endregion

                if (dbUser) {
                    token.role = dbUser.role
                } else {
                    // Fallback to config role only if DB fetch fails
                    token.role = getUserRole(email)
                }
            }
            
            // Store email in token for subsequent calls
            if (user?.email) {
                token.email = user.email
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

