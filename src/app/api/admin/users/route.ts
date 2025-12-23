import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { hasPermission, canManageUser, UserRole } from '@/config/roles'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const session = await getServerSession()
    const actorRole = (session?.user as any)?.role as UserRole

    // Only CM and GM can access user management
    if (!hasPermission(actorRole, 'canViewAdminDashboard')) {
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
    const actorRole = (session?.user as any)?.role as UserRole

    // Only CM and GM can update users
    if (!hasPermission(actorRole, 'canViewAdminDashboard')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { userId, role: newRole, character_name, server } = await req.json()

        // Fetch the target user to check their current role
        const { data: targetUser, error: fetchError } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single()

        if (fetchError || !targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const targetRole = targetUser.role as UserRole

        // Check if actor can manage this user (CM immunity rule)
        if (!canManageUser(actorRole, targetRole)) {
            return NextResponse.json(
                { error: 'You do not have permission to modify this user' },
                { status: 403 }
            )
        }

        // Additional check: GM cannot promote someone to CM
        if (actorRole === 'GM' && newRole === 'CM') {
            return NextResponse.json(
                { error: 'Only CMs can assign the CM role' },
                { status: 403 }
            )
        }

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
    const actorRole = (session?.user as any)?.role as UserRole

    // Only CM and GM can delete users
    if (!hasPermission(actorRole, 'canViewAdminDashboard')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('id')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Fetch the target user to check their role
        const { data: targetUser, error: fetchError } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single()

        if (fetchError || !targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const targetRole = targetUser.role as UserRole

        // Check if actor can manage this user (CM immunity rule)
        if (!canManageUser(actorRole, targetRole)) {
            return NextResponse.json(
                { error: 'You do not have permission to delete this user' },
                { status: 403 }
            )
        }

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
