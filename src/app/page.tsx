'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { type EnergyData } from '@/types/energy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Droplets, Phone, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [latestEnergyData, setLatestEnergyData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const dataString = localStorage.getItem('energyData');
      if (dataString) {
        const data: EnergyData[] = JSON.parse(dataString);
        if (data.length > 0) {
          // Assuming data is sorted with the latest first
          setLatestEnergyData(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem('energyData');
    }
    setLoading(false);
  }, []);
  
  const formatCurrency = (num: number | undefined) => {
    if (num === undefined) return <Skeleton className="h-8 w-32" />;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
  }

  const getMonthDescription = (data: EnergyData | null) => {
      if (!data) return null;
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
          {/* Card de Energia */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Energia</CardTitle>
              <Zap className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold text-primary mb-1">
                {loading ? <Skeleton className="h-8 w-32" /> : formatCurrency(latestEnergyData?.totalFatura)}
              </div>
              {loading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="text-xs text-muted-foreground">
                  {getMonthDescription(latestEnergyData)}
                </p>
              )}
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Link href={latestEnergyData ? "/energy" : "/"} passHref>
                <Button className="w-full" disabled={!latestEnergyData}>
                  Analisar Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card de Água (Placeholder) */}
          <Card className="flex flex-col bg-muted/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground">Água</CardTitle>
              <Droplets className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">Em breve você poderá analisar suas contas de água aqui.</p>
            </CardContent>
             <div className="p-6 pt-0 mt-auto">
                 <Button className="w-full" disabled>
                  Analisar Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </Card>

          {/* Card de Telefonia (Placeholder) */}
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
        
         {!loading && !latestEnergyData && (
          <Card className="mt-8 bg-secondary/50">
            <CardHeader>
              <CardTitle>Comece com a sua conta de Energia</CardTitle>
              <CardDescription>Para habilitar a análise, carregue seu histórico de consumo de energia.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/energy" passHref>
                <Button>
                  Carregar Arquivo de Energia
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
