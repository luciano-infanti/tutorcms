import React, { memo } from 'react'

export const HighlightedText = memo(({ text, highlight }: { text: string; highlight?: string }) => {
    if (!highlight || !highlight.trim()) return <>{text}</>

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-gray-900 dark:text-yellow-100 rounded-sm px-0.5 font-medium">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    )
})

HighlightedText.displayName = 'HighlightedText'
