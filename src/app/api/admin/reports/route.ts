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

    if (role !== 'GM') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { data, error } = await supabase
            .from('reports')
            .select(`
        *,
        question:questions(question_text)
      `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ reports: data || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (role !== 'GM') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { reportId, status } = await request.json()

        const { error } = await supabase
            .from('reports')
            .update({ status })
            .eq('id', reportId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
