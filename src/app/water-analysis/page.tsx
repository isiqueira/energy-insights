'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { type WaterData } from '@/types/water';
import { getSeason } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SeasonLegend from '@/components/season-legend';

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
  'Verão': 'hsl(var(--chart-3))',
  'Outono': 'hsl(var(--chart-5))',
  'Inverno': 'hsl(var(--chart-1))',
  'Primavera': 'hsl(var(--chart-2))',
};

const renderVariation = (variation: number) => {
    if (isNaN(variation) || !isFinite(variation)) {
        return <div className="text-right text-muted-foreground">-</div>;
    }
    const isPositive = variation > 0;
    return (
        <div className={`flex items-center justify-end gap-1 font-medium ${isPositive ? 'text-destructive' : 'text-success'}`}>
        {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        <span>{variation.toFixed(1).replace('.', ',')}%</span>
        </div>
    );
}

const formatCurrency = (num: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);

function WaterAnalysisPageContent() {
  const [waterData, setWaterData] = useState<WaterData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const waterDataString = localStorage.getItem('waterData');
      if (waterDataString) {
        setWaterData(JSON.parse(waterDataString));
      }
      
      setLoading(false);
    }
  }, []);

  const { seasonalData, years } = useMemo(() => {
    if (!waterData) return { seasonalData: {}, years: [] };

    const processedData = waterData.reduce<SeasonalData>((acc, item) => {
      if (!item.isoDate) return acc;
      const year = item.isoDate.split('-')[0];

      const season = getSeason(item.mesAno);
      if (!acc[year]) {
        acc[year] = {
          'Verão': { totalConsumption: 0, totalCost: 0, months: 0 },
          'Outono': { totalConsumption: 0, totalCost: 0, months: 0 },
          'Inverno': { totalConsumption: 0, totalCost: 0, months: 0 },
          'Primavera': { totalConsumption: 0, totalCost: 0, months: 0 },
        };
      }

      acc[year][season].totalConsumption += item.consumo;
      acc[year][season].totalCost += item.valor;
      acc[year][season].months += 1;

      return acc;
    }, {});
    
    const sortedYears = Object.keys(processedData).sort((a, b) => parseInt(b) - parseInt(a));
    return { seasonalData: processedData, years: sortedYears };
  }, [waterData]);

  
  if (loading) {
    return <div className="text-center p-8">Carregando dados...</div>;
  }

  if (!waterData) {
    return (
      <div className="text-center">
        <p>Dados não encontrados. Por favor, carregue um arquivo na página de água primeiro.</p>
        <Link href="/water">
          <Button className="mt-4">Carregar Arquivo</Button>
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
  const prevYear = String(parseInt(selectedYear) - 1);
  const prevYearData = seasonalData[prevYear] || {};
  
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
            <h1 className="text-4xl font-bold text-primary font-headline">Análise Sazonal de Água</h1>
            <p className="text-muted-foreground mt-2">Compare o consumo e o custo de água por estação do ano.</p>
          </div>
          <Link href="/water">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Painel de Água
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
                    {selectedYear}
                </div>
                <Button variant="outline" size="icon" onClick={handleNextYear} disabled={selectedYearIndex === 0}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próximo Ano</span>
                </Button>
            </div>
        </div>


        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consumo Sazonal (m³) - {selectedYear}</CardTitle>
            <CardDescription>Visualização do consumo total de água por estação.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(0)} m³`}
                  cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Legend content={<SeasonLegend />} />
                <Bar dataKey="Consumo" radius={[4, 4, 0, 0]}>
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={seasonColors[entry.name as keyof typeof seasonColors]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumo do Ano: {selectedYear}</CardTitle>
            <CardDescription>Comparativo de consumo e custo com o ano anterior ({prevYear}).</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estação</TableHead>
                  <TableHead className="text-right">Consumo Total (m³)</TableHead>
                  <TableHead className="text-right">Variação Consumo (%)</TableHead>
                  <TableHead className="text-right">Custo Total (R$)</TableHead>
                  <TableHead className="text-right">Variação Custo (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(yearData).map(([season, currentValues]) => {
                  if (currentValues.months === 0) return null;
                  
                  const prevSeasonValues = prevYearData[season as keyof typeof prevYearData];
                  
                  let consumptionVariation = NaN;
                  if (prevSeasonValues && prevSeasonValues.totalConsumption > 0) {
                    consumptionVariation = ((currentValues.totalConsumption - prevSeasonValues.totalConsumption) / prevSeasonValues.totalConsumption) * 100;
                  }

                  let costVariation = NaN;
                   if (prevSeasonValues && prevSeasonValues.totalCost > 0) {
                    costVariation = ((currentValues.totalCost - prevSeasonValues.totalCost) / prevSeasonValues.totalCost) * 100;
                  }
                  
                  return (
                    <TableRow key={season}>
                      <TableCell className="font-medium">{season}</TableCell>
                      <TableCell className="text-right">{currentValues.totalConsumption.toFixed(2)}</TableCell>
                      <TableCell>{renderVariation(consumptionVariation)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(currentValues.totalCost)}</TableCell>
                      <TableCell>{renderVariation(costVariation)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function WaterAnalysisPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Carregando...</div>}>
            <WaterAnalysisPageContent />
        </Suspense>
    )
}
