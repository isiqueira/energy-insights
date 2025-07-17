'use client';

import { useState, useEffect, useCallback } from 'react';
import { analyzeEnergyAnomalies, AnalyzeEnergyAnomaliesOutput } from '@/ai/flows/analyze-energy-anomalies';
import { type EnergyData } from '@/types/energy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface AnomalyDetectorProps {
  data: EnergyData[];
}

export default function AnomalyDetector({ data }: AnomalyDetectorProps) {
  const [anomalies, setAnomalies] = useState<AnalyzeEnergyAnomaliesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const input = data.map(d => ({
        date: d.dataLeitura,
        consumption: d.consumoAtivoKwh
      }));
      const result = await analyzeEnergyAnomalies(input);
      setAnomalies(result);
    } catch (e) {
      console.error('Anomaly detection failed:', e);
      setError('Ocorreu um erro ao analisar os dados. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      runAnalysis();
    }
  }, [data, runAnalysis]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detecção de Anomalias com IA</CardTitle>
        <CardDescription>
          Nossa IA analisa seus padrões de consumo para encontrar atividades incomuns e oferecer explicações potenciais.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-4">
             <Skeleton className="h-24 w-full rounded-lg" />
             <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Falha na Análise</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <Button variant="link" onClick={runAnalysis}>Tentar novamente</Button>
                </AlertDescription>
            </Alert>
        )}

        {anomalies && anomalies.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Anomalias Detectadas:</h3>
            {anomalies.map((anomaly, index) => (
              <Alert key={index} className="bg-primary/5 border-primary/20">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Anomalia Detectada em {anomaly.date}</AlertTitle>
                <AlertDescription>
                  <p><span className="font-semibold">Consumo:</span> {anomaly.consumption.toFixed(2)} kWh</p>
                  <p className="mt-2"><span className="font-semibold">Razões Potenciais:</span> {anomaly.potentialReasons}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {anomalies && anomalies.length === 0 && !isLoading && !error && (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhuma Anomalia Encontrada</AlertTitle>
                <AlertDescription>
                    Seu padrão de consumo de energia parece estável com base nos dados fornecidos.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
