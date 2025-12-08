import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const session = await getServerSession()

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        // Check if user exists in database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle()

        if (error) {
            return NextResponse.json({
                exists: false,
                email: session.user.email,
                error: error.message
            })
        }

        if (!user) {
            return NextResponse.json({
                exists: false,
                email: session.user.email,
                message: 'User not found in database'
            })
        }

        return NextResponse.json({
            exists: true,
            user: user,
            email: session.user.email
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}
