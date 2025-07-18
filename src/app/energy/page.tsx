'use client';

import { useState, useEffect } from 'react';
import { type EnergyData } from '@/types/energy';
import FileUploader from '@/components/file-uploader';
import Dashboard from '@/components/dashboard';
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function EnergyPage() {
  const [energyData, setEnergyData] = useState<EnergyData[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const dataString = localStorage.getItem('energyData');
      const nameString = localStorage.getItem('fileName');
      if (dataString && nameString) {
        setEnergyData(JSON.parse(dataString));
        setFileName(nameString);
      }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        localStorage.removeItem('energyData');
        localStorage.removeItem('fileName');
    }
    setLoading(false);
  }, []);

  const handleDataLoaded = (data: EnergyData[], name: string) => {
    setEnergyData(data);
    setFileName(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('energyData', JSON.stringify(data));
      localStorage.setItem('fileName', name);
    }
  };

  const handleReset = () => {
    setEnergyData(null);
    setFileName('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('energyData');
      localStorage.removeItem('fileName');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
         <div className="w-full max-w-7xl mx-auto space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
             <Skeleton className="h-96 w-full" />
         </div>
      )
    }
    
    if (energyData) {
        return <Dashboard data={energyData} fileName={fileName} onReset={handleReset} />;
    }
    
    return (
        <div className="flex justify-center">
            <FileUploader onDataLoaded={handleDataLoaded} />
        </div>
    );
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-background text-foreground p-4 sm:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-4xl font-bold text-primary font-headline">Análise de Energia</h1>
                <p className="text-muted-foreground mt-2">Monitore e analise o consumo de energia da sua casa.</p>
            </div>
             <Link href="/">
                <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Painel Principal
                </Button>
            </Link>
          </header>
          {renderContent()}
        </div>
      </main>
      <Toaster />
    </>
  );
}
