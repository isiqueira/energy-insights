'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EnergyChart from './energy-chart';
import EnergyDataTable from './energy-data-table';
import AnomalyDetector from './anomaly-detector';
import { type EnergyData } from '@/types/energy';
import { Button } from './ui/button';
import { File, RefreshCw } from 'lucide-react';
import EnergyStats from './energy-stats';

interface DashboardProps {
  data: EnergyData[];
  fileName: string;
  onReset: () => void;
}

export default function Dashboard({ data, fileName, onReset }: DashboardProps) {
  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold">Consumption Dashboard</h2>
          <div className="flex items-center text-muted-foreground mt-1">
            <File className="mr-2 h-4 w-4" />
            <span>{fileName}</span>
          </div>
        </div>
        <Button onClick={onReset} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Load Another File
        </Button>
      </div>

      <EnergyStats data={data} />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Consumption & Cost Over Time</CardTitle>
              <CardDescription>A combined view of your monthly energy consumption (kWh) and total bill amount (R$).</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergyChart data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="data">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Detailed Energy Data</CardTitle>
              <CardDescription>Sort and filter your complete consumption history.</CardDescription>
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
