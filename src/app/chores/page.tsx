
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const choresData = [
  {
    responsavel: 'RENATA',
    tarefas: [
      'ASPIRAR A CASA',
      'LAVAR A ROUPA',
      'RECOLHER A ROUPA',
      'FAZER REFEIÇÕES',
      'ORGANIZAR A CASA',
      'LIMPAR BANHEIROS',
      'RECOLHER ROUPA SUJA',
      'ARRUMAR COZINHA DO ALMOÇO',
      'FAZER LISTA DO MERCADO',
    ],
  },
  {
    responsavel: 'MARIANA',
    tarefas: [
      'MANTER TUDO NO LUGAR',
      'MANTER QUARTO ORGANIZADO',
      'RECOLHER E ENCHER AS GARRAFAS DE AGUA',
      'PENDURAR ROUPAS INTIMAS',
      'ARRUMAR A CAMA',
      'ABRIR A JANELA',
      'GUARDAR A LOUÇAS',
      'MANTER A PIA DO BANHEIRO FECHADA',
      'SEPARAR ROUPA SUJA',
    ],
  },
  {
    responsavel: 'ITALO',
    tarefas: [
      'LIMPAR OS QUINTAIS',
      'MANTER AS COISAS NOS SEUS LUGARES (MESA, APARADOR...)',
      'COLOCAR AS LOUÇAS NA MAQUINA',
      'ARRUMAR COZINHA DO ALMOÇO',
      'COLOCAR TOALHAS NO SOL',
      'RETIRAR O LIXO',
      'COLOCAR SACOS NAS LIXEIRAS',
      'MANTER O QUARTO ORGANIZADO',
      'MANTER A PIA DO BANHEIRO FECHADA',
      'CUIDAR DO CARRO',
      'SEPARAR ROUPA SUJA',
      'ORGANIZAR SAPATOS NA SAPATEIRA DA COZINHA',
    ],
  },
];

export default function ChoresPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary font-headline">Responsabilidades da Casa</h1>
            <p className="text-muted-foreground mt-2">Quadro de tarefas para manutenção e organização do lar.</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Painel Principal
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {choresData.map((person) => (
            <Card key={person.responsavel} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-primary">{person.responsavel}</CardTitle>
                    <Badge variant="secondary">{person.tarefas.length} tarefas</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  {person.tarefas.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
