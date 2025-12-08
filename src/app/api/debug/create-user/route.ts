import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
    const session = await getServerSession()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .maybeSingle()

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'User already exists',
                userId: existingUser.id
            })
        }

        // Create user
        const userId = crypto.randomUUID()
        const { data, error } = await supabase
            .from('users')
            .insert({
                id: userId,
                email: session.user.email,
                role: 'Tutor', // Default role
                avatar_url: session.user.image || null,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                details: error
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'User created successfully!',
            user: data
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
