'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const commandsData = [
    { command: '!rubinot', description: 'Recebe seu bônus inicial ao entrar no servidor (exercise weapon e prey wildcard).' },
    { command: '!autoloot', description: 'Ativa e desativa a coleta automática de loot se você possuir uma loot pouch.' },
    { command: '!shared', description: 'Informa o nível mínimo e máximo para jogadores compartilharem exp com você.' },
    { command: '!flask on/off', description: 'Ativa e desativa a criação de vials quando seu personagem usar potions.' },
    { command: '!b', description: 'Envia uma mensagem em vermelho para todos os membros da guild.' },
    { command: '!outfit', description: 'Troca o outfit de todos os membros online da guild (possui cooldown de 5 minutos).' },
    { command: '!dreamcourts', description: 'Informa qual o boss spawnado no dia da quest dreamcourts.' },
    { command: '!carpet', description: 'Move o carpet abaixo de você para a direção do seu personagem.' },
]

const experienceStages = [
    { from: 1, to: 8, multiplier: 50 },
    { from: 9, to: 50, multiplier: 80 },
    { from: 51, to: 100, multiplier: 60 },
    { from: 101, to: 150, multiplier: 40 },
    { from: 151, to: 200, multiplier: 30 },
    { from: 201, to: 300, multiplier: 15 },
    { from: 301, to: 400, multiplier: 12 },
    { from: 401, to: 500, multiplier: 10 },
    { from: 501, to: 600, multiplier: 7 },
    { from: 601, to: 700, multiplier: 6 },
    { from: 701, to: 800, multiplier: 5 },
    { from: 801, to: 900, multiplier: 4 },
    { from: 901, to: 1000, multiplier: 3 },
    { from: 1001, to: 1200, multiplier: 2 },
    { from: 1201, to: 1400, multiplier: 1.5 },
    { from: 1400, to: '???', multiplier: 1.2 },
]

const skillStages = [
    { from: 1, to: 80, multiplier: 10 },
    { from: 81, to: 100, multiplier: 7 },
    { from: 101, to: 120, multiplier: 4 },
    { from: 121, to: 300, multiplier: 2 },
]

const magicStages = [
    { from: 0, to: 80, multiplier: 10 },
    { from: 81, to: 100, multiplier: 7 },
    { from: 101, to: 120, multiplier: 4 },
    { from: 121, to: 130, multiplier: 3 },
    { from: 131, to: 300, multiplier: 2 },
]

const benefitsData = [
    { benefit: 'Cooldown wheel', description: 'Um cooldown 30% menor na passiva Gift of Life e Avatar spell.' },
    { benefit: 'Imbuement protegido', description: 'Nenhum imbuement será consumido dentro de protection zones (inclusive de capacity).' },
    { benefit: 'Automatização exercise', description: 'As exercise weapons irão iniciar automaticamente após o término da anterior.' },
    { benefit: 'Otimização familiars', description: 'Os familiars terão 30% a mais de dano em suas magias.' },
    { benefit: 'Bônus EXP', description: 'Todo monstro derrotado dará um bônus de 10% de experiência.' },
    { benefit: 'Crítico adicional', description: 'Todos os personagens da conta, contarão com 3% a mais de crítico.' },
    { benefit: 'Velocidade exercise', description: 'A velocidade de todas as exercise weapons tem um aumento de 10%.' },
    { benefit: 'Bless completa', description: 'Ao comprar a bless no NPC da Inquisition, o personagem receberá as 7 blesses.' },
    { benefit: 'Regeneração de vida', description: 'Há uma regeneração adicional de 10 de vida a cada 3 segundos.' },
    { benefit: 'Regeneração de mana', description: 'Há uma regeneração adicional de 20 de mana a cada 3 segundos.' },
    { benefit: 'Prioridade no login', description: 'Caso o servidor conte com fila, o jogador terá prioridade na posição da mesma.' },
    { benefit: 'Ausência de casa', description: 'Ao invés de 7 dias offline, o jogador poderá ficar 10 dias offline.' },
    { benefit: 'Bônus de Proficiency', description: 'Recebe uma experiência adicional de 10% no weapon proficiency.' },
]

export default function ServerInfoPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-zinc-100">Server Information</h1>
                <p className="text-zinc-400">
                    Useful commands, server rates, and benefits.
                </p>
            </div>

            {/* Commands Section */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl text-indigo-400">Player Commands</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="text-zinc-300 w-[200px]">Command</TableHead>
                                <TableHead className="text-zinc-300">Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commandsData.map((cmd, i) => (
                                <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-mono text-indigo-300">{cmd.command}</TableCell>
                                    <TableCell className="text-zinc-400">{cmd.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Rates Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience */}
                <Card className="bg-zinc-900 border-zinc-800 md:row-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl text-indigo-400">Experience Stages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableHead className="text-zinc-300">From Level</TableHead>
                                    <TableHead className="text-zinc-300">To Level</TableHead>
                                    <TableHead className="text-zinc-300 text-right">Multiplier</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {experienceStages.map((stage, i) => (
                                    <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="text-zinc-400">{stage.from}</TableCell>
                                        <TableCell className="text-zinc-400">{stage.to}</TableCell>
                                        <TableCell className="text-indigo-300 text-right font-mono">{stage.multiplier}x</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Skill */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-indigo-400">Skill Rates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableHead className="text-zinc-300">From Level</TableHead>
                                        <TableHead className="text-zinc-300">To Level</TableHead>
                                        <TableHead className="text-zinc-300 text-right">Multiplier</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {skillStages.map((stage, i) => (
                                        <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/50">
                                            <TableCell className="text-zinc-400">{stage.from}</TableCell>
                                            <TableCell className="text-zinc-400">{stage.to}</TableCell>
                                            <TableCell className="text-indigo-300 text-right font-mono">{stage.multiplier}x</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Magic */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-indigo-400">Magic Rates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableHead className="text-zinc-300">From Level</TableHead>
                                        <TableHead className="text-zinc-300">To Level</TableHead>
                                        <TableHead className="text-zinc-300 text-right">Multiplier</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {magicStages.map((stage, i) => (
                                        <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/50">
                                            <TableCell className="text-zinc-400">{stage.from}</TableCell>
                                            <TableCell className="text-zinc-400">{stage.to}</TableCell>
                                            <TableCell className="text-indigo-300 text-right font-mono">{stage.multiplier}x</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Other Rates */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-indigo-400">Other Rates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                                <span className="text-zinc-400">Loot</span>
                                <span className="text-indigo-300 font-mono">2.5x</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                                <span className="text-zinc-400">Bestiary</span>
                                <span className="text-indigo-300 font-mono">2x</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Benefits Section */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl text-indigo-400">Server Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="text-zinc-300 w-[250px]">Benefit</TableHead>
                                <TableHead className="text-zinc-300">Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {benefitsData.map((benefit, i) => (
                                <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-medium text-indigo-300">{benefit.benefit}</TableCell>
                                    <TableCell className="text-zinc-400">{benefit.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
