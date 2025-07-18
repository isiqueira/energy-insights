'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { type EnergyData } from '@/types/energy';
import { type WaterData } from '@/types/water';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Droplets, Phone, ArrowRight, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getSeason } from '@/lib/utils';

export default function Home() {
  const [energyData, setEnergyData] = useState<EnergyData[] | null>(null);
  const [waterData, setWaterData] = useState<WaterData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const energyDataString = localStorage.getItem('energyData');
      if (energyDataString) {
        setEnergyData(JSON.parse(energyDataString));
      }

      const waterDataString = localStorage.getItem('waterData');
      if (waterDataString) {
          setWaterData(JSON.parse(waterDataString));
      }

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem('energyData');
      localStorage.removeItem('waterData');
    }
    setLoading(false);
  }, []);

  const latestEnergyData = useMemo(() => {
    if (!energyData || energyData.length === 0) return null;
    return energyData[0];
  }, [energyData]);

  const latestWaterData = useMemo(() => {
    if (!waterData || waterData.length === 0) return null;
    return waterData[0];
  }, [waterData]);
  
  const highestEnergyBill = useMemo(() => {
    if (!energyData || energyData.length === 0) return null;
    return energyData.reduce((max, current) => (current.totalFatura > max.totalFatura ? current : max));
  }, [energyData]);

  const highestWaterBill = useMemo(() => {
    if (!waterData || waterData.length === 0) return null;
    return waterData.reduce((max, current) => (current.valor > max.valor ? current : max));
  }, [waterData]);
  
  const formatCurrency = (num: number | undefined) => {
    if (num === undefined) return <Skeleton className="h-8 w-24" />;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
  }

  const getMonthDescription = (data: EnergyData | WaterData | null) => {
      if (loading) return <Skeleton className="h-4 w-24" />;
      if (!data) return 'Carregue seu arquivo';
      return `Fatura de ${data.mesAno}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary font-headline">Painel de Contas</h1>
          <p className="text-muted-foreground mt-2">Sua visão centralizada sobre os custos de consumo da sua casa.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Energia</CardTitle>
              <Zap className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-3xl font-bold text-primary mb-1">
                    {loading ? <Skeleton className="h-8 w-32" /> : formatCurrency(latestEnergyData?.totalFatura)}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                    {loading ? <Skeleton className="h-5 w-20" /> : latestEnergyData ? `${latestEnergyData.consumoAtivoKwh.toFixed(0)} kWh` : ''}
                </div>
                <div className="text-xs text-muted-foreground">
                    {getMonthDescription(latestEnergyData)}
                </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Link href="/energy" passHref>
                <Button className="w-full">
                  Analisar Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="flex flex-col">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Água</CardTitle>
                <Droplets className="h-6 w-6 text-primary" />
            </CardHeader>
             <CardContent className="flex-grow">
                <div className="text-3xl font-bold text-primary mb-1">
                    {loading ? <Skeleton className="h-8 w-32" /> : formatCurrency(latestWaterData?.valor)}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                    {loading ? <Skeleton className="h-5 w-20" /> : latestWaterData ? `${latestWaterData.consumo} m³` : ''}
                </div>
                 <div className="text-xs text-muted-foreground">
                    {getMonthDescription(latestWaterData)}
                </div>
            </CardContent>
             <div className="p-6 pt-0 mt-auto">
                <Link href="/water" passHref>
                    <Button className="w-full">
                        Analisar Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
          </Card>

          <Card className="flex flex-col bg-muted/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground">Telefonia</CardTitle>
              <Phone className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
             <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">Em breve você poderá analisar suas contas de telefone e internet.</p>
            </CardContent>
             <div className="p-6 pt-0 mt-auto">
                 <Button className="w-full" disabled>
                  Analisar Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </Card>
        </div>
        
         {!loading && !latestEnergyData && !latestWaterData && (
          <Card className="mt-8 bg-secondary/50">
            <CardHeader>
              <CardTitle>Comece sua Análise</CardTitle>
              <CardDescription>Para habilitar o painel, carregue seu histórico de consumo de energia e/ou água.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Link href="/energy" passHref>
                <Button>
                  Carregar Dados de Energia
                </Button>
              </Link>
               <Link href="/water" passHref>
                <Button variant="secondary">
                  Carregar Dados de Água
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
            {highestEnergyBill && (
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                           <Trophy className="text-primary" /> Maior Conta de Energia
                        </CardTitle>
                        <CardDescription>
                           O pico de gastos com energia elétrica registrado nos seus dados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-2xl font-bold">{formatCurrency(highestEnergyBill.totalFatura)}</p>
                        <p className="text-muted-foreground"><span className="font-semibold">Mês/Ano:</span> {highestEnergyBill.mesAno}</p>
                        <p className="text-muted-foreground"><span className="font-semibold">Consumo:</span> {highestEnergyBill.consumoAtivoKwh.toFixed(0)} kWh</p>
                        <p className="text-muted-foreground"><span className="font-semibold">Estação:</span> {getSeason(highestEnergyBill.mesAno)}</p>
                    </CardContent>
                </Card>
            )}
             {highestWaterBill && (
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                           <Trophy className="text-primary" /> Maior Conta de Água
                        </CardTitle>
                        <CardDescription>
                           O pico de gastos com água registrado nos seus dados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-2xl font-bold">{formatCurrency(highestWaterBill.valor)}</p>
                        <p className="text-muted-foreground"><span className="font-semibold">Mês/Ano:</span> {highestWaterBill.mesAno}</p>
                        <p className="text-muted-foreground"><span className="font-semibold">Consumo:</span> {highestWaterBill.consumo} m³</p>
                        <p className="text-muted-foreground"><span className="font-semibold">Estação:</span> {getSeason(highestWaterBill.mesAno)}</p>
                    </CardContent>
                </Card>
            )}
        </div>

      </div>
    </main>
  );
}
