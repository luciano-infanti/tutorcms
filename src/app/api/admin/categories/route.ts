import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { hasPermission } from '@/config/roles'

// Admin Client for performing sensitive operations (like updating multiple questions)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to check GM permission
async function checkGMPermission() {
    const session = await getServerSession()
    const role = (session?.user as any)?.role
    // Categories management is currently GM only per "GMS can..." request
    if (role !== 'GM') {
        return { authorized: false }
    }
    return { authorized: true }
}

export async function GET() {
    try {
        const { authorized } = await checkGMPermission()
        if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

        // 1. Get Categories
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        if (catError) throw catError

        // 2. Get Question Counts (using helper or raw query if easier, but Supabase doesn't have easy count-group-by in client lib without view/rpc)
        // We'll fetch all questions (id, category) to count. For scalability, an RPC is better, but this works for small scale.
        const { data: questions, error: qError } = await supabase
            .from('questions')
            .select('category')

        if (qError) throw qError

        // Map counts
        const counts: Record<string, number> = {}
        questions?.forEach((q: any) => {
            counts[q.category] = (counts[q.category] || 0) + 1
        })

        // Combine
        const result = categories?.map(cat => ({
            ...cat,
            count: counts[cat.name] || 0
        }))

        return NextResponse.json({ categories: result })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { authorized } = await checkGMPermission()
        if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

        const { name } = await request.json()
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

        const { data, error } = await supabase
            .from('categories')
            .insert({ name })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, category: data })

    } catch (error: any) {
        // Handle duplicate name error (23505 is PG code for unique violation)
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const { authorized } = await checkGMPermission()
        if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

        const { id, oldName, newName } = await request.json()
        if (!id || !oldName || !newName) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

        // Update Category Name
        const { error: catError } = await supabase
            .from('categories')
            .update({ name: newName })
            .eq('id', id)

        if (catError) throw catError

        // Sync Questions (Update all questions with oldName to newName)
        const { error: qError } = await supabase
            .from('questions')
            .update({ category: newName })
            .eq('category', oldName)

        if (qError) {
            console.error('Failed to sync questions category:', qError)
            // Note: Use transaction/RPC in real prod for atomicity
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { authorized } = await checkGMPermission()
        if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const name = searchParams.get('name')

        if (!id || !name) return NextResponse.json({ error: 'Missing id or name' }, { status: 400 })

        // 1. Check if questions exist
        const { count, error: countError } = await supabase
            .from('questions') // Assuming 'questions' table
            .select('*', { count: 'exact', head: true }) // head: true only fetches count
            .eq('category', name)

        if (countError) throw countError

        if (count && count > 0) {
            return NextResponse.json({
                error: `Cannot delete category. There are ${count} questions in this category. Please delete or move them first.`
            }, { status: 400 })
        }

        // 2. Delete Category
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
