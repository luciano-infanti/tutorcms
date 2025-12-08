import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'questions.json')
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const questions = JSON.parse(fileContent)

        const formattedQuestions = questions.map((q: any) => ({
            question_text: q.question,
            answer_text: q.answer,
            category: q.category,
            is_approved: true,
            score: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }))

        // Insert in batches of 100 to avoid hitting limits
        const batchSize = 100
        let insertedCount = 0
        let errors = []

        for (let i = 0; i < formattedQuestions.length; i += batchSize) {
            const batch = formattedQuestions.slice(i, i + batchSize)
            const { error } = await supabaseAdmin.from('questions').insert(batch)

            if (error) {
                console.error('Error inserting batch:', error)
                errors.push(error)
            } else {
                insertedCount += batch.length
            }
        }

        if (errors.length > 0) {
            return NextResponse.json({ success: false, inserted: insertedCount, errors }, { status: 500 })
        }

        return NextResponse.json({ success: true, inserted: insertedCount })
    } catch (error) {
        console.error('Seeding error:', error)
        return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 })
    }
}
