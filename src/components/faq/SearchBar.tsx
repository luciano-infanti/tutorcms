'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-zinc-600 transition-all"
            />
        </div>
    )
}
