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
        const { questionId } = await request.json()

        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if already pinned
        const { data: existingPin } = await supabase
            .from('pinned_questions')
            .select('*')
            .eq('user_id', userData.id)
            .eq('question_id', questionId)
            .single()

        if (existingPin) {
            // Unpin
            await supabase
                .from('pinned_questions')
                .delete()
                .eq('user_id', userData.id)
                .eq('question_id', questionId)

            return NextResponse.json({ success: true, pinned: false })
        } else {
            // Pin
            await supabase
                .from('pinned_questions')
                .insert({
                    user_id: userData.id,
                    question_id: questionId
                })

            return NextResponse.json({ success: true, pinned: true })
        }
    } catch (error) {
        console.error('Pin error:', error)
        return NextResponse.json({ error: 'Failed to pin' }, { status: 500 })
    }
}

export async function GET() {
    const session = await getServerSession()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (!userData) {
            return NextResponse.json({ pinnedIds: [] })
        }

        const { data: pins } = await supabase
            .from('pinned_questions')
            .select('question_id')
            .eq('user_id', userData.id)

        const pinnedIds = pins?.map(p => p.question_id) || []

        return NextResponse.json({ pinnedIds })
    } catch (error) {
        console.error('Get pins error:', error)
        return NextResponse.json({ pinnedIds: [] })
    }
}
