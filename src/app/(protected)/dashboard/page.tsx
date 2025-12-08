'use client'

import { useState, useMemo, useEffect } from 'react'
import { QuestionCard } from '@/components/faq/QuestionCard'
import { SearchBar } from '@/components/faq/SearchBar'
import { FilterTabs } from '@/components/faq/FilterTabs'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Question = Database['public']['Tables']['questions']['Row']

export default function DashboardPage() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('is_approved', true) // Only show approved questions

            if (error) {
                console.error('Error fetching questions:', error)
            } else {
                setQuestions(data || [])
            }
            setLoading(false)
        }

        fetchQuestions()
    }, [])

    // Extract unique categories from data
    const categories = useMemo(() => {
        const cats = new Set(questions.map(q => q.category))
        return Array.from(cats).sort()
    }, [questions])

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch = q.question_text.toLowerCase().includes(search.toLowerCase()) ||
                q.answer_text.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = category === 'All' || q.category === category
            return matchesSearch && matchesCategory
        }).sort((a, b) => (b.score || 0) - (a.score || 0))
    }, [search, category, questions])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
                    <p className="text-zinc-400">Find answers to common questions.</p>
                </div>

                <SearchBar value={search} onChange={setSearch} />

                <FilterTabs
                    categories={categories}
                    selected={category}
                    onSelect={setCategory}
                />
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12 text-zinc-500">Loading questions...</div>
                ) : filteredQuestions.length > 0 ? (
                    filteredQuestions.map(q => (
                        <QuestionCard
                            key={q.id}
                            id={q.id}
                            question={q.question_text}
                            answer={q.answer_text}
                            category={q.category}
                            score={q.score || 0}
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
