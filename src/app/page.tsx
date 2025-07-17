'use client';

import { useState } from 'react';
import { type EnergyData } from '@/types/energy';
import FileUploader from '@/components/file-uploader';
import Dashboard from '@/components/dashboard';
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [energyData, setEnergyData] = useState<EnergyData[] | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleDataLoaded = (data: EnergyData[], name: string) => {
    setEnergyData(data);
    setFileName(name);
  };

  const handleReset = () => {
    setEnergyData(null);
    setFileName('');
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-background text-foreground p-4 sm:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <header className="mb-8 text-center sm:text-left">
            <h1 className="text-4xl font-bold text-primary font-headline">Energy Insights</h1>
            <p className="text-muted-foreground mt-2">Monitor and analyze your home energy consumption.</p>
          </header>
          {energyData ? (
            <Dashboard data={energyData} fileName={fileName} onReset={handleReset} />
          ) : (
            <div className="flex justify-center">
              <FileUploader onDataLoaded={handleDataLoaded} />
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </>
  );
}
