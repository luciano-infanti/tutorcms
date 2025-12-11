import { GoogleGenerativeAI } from '@google/generative-ai'

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
        if (!apiKey) {
            console.error('AI Rewrite Error: Missing API Key')
            return NextResponse.json({ error: 'Server configuration error: Missing AI API Key' }, { status: 500 })
        }

        const { text, type } = await req.json()

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 })
        }

        // Re-initialize to ensure key is picked up if env vars loaded late
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

        let prompt = ''
        if (type === 'question') {
            prompt = `Rewrite the following question in Portuguese (Brazil) for a Tibia MMORPG FAQ.
            Rules:
            1. Maximum 248 characters.
            2. Formal but natural tone (not excessive).
            3. Use correct Tibia terminology.
            4. Keep it concise and direct.
            5. No line breaks, keep everything in a single paragraph.
            
            Original: "${text}"
            
            Rewritten:`
        } else {
            prompt = `Rewrite the following answer in Portuguese (Brazil) for a Tibia MMORPG FAQ.
            Rules:
            1. Maximum 248 characters.
            2. Formal but natural tone (not excessive).
            3. Use correct Tibia terminology.
            4. Fix grammar and clarity.
            5. No line breaks, keep everything in a single paragraph.
            
            Original: "${text}"
            
            Rewritten:`
        }

        const result = await model.generateContent(prompt)
        const response = await result.response
        const rewrittenText = response.text()

        return NextResponse.json({ rewritten: rewrittenText.trim() })
    } catch (error: any) {
        // Log just the message and name to avoid truncation
        console.error('AI_REWRITE_ERROR:', error.name, error.message)

        if (error.message?.includes('User location is not supported')) {
            return NextResponse.json({
                error: 'AI features are not available in your region (Google Gemini restriction).',
                details: error.message
            }, { status: 403 })
        }

        return NextResponse.json({
            error: 'Failed to rewrite text',
            details: error.message
        }, { status: 500 })
    }
}
