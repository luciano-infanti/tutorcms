import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    const session = await getServerSession()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { questionId, reason } = await request.json()

        if (!reason || reason.trim().length === 0) {
            return NextResponse.json({ error: 'Reason is required' }, { status: 400 })
        }

        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Insert report
        const { error } = await supabase
            .from('reports')
            .insert({
                user_id: userData.id,
                question_id: questionId,
                reason: reason.trim(),
                status: 'pending'
            })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Report error:', error)
        return NextResponse.json({ error: 'Failed to report' }, { status: 500 })
    }
}
