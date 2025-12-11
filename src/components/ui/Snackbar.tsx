'use client'

import { useEffect, useState, useRef } from 'react'
import { Check, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SnackbarProps {
    message: string
    type?: 'success' | 'error' | 'info'
    onClose: () => void
    duration?: number
}

export function Snackbar({ message, type = 'success', onClose, duration = 3000 }: SnackbarProps) {
    const [progress, setProgress] = useState(100)

    const onCloseRef = useRef(onClose)

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        const startTime = Date.now()

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
            setProgress(remaining)

            if (remaining === 0) {
                clearInterval(timer)
                onCloseRef.current()
            }
        }, 16)

        return () => clearInterval(timer)
    }, [duration])

    const icons = {
        success: <Check className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Check className="w-5 h-5 text-blue-500" />
    }

    const progressColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-fade-in-up">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg flex items-center gap-3 min-w-[300px] relative overflow-hidden">
                <div
                    className={cn("absolute bottom-0 left-0 h-1 transition-all duration-75 ease-linear", progressColors[type])}
                    style={{ width: `${progress}%` }}
                />
                {icons[type]}
                <span className="font-medium text-sm">{message}</span>
                <button onClick={onClose} className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        </div>
    )
}
