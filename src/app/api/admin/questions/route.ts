import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { hasPermission } from '@/config/roles'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (!hasPermission(role, 'canViewAdminDashboard')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ questions: data || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (!hasPermission(role, 'canCreateQuestions')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { question_text, answer_text, category } = await request.json()

        const { error } = await supabase
            .from('questions')
            .insert({
                question_text,
                answer_text,
                category,
                is_approved: true,
                score: 0
            })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (!hasPermission(role, 'canEditQuestions')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { id, question_text, answer_text, category } = await request.json()

        const { error } = await supabase
            .from('questions')
            .update({
                question_text,
                answer_text,
                category,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (!hasPermission(role, 'canDeleteQuestions')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        const { error } = await supabase
            .from('questions')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
