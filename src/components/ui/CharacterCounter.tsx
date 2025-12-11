import React from 'react'

interface CharacterCounterProps {
    current: number
    max: number
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({ current, max }) => {
    const percentage = Math.min((current / max) * 100, 100)
    const isNearLimit = percentage > 80
    const isOverLimit = current > max

    // Calculate stroke dash array for circular progress
    const radius = 10
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
        <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="12"
                        cy="12"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="12"
                        cy="12"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className={`transition-all duration-300 ${isOverLimit
                                ? 'text-red-500'
                                : isNearLimit
                                    ? 'text-yellow-500'
                                    : 'text-blue-500'
                            }`}
                    />
                </svg>
            </div>
            <span className={`text-xs font-medium ${isOverLimit
                    ? 'text-red-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                {current}/{max}
            </span>
        </div>
    )
}
