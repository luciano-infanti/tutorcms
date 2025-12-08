import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client
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

        // Get user ID from email
        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if already voted
        const { data: existingVote } = await supabase
            .from('votes')
            .select('id')
            .eq('user_id', userData.id)
            .eq('question_id', questionId)
            .single()

        if (existingVote) {
            // Unvote (Delete vote)
            const { error: deleteError } = await supabase
                .from('votes')
                .delete()
                .eq('id', existingVote.id)

            if (deleteError) throw deleteError

            // Decrement score
            const { error: scoreError } = await supabase.rpc('decrement_question_score', {
                question_id: questionId
            })

            if (scoreError) {
                // Fallback: manual decrement
                const { data: question } = await supabase
                    .from('questions')
                    .select('score')
                    .eq('id', questionId)
                    .single()

                if (question) {
                    await supabase
                        .from('questions')
                        .update({ score: Math.max(0, (question.score || 0) - 1) })
                        .eq('id', questionId)
                }
            }

            return NextResponse.json({ success: true, voted: false })
        }

        // Insert vote
        const { error: voteError } = await supabase
            .from('votes')
            .insert({
                user_id: userData.id,
                question_id: questionId,
                vote_type: 1
            })

        if (voteError) throw voteError

        // Increment score
        const { error: scoreError } = await supabase.rpc('increment_question_score', {
            question_id: questionId
        })

        if (scoreError) {
            // Fallback: manual increment
            const { data: question } = await supabase
                .from('questions')
                .select('score')
                .eq('id', questionId)
                .single()

            if (question) {
                await supabase
                    .from('questions')
                    .update({ score: (question.score || 0) + 1 })
                    .eq('id', questionId)
            }
        }

        return NextResponse.json({ success: true, voted: true })
    } catch (error) {
        console.error('Vote error:', error)
        return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
    }
}
