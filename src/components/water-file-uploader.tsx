'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';
import { type WaterData } from '@/types/water';

interface WaterFileUploaderProps {
  onDataLoaded: (data: WaterData[], fileName: string) => void;
}

export default function WaterFileUploader({ onDataLoaded }: WaterFileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
  
  const processFile = () => {
    if (!file) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo JSON para carregar.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const jsonData: WaterData[] = JSON.parse(text);

        const parsedData = jsonData.map(item => {
            const date = new Date(item.dataInicioCompetencia);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            
            return {
                ...item,
                mesAno: `${month}/${year}`,
                isoDate: `${year}-${month}-01`,
            }
        }).filter(item => item.mesAno && item.consumo != null && item.isoDate);
        
        parsedData.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
        
        onDataLoaded(parsedData, file.name);
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: 'Erro ao Processar o Arquivo',
          description: 'Por favor, verifique se o arquivo JSON está no formato correto.',
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

    reader.readAsText(file);
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Carregue Seus Dados de Água</CardTitle>
        <CardDescription>
          Importe seu histórico de consumo de água de um arquivo JSON.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="water-data-file">Arquivo JSON</Label>
            <Input id="water-data-file" type="file" accept=".json" onChange={handleFileChange} />
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
