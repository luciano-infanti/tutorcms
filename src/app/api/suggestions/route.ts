import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client
// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null as any

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    const session = await getServerSession()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { type, content, questionId } = await request.json()

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        if (!supabase) {
            console.error('Supabase client not initialized (missing env vars)')
            return NextResponse.json({ error: 'Internal configuration error' }, { status: 500 })
        }

        // Get user ID from email
        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { error } = await supabase
            .from('suggestions')
            .insert({
                user_id: userData.id,
                type,
                content,
                question_id: questionId || null,
                status: 'pending'
            })

        if (error) {
            console.error('Error creating suggestion:', error)
            return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Internal error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
