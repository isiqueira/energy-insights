'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { type EnergyData } from '@/types/energy';
import { getSeason } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type SeasonalData = {
  [year: string]: {
    [season in 'Verão' | 'Outono' | 'Inverno' | 'Primavera']: {
      totalConsumption: number;
      totalCost: number;
      months: number;
    }
  }
};

function AnalysisPageContent() {
  const [data, setData] = useState<EnergyData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataString = sessionStorage.getItem('energyData');
      if (dataString) {
        setData(JSON.parse(dataString));
      }
      setLoading(false);
    }
  }, []);
  
  if (loading) {
    return <div className="text-center">Carregando dados...</div>;
  }

  if (!data) {
    return (
      <div className="text-center">
        <p>Dados não encontrados. Por favor, carregue um arquivo na página inicial primeiro.</p>
        <Link href="/">
          <Button className="mt-4">Voltar para o Início</Button>
        </Link>
      </div>
    );
  }

  const seasonalData = data.reduce<SeasonalData>((acc, item) => {
    const [month, year] = item.mesAno.split('/');
    if (!year) return acc;

    const season = getSeason(item.mesAno);
    if (!acc[year]) {
      acc[year] = {
        'Verão': { totalConsumption: 0, totalCost: 0, months: 0 },
        'Outono': { totalConsumption: 0, totalCost: 0, months: 0 },
        'Inverno': { totalConsumption: 0, totalCost: 0, months: 0 },
        'Primavera': { totalConsumption: 0, totalCost: 0, months: 0 },
      };
    }

    acc[year][season].totalConsumption += item.consumoAtivoKwh;
    acc[year][season].totalCost += item.totalFatura;
    acc[year][season].months += 1;

    return acc;
  }, {});

  const years = Object.keys(seasonalData).sort().reverse();

  const chartData = Object.entries(seasonalData).flatMap(([year, seasons]) => {
    return Object.entries(seasons).map(([season, values]) => ({
      name: `${season.substring(0,3)}/${year.slice(-2)}`,
      Consumo: values.totalConsumption,
      Custo: values.totalCost,
    }));
  });

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary font-headline">Análise Sazonal</h1>
            <p className="text-muted-foreground mt-2">Compare o consumo e o custo de energia por estação do ano.</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Painel
            </Button>
          </Link>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consumo Sazonal (kWh)</CardTitle>
            <CardDescription>Visualização do consumo total de energia por estação ao longo dos anos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(0)} kWh`}
                  cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Legend />
                <Bar dataKey="Consumo" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {years.map(year => (
          <Card key={year} className="mb-6">
            <CardHeader>
              <CardTitle>Resumo do Ano: {year}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estação</TableHead>
                    <TableHead className="text-right">Consumo Total (kWh)</TableHead>
                    <TableHead className="text-right">Custo Total (R$)</TableHead>
                    <TableHead className="text-right">Consumo Médio Mensal (kWh)</TableHead>
                    <TableHead className="text-right">Custo Médio Mensal (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(seasonalData[year]).map(([season, values]) => (
                    values.months > 0 && (
                      <TableRow key={season}>
                        <TableCell className="font-medium">{season}</TableCell>
                        <TableCell className="text-right">{values.totalConsumption.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(values.totalCost)}</TableCell>
                        <TableCell className="text-right">{(values.totalConsumption / values.months).toFixed(2)}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(values.totalCost / values.months)}</TableCell>
                      </TableRow>
                    )
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        <Card>
            <CardHeader>
                <CardTitle>Análise de Temperatura (Em Breve)</CardTitle>
                <CardDescription>
                    Esta seção irá cruzar seus dados de consumo com o histórico de temperaturas para identificar correlações.
                    A integração com uma API de dados climáticos está em desenvolvimento.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <p>Funcionalidade de cruzamento de dados com temperatura em construção.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function AnalysisPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <AnalysisPageContent />
        </Suspense>
    )
}
