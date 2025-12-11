'use client'

import { useState, useEffect } from 'react'

interface TypewriterPlaceholderProps {
    phrases: string[]
    typingSpeed?: number
    deletingSpeed?: number
    pauseDuration?: number
}

export function useTypewriter({
    phrases,
    typingSpeed = 10,
    deletingSpeed = 5,
    pauseDuration = 1000
}: TypewriterPlaceholderProps) {
    const [text, setText] = useState('')
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex]

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                setText(currentPhrase.substring(0, text.length + 1))

                // Finished typing
                if (text.length === currentPhrase.length) {
                    setTimeout(() => setIsDeleting(true), pauseDuration)
                }
            } else {
                // Deleting
                setText(currentPhrase.substring(0, text.length - 1))

                // Finished deleting
                if (text.length === 0) {
                    setIsDeleting(false)
                    setPhraseIndex((prev) => (prev + 1) % phrases.length)
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed)

        return () => clearTimeout(timeout)
    }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration])

    return text
}
