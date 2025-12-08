import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const body = await request.json()
    const { password } = body

    const CORRECT_PASSWORD = process.env.SITE_ACCESS_PASSWORD || 'teste123'

    if (password === CORRECT_PASSWORD) {
        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('site_access_token', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        })

        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
}
