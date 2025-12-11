import React from 'react'
import { HighlightedText } from '@/components/ui/HighlightedText'
import {
    KEYWORDS as TIBIA_KEYWORDS,
    RUBINOT_KEYWORDS,
    TIBIA_WIKI_URL,
    RUBINOT_WIKI_URL
} from '@/config/wiki-keywords'

interface WikiLinkerProps {
    text: string
    highlight?: string
    className?: string
}

export function WikiLinker({ text, highlight, className }: WikiLinkerProps) {
    if (!text) return null

    // Combine all keys for the regex
    const allKeys = [...Object.keys(RUBINOT_KEYWORDS), ...Object.keys(TIBIA_KEYWORDS)]

    // Create a regex pattern from keywords
    // Sort by length (descending) to match longest first to avoid partial matches
    const patterns = allKeys
        .sort((a, b) => b.length - a.length)
        .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')

    const regex = new RegExp(`(${patterns})`, 'gi')

    const parts = text.split(regex)

    const getLinkData = (textPart: string) => {
        const lowerPart = textPart.toLowerCase()

        // Check RubinOT first (priority)
        const rubinotKey = Object.keys(RUBINOT_KEYWORDS).find(k => k.toLowerCase() === lowerPart)
        if (rubinotKey) {
            const slug = RUBINOT_KEYWORDS[rubinotKey]
            const url = slug ? `${RUBINOT_WIKI_URL}/${slug}` : RUBINOT_WIKI_URL
            return { url, type: 'rubinot' }
        }

        // Check Tibia
        const tibiaKey = Object.keys(TIBIA_KEYWORDS).find(k => k.toLowerCase() === lowerPart)
        if (tibiaKey) {
            const slug = TIBIA_KEYWORDS[tibiaKey]
            const url = slug ? `${TIBIA_WIKI_URL}/${slug}` : TIBIA_WIKI_URL
            return { url, type: 'tibia' }
        }

        return null
    }

    return (
        <span className={className}>
            {parts.map((part, i) => {
                const linkData = getLinkData(part)

                if (linkData) {
                    const isRubinot = linkData.type === 'rubinot'
                    return (
                        <a
                            key={i}
                            href={linkData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-[3px] py-0.5 rounded border border-white/10 bg-white/5 text-gray-200 text-xs font-medium hover:bg-white/10 transition-colors mx-0.5"
                            onClick={(e) => e.stopPropagation()} // Prevent card click
                            title={isRubinot ? 'RubinOT Wiki' : 'Tibia Wiki'}
                        >
                            <HighlightedText text={part} highlight={highlight || ''} />
                        </a>
                    )
                }

                return <HighlightedText key={i} text={part} highlight={highlight || ''} />
            })}
        </span>
    )
}
