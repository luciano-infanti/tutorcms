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
            .from('global_settings')
            .select('*')
            .limit(1)
            .maybeSingle()

        if (error && error.code !== 'PGRST116') throw error

        return NextResponse.json(data || { banner_message: '', is_banner_active: false })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession()
    const role = (session?.user as any)?.role

    if (role !== 'GM') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { message, isActive } = await request.json()

        // Check if settings exist
        const { data: existing } = await supabase
            .from('global_settings')
            .select('id')
            .limit(1)
            .maybeSingle()

        if (existing) {
            // Update
            const { error } = await supabase
                .from('global_settings')
                .update({
                    banner_message: message,
                    is_banner_active: isActive,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)

            if (error) throw error
        } else {
            // Insert
            const { error } = await supabase
                .from('global_settings')
                .insert({
                    banner_message: message,
                    is_banner_active: isActive
                })

            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
