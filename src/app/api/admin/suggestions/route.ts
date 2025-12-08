import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    // Allow GMs and Senior Tutors to view suggestions, or just GMs?
    // User said "GMs need to see suggestions".
    if (role !== 'GM' && role !== 'Senior Tutor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { data, error } = await supabase
            .from('suggestions')
            .select(`
                *,
                user:users(email, character_name),
                question:questions(question_text)
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ suggestions: data || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (role !== 'GM' && role !== 'Senior Tutor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { suggestionId, status } = await request.json()

        const { error } = await supabase
            .from('suggestions')
            .update({ status })
            .eq('id', suggestionId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
