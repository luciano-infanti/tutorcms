'use client'

import { cn } from '@/lib/utils'

interface FilterTabsProps {
    categories: string[]
    selected: string
    onSelect: (category: string) => void
}

export function FilterTabs({ categories, selected, onSelect }: FilterTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onSelect('All')}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    selected === 'All'
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                )}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                        selected === cat
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}
