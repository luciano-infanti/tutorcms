'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Snackbar } from '@/components/ui/Snackbar'
import { QuestionCard } from '@/components/faq/QuestionCard'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const defaultMessages = [
    {
        id: 'advertising-rules',
        title: 'Advertising Rules',
        content: 'Anúncios de Compra / Venda / Troca / Casa Aberta / Live / Recrutamento de membros para guild, deverão ser feitos SOMENTE NO ADVERTISING! Obrigado.',
        category: 'Rules'
    },
    {
        id: 'help-channel-rules',
        title: 'Help Channel Rules',
        content: 'O canal Help é exclusivo para dúvidas sobre o jogo. Por favor, utilize outros canais para conversas ou comércio.',
        category: 'Rules'
    },
    {
        id: 'respect-rules',
        title: 'Respect Rules',
        content: 'Por favor, mantenha o respeito com todos os jogadores. Ofensas e discursos de ódio não são tolerados.',
        category: 'Rules'
    }
]

export default function ExtrasPage() {
    const { data: session } = useSession()
    const userRole = (session?.user as any)?.role
    const isGM = userRole === 'GM'

    const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' | 'info'; isOpen: boolean }>({
        message: '',
        type: 'success',
        isOpen: false
    })

    const handleVote = async (id: string) => {
        // No-op for extras
    }

    const handleReport = (id: string) => {
        // No-op for extras
    }

    const handleEdit = (id: string) => {
        setSnackbar({ message: 'Editing extras is not implemented yet.', type: 'info', isOpen: true })
    }

    const handleDelete = (id: string) => {
        setSnackbar({ message: 'Deleting extras is not implemented yet.', type: 'info', isOpen: true })
    }

    const handleCopy = () => {
        setSnackbar({ message: 'Copied to clipboard!', type: 'success', isOpen: true })
    }

    return (
        <div className="space-y-8 p-6 pb-20 pt-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-zinc-100">Extras</h1>
                    <p className="text-zinc-400">
                        Common messages and resources for quick access.
                    </p>
                </div>
                {isGM && (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Message
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {defaultMessages.map((msg) => (
                    <QuestionCard
                        key={msg.id}
                        id={msg.id}
                        question={msg.title}
                        answer={msg.content}
                        category={msg.category}
                        score={0}
                        onVote={handleVote}
                        onReport={handleReport}
                        onEdit={isGM ? handleEdit : undefined}
                        onDelete={isGM ? handleDelete : undefined}
                        onCopy={handleCopy}
                    />
                ))}
            </div>

            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
                />
            )}
        </div>
    )
}
