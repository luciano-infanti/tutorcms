'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const rulesData = [
    {
        category: '1 - Nomes',
        rules: [
            { title: 'A) Nome Violando a Regra de Suporte', description: 'Não crie nomes que imitem ou façam referência ao suporte ou à administração do jogo.' },
            { title: 'B) Nome Ofensivo', description: 'É proibido criar nomes ofensivos ou desrespeitosos.' },
            { title: 'C) Nome Inadequado', description: 'Nomes devem ser apropriados e condizentes com o ambiente de jogo.' },
        ]
    },
    {
        category: '2 - Trapaças',
        rules: [
            { title: 'A) Abuso de Bug', description: 'É proibido explorar ou abusar de bugs no jogo.' },
            { title: 'B) Multiclient', description: 'É proibido usar múltiplos clientes simultaneamente, quando encontradas atividades em mais de um deles.' },
            { title: 'C) Software Ilegal', description: 'Não é permitido o uso de software não autorizado ou ilegal.' },
            { title: 'D) Checagem', description: 'Coopere com as checagens de integridade realizadas pela administração e entenda seu funcionamento.' },
            { title: 'E) Reports', description: 'Envie reports de maneira responsável e verdadeira através do jogo.' },
            { title: 'F) Tolerância', description: 'O servidor tolera automações apenas em momentos de treinamento, como exercise weapons, cabines de trainer e treinar magic level.' },
            { title: 'G) KS, Lure e Trap Red', description: 'A administração não se envolverá em situações de kill stealing, lure ou trap red, a menos que tais ações comprometam seriamente o bom andamento do jogo.' },
            { title: 'H) Automações no RTC', description: 'A utilização de funções para atacar/matar monstros no RTC é permitida, mas não será tolerada quando o jogador estiver ausente.' },
        ]
    },
    {
        category: '3 - Mensagens & Declarações',
        rules: [
            { title: 'A) Ofensivas', description: 'Não toleramos qualquer tipo de assédio, comentários racistas, sexistas, homofóbicos ou qualquer extremismo dentro do jogo.' },
            { title: 'B) Dados Pessoais', description: 'Não compartilhe ou solicite informações pessoais de outros jogadores.' },
            { title: 'C) Publicidade', description: 'É proibido anunciar outros servidores ou produtos comerciais sem permissão.' },
            { title: 'D) Spam', description: 'Não é permitido enviar mensagens repetitivas ou irrelevantes que perturbem a comunicação dentro dos canais públicos do jogo.' },
            { title: 'E) Apoiando Violações de Regra', description: 'Não apoie, incentive ou participe de ações que violem as regras do servidor.' },
        ]
    },
    {
        category: '4 - Vendas',
        rules: [
            { title: 'A) Bazaar', description: 'As transações de personagens devem ocorrer somente através do sistema oficial do Bazaar.' },
            { title: 'B) Tolerância', description: 'A administração possui tolerância zero para transações fraudulentas ou não autorizadas quando divulgadas dentro do jogo.' },
            { title: 'C) Anúncios', description: 'Para anunciar um personagem à venda, ele deve estar listado no sistema de Bazaar.' },
            { title: 'D) Transações no Market', description: 'O uso excessivo do market para compra e venda de Rubini Coins pode causar instabilidade na conta. A administração não se responsabiliza por falhas causadas por uso abusivo do sistema.' },
        ]
    },
    {
        category: '5 - Condutas Dentro dos Canais e No Jogo',
        rules: [
            { title: 'A) Help', description: 'Use o canal de Help exclusivamente para perguntas e respostas relacionadas ao jogo.' },
            { title: 'B) Advertising', description: 'Anúncios devem ser feitos apenas nos canais apropriados e com moderação.' },
            { title: 'C) World Chat', description: 'Use o World Chat para discussões gerais, mantendo o respeito e a civilidade.' },
            { title: 'D) Cassinos', description: 'É estritamente proibida a permanência de personagens utilizados para atividades de cassino dentro dos depots das cidades.' },
        ]
    },
    {
        category: '6 - Empresa e Questões Legais',
        rules: [
            { title: 'A) Fingir ser da Equipe', description: 'É estritamente proibido fingir ser um membro da equipe ou administração do servidor.' },
            { title: 'B) Calúnias ou Informações Falsas sobre a Empresa', description: 'Não é permitido disseminar calúnias ou informações falsas sobre a empresa ou equipe do servidor.' },
            { title: 'C) Atacar Serviços da Empresa', description: 'Não é permitido realizar ou apoiar ataques aos serviços da empresa.' },
            { title: 'D) Violação de Leis ou Regulamentos', description: 'Os jogadores devem cumprir todas as leis e regulamentos aplicáveis da vida real.' },
        ]
    }
]

export default function RulesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-zinc-100">Server Rules</h1>
                <p className="text-zinc-400">
                    Please read and follow the server rules carefully. Violations may result in penalties.
                </p>
            </div>

            <div className="grid gap-6">
                {rulesData.map((category, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-indigo-400">{category.category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {category.rules.map((rule, ruleIndex) => (
                                    <AccordionItem key={ruleIndex} value={`item-${index}-${ruleIndex}`} className="border-zinc-800">
                                        <AccordionTrigger className="text-zinc-200 hover:text-indigo-300 hover:no-underline">
                                            {rule.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-zinc-400">
                                            {rule.description}
                                            <div className="mt-2">
                                                <a href="#" className="text-xs text-indigo-500 hover:text-indigo-400">Mais...</a>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
