import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { hasPermission, canPromoteToTutor, UserRole } from '@/config/roles'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Fetch all Players (for promotion interface)
export async function GET() {
    const session = await getServerSession()
    const actorRole = (session?.user as any)?.role as UserRole

    // Only users with promotion permission can access
    if (!hasPermission(actorRole, 'canPromotePlayerToTutor')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Player')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ users: data || [] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST: Promote a Player to Tutor
export async function POST(req: Request) {
    const session = await getServerSession()
    const actorRole = (session?.user as any)?.role as UserRole

    // Only users with promotion permission can promote
    if (!hasPermission(actorRole, 'canPromotePlayerToTutor')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { userId } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Fetch the target user to verify they are a Player
        const { data: targetUser, error: fetchError } = await supabase
            .from('users')
            .select('role, email')
            .eq('id', userId)
            .single()

        if (fetchError || !targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const targetRole = targetUser.role as UserRole

        // Verify the promotion is valid (only Player -> Tutor)
        if (!canPromoteToTutor(actorRole, targetRole)) {
            return NextResponse.json(
                { error: 'Can only promote Players to Tutor' },
                { status: 403 }
            )
        }

        // Perform the promotion
        const { error } = await supabase
            .from('users')
            .update({ role: 'Tutor' })
            .eq('id', userId)

        if (error) throw error

        return NextResponse.json({ 
            success: true, 
            message: `${targetUser.email} has been promoted to Tutor` 
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

