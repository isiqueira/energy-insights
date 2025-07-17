'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';
import { type EnergyData } from '@/types/energy';

interface FileUploaderProps {
  onDataLoaded: (data: EnergyData[], fileName: string) => void;
}

const columnMapping: { [key: string]: keyof EnergyData } = {
  'Mês/Ano': 'mesAno',
  'Medidor': 'medidor',
  'Descrição': 'descricao',
  'Data Leitura': 'dataLeitura',
  'Constante': 'constante',
  'Leitura Ativa': 'leituraAtiva',
  'Consumo Ativo (kWh)': 'consumoAtivoKwh',
  'Nº de Dias / Faturamento': 'numDiasFaturamento',
  'Média Ativa kWh/dia': 'mediaAtivaKwhDia',
  'Média de Consumo': 'mediaConsumo',
  'Tipo de Faturamento': 'tipoFaturamento',
  'Total da Fatura': 'totalFatura',
};

export default function FileUploader({ onDataLoaded }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const parseDate = (dateValue: string | number | Date): Date => {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    if (typeof dateValue === 'number') {
      return new Date(Math.round((dateValue - 25569) * 86400 * 1000));
    }
    if (typeof dateValue === 'string') {
        const parts = dateValue.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
    }
    return new Date(dateValue);
  };
  
  const processFile = () => {
    if (!file) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo Excel para carregar.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        const parsedData: EnergyData[] = jsonData.map((row) => {
          const newRow: Partial<EnergyData> = {};
          for (const key in row) {
            if (columnMapping[key]) {
              (newRow as any)[columnMapping[key]] = row[key];
            }
          }
          if (newRow.dataLeitura) {
            newRow.leituraDate = parseDate(newRow.dataLeitura);
          }
          newRow.constante = Number(newRow.constante);
          newRow.leituraAtiva = Number(newRow.leituraAtiva);
          newRow.consumoAtivoKwh = Number(newRow.consumoAtivoKwh);
          newRow.numDiasFaturamento = Number(newRow.numDiasFaturamento);
          newRow.mediaAtivaKwhDia = Number(newRow.mediaAtivaKwhDia);
          newRow.mediaConsumo = Number(newRow.mediaConsumo);
          newRow.totalFatura = Number(String(newRow.totalFatura).replace(',', '.'));
          
          return newRow as EnergyData;
        }).filter(item => item.leituraDate && !isNaN(item.leituraDate.getTime()) && item.consumoAtivoKwh != null);

        parsedData.sort((a, b) => a.leituraDate.getTime() - b.leituraDate.getTime());
        
        onDataLoaded(parsedData, file.name);
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: 'Erro ao Processar o Arquivo',
          description: 'Por favor, verifique o formato do arquivo e os cabeçalhos das colunas.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error('File reading error:', error);
      toast({
        title: 'Erro de Leitura do Arquivo',
        description: 'Não foi possível ler o arquivo selecionado.',
        variant: 'destructive',
      });
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Carregue Seus Dados de Energia</CardTitle>
        <CardDescription>
          Importe seu histórico de consumo de energia de um arquivo Excel (.xls, .xlsx).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="energy-data-file">Arquivo Excel</Label>
            <Input id="energy-data-file" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </div>
          <Button onClick={processFile} disabled={isLoading || !file} size="lg">
            <UploadCloud className="mr-2 h-4 w-4" />
            {isLoading ? 'Processando...' : 'Carregar e Analisar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
