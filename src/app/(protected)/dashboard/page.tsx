'use client'

import { useState, useMemo } from 'react'
import { QuestionCard } from '@/components/faq/QuestionCard'
import { SearchBar } from '@/components/faq/SearchBar'
import { FilterTabs } from '@/components/faq/FilterTabs'

// Mock Data
const MOCK_QUESTIONS = [
    { id: '1', question: 'How do I report a bug?', answer: 'Use the /report command in-game or visit the Report section here.', category: 'General', score: 10 },
    { id: '2', question: 'What are the rules for GMs?', answer: 'GMs must follow the Code of Conduct found in the Documents section.', category: 'Rules', score: 25 },
    { id: '3', question: 'How to spawn a boss?', answer: 'Use the /spawn [bossname] command. Only available for Senior Tutors+.', category: 'Commands', score: 5 },
    { id: '4', question: 'Where can I find the loot tables?', answer: 'Loot tables are available on the official wiki or via the /loot command.', category: 'Gameplay', score: 15 },
    { id: '5', question: 'How to ban a botter?', answer: 'Record proof and use the /ban command. Ensure you have 100% certainty.', category: 'Moderation', score: 30 },
]

const CATEGORIES = ['General', 'Rules', 'Commands', 'Gameplay', 'Moderation']

export default function DashboardPage() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')

    const filteredQuestions = useMemo(() => {
        return MOCK_QUESTIONS.filter(q => {
            const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
                q.answer.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = category === 'All' || q.category === category
            return matchesSearch && matchesCategory
        }).sort((a, b) => b.score - a.score)
    }, [search, category])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
                    <p className="text-zinc-400">Find answers to common questions.</p>
                </div>

                <SearchBar value={search} onChange={setSearch} />

                <FilterTabs
                    categories={CATEGORIES}
                    selected={category}
                    onSelect={setCategory}
                />
            </div>

            <div className="grid gap-4">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map(q => (
                        <QuestionCard
                            key={q.id}
                            {...q}
                            onVote={(id) => console.log('Vote', id)}
                            onPin={(id) => console.log('Pin', id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 text-zinc-500">
                        No questions found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    )
}
