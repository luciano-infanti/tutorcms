import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    value: string
    label: string
}

interface CustomDropdownProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    allowCreate?: boolean
    onCreate?: (value: string) => void
}

export function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
    allowCreate = false,
    onCreate
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    )

    const selectedOption = options.find(opt => opt.value === value)

    const handleCreate = () => {
        if (onCreate && search.trim()) {
            onCreate(search.trim())
            setIsOpen(false)
            setSearch('')
        }
    }

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 bg-white dark:bg-gemini-surface border border-light-border dark:border-gemini-surfaceHighlight rounded-xl flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            >
                <span className={cn("block truncate", !selectedOption && "text-gray-400 dark:text-gray-500")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "transform rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gemini-surface border border-light-border dark:border-gemini-surfaceHighlight rounded-xl max-h-60 overflow-hidden flex flex-col animate-fade-in">
                    <div className="p-2 border-b border-light-border dark:border-gemini-surfaceHighlight sticky top-0 bg-white dark:bg-gemini-surface">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gemini-bg rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-light-text dark:text-gemini-text"
                                placeholder="Search..."
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-1">
                        {filteredOptions.length === 0 ? (
                            allowCreate && search.trim() ? (
                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    className="w-full px-3 py-2 text-left text-sm rounded-lg flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create "{search}"
                                </button>
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-400 text-center">No results found</div>
                            )
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                        setSearch('')
                                    }}
                                    className={cn(
                                        "w-full px-3 py-2 text-left text-sm rounded-lg flex items-center justify-between transition-colors",
                                        value === option.value
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                            : "hover:bg-gray-50 dark:hover:bg-white/5 text-light-text dark:text-gemini-text cursor-pointer"
                                    )}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {value === option.value && <Check className="w-4 h-4" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
