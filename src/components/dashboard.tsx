'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EnergyChart from './energy-chart';
import EnergyDataTable from './energy-data-table';
import AnomalyDetector from './anomaly-detector';
import { type EnergyData } from '@/types/energy';
import { Button } from './ui/button';
import { File, RefreshCw, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import EnergyStats from './energy-stats';
import SeasonAlert from './season-alert';

interface DashboardProps {
  data: EnergyData[];
  fileName: string;
  onReset: () => void;
}

export default function Dashboard({ data, fileName, onReset }: DashboardProps) {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  const handlePreviousMonth = () => {
    setSelectedMonthIndex((prevIndex) => Math.min(data.length - 1, prevIndex + 1));
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const selectedMonthData = data[selectedMonthIndex];
  const previousMonthData = selectedMonthIndex < data.length - 1 ? data[selectedMonthIndex + 1] : null;

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold">Painel de Consumo</h2>
          <div className="flex items-center text-muted-foreground mt-1">
            <File className="mr-2 h-4 w-4" />
            <span>{fileName}</span>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2'>
          <Link href="/analysis" passHref>
            <Button variant="outline" className="w-full sm:w-auto">
              <BarChart3 className="mr-2 h-4 w-4" />
              Análise Sazonal
            </Button>
          </Link>
          <Button onClick={onReset} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Carregar Outro Arquivo
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth} disabled={selectedMonthIndex === data.length - 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Mês Anterior</span>
          </Button>
          <div className="text-xl font-semibold text-center w-40">
              {selectedMonthData.mesAno}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={selectedMonthIndex === 0}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próximo Mês</span>
          </Button>
        </div>
        <SeasonAlert mesAno={selectedMonthData.mesAno} />
      </div>
      
      <EnergyStats 
        allData={data} 
        currentMonthData={selectedMonthData} 
        previousMonthData={previousMonthData} 
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="data">Tabela de Dados</TabsTrigger>
          <TabsTrigger value="anomalies">Detecção de Anomalias</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Consumo e Custo ao Longo do Tempo</CardTitle>
              <CardDescription>Uma visão combinada do seu consumo mensal de energia (kWh) e o valor total da fatura (R$).</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergyChart data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="data">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Dados Detalhados de Energia</CardTitle>
              <CardDescription>Ordene e filtre seu histórico completo de consumo.</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergyDataTable data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="anomalies">
            <div className="mt-4">
                <AnomalyDetector data={data} />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
