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
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ users: data || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (role !== 'GM') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { userId, role: newRole, character_name, server } = await req.json()

        const { error } = await supabase
            .from('users')
            .update({ role: newRole, character_name, server })
            .eq('id', userId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (role !== 'GM') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('id')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Delete user from Supabase Auth (if using Supabase Auth) and public.users table
        // Since we are using NextAuth with custom users table, we just delete from public.users
        // If there are foreign key constraints (e.g. votes, suggestions), we might need to handle them or rely on cascade delete
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
