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
        const { characterName, server } = await request.json()

        // Check for uniqueness
        if (characterName) {
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('character_name', characterName)
                .neq('email', session.user.email)
                .single()

            if (existingUser) {
                return NextResponse.json({ error: 'Character name is already taken.' }, { status: 400 })
            }
        }

        // Update user profile
        const { error } = await supabase
            .from('users')
            .update({
                character_name: characterName,
                server: server
            })
            .eq('email', session.user.email)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}

export async function GET() {
    const session = await getServerSession()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('character_name, server')
            .eq('email', session.user.email)
            .single()

        if (error) throw error

        return NextResponse.json({
            characterName: data?.character_name || '',
            server: data?.server || 'Auroria'
        })
    } catch (error) {
        console.error('Profile fetch error:', error)
        return NextResponse.json({
            characterName: '',
            server: 'Auroria'
        })
    }
}
