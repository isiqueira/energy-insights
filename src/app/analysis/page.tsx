'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { type EnergyData } from '@/types/energy';
import { getSeason } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type SeasonalData = {
  [year: string]: {
    [season in 'Verão' | 'Outono' | 'Inverno' | 'Primavera']: {
      totalConsumption: number;
      totalCost: number;
      months: number;
    }
  }
};

const seasonColors: { [key: string]: string } = {
  'Verão': 'hsl(var(--chart-5))',      // Laranja
  'Outono': 'hsl(var(--chart-3))',     // Amarelo
  'Inverno': 'hsl(var(--chart-1))',    // Azul
  'Primavera': 'hsl(var(--chart-2))', // Verde
};

function AnalysisPageContent() {
  const [data, setData] = useState<EnergyData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataString = sessionStorage.getItem('energyData');
      if (dataString) {
        setData(JSON.parse(dataString));
      }
      setLoading(false);
    }
  }, []);

  const { seasonalData, years } = useMemo(() => {
    if (!data) return { seasonalData: {}, years: [] };

    const processedData = data.reduce<SeasonalData>((acc, item) => {
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
    
    const sortedYears = Object.keys(processedData).sort((a, b) => parseInt(b) - parseInt(a));
    return { seasonalData: processedData, years: sortedYears };
  }, [data]);
  
  if (loading) {
    return <div className="text-center p-8">Carregando dados...</div>;
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

  const handlePreviousYear = () => {
    setSelectedYearIndex((prevIndex) => Math.min(years.length - 1, prevIndex + 1));
  };

  const handleNextYear = () => {
    setSelectedYearIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const selectedYear = years[selectedYearIndex];
  const yearData = seasonalData[selectedYear] || {};
  
  const chartData = Object.entries(yearData).map(([season, values]) => ({
    name: season,
    Consumo: values.totalConsumption,
    Custo: values.totalCost,
  }));

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
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

         <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={handlePreviousYear} disabled={selectedYearIndex === years.length - 1}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Ano Anterior</span>
                </Button>
                <div className="text-xl font-semibold text-center w-24">
                    Ano {selectedYear}
                </div>
                <Button variant="outline" size="icon" onClick={handleNextYear} disabled={selectedYearIndex === 0}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próximo Ano</span>
                </Button>
            </div>
        </div>


        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consumo Sazonal (kWh) - {selectedYear}</CardTitle>
            <CardDescription>Visualização do consumo total de energia por estação.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(0)} kWh`}
                  cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Legend />
                <Bar dataKey="Consumo" radius={[4, 4, 0, 0]}>
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={seasonColors[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumo do Ano: {selectedYear}</CardTitle>
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
                {Object.entries(yearData).map(([season, values]) => (
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
        <Suspense fallback={<div className="text-center p-8">Carregando...</div>}>
            <AnalysisPageContent />
        </Suspense>
    )
}
