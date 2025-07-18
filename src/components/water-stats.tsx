import { type WaterData } from '@/types/water';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, BarChart, DollarSign, Droplets, TrendingUp } from 'lucide-react';

interface WaterStatsProps {
  allData: WaterData[];
  currentMonthData: WaterData;
  previousMonthData: WaterData | null;
}

export default function WaterStats({ allData, currentMonthData, previousMonthData }: WaterStatsProps) {
  if (allData.length === 0) {
    return null;
  }

  const currentYear = new Date(currentMonthData.isoDate).getFullYear().toString();
  const currentMonthDate = new Date(currentMonthData.isoDate);

  const yearToDateData = allData.filter(item => {
    const itemDate = new Date(item.isoDate);
    return itemDate.getFullYear().toString() === currentYear && itemDate <= currentMonthDate;
  });

  const ytdConsumption = yearToDateData.reduce((acc, item) => acc + item.consumo, 0);
  const ytdCost = yearToDateData.reduce((acc, item) => acc + item.valor, 0);

  let consumptionChange = 0;
  if(previousMonthData && previousMonthData.consumo > 0) {
    consumptionChange = ((currentMonthData.consumo - previousMonthData.consumo) / previousMonthData.consumo) * 100;
  }

  let costChange = 0;
  if(previousMonthData && previousMonthData.valor > 0) {
    costChange = ((currentMonthData.valor - previousMonthData.valor) / previousMonthData.valor) * 100;
  }
  
  const formatNumber = (num: number) => isNaN(num) ? 'N/A' : num.toLocaleString('pt-BR');
  const formatCurrency = (num: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo no Mês</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(currentMonthData.consumo)} m³</div>
          <p className="text-xs text-muted-foreground">Total para {currentMonthData.mesAno}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Custo no Mês</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentMonthData.valor)}</div>
          <p className="text-xs text-muted-foreground">Fatura de {currentMonthData.mesAno}</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Mês a Mês</CardTitle>
          {consumptionChange >= 0 ? <ArrowUp className="h-4 w-4 text-destructive" /> : <ArrowDown className="h-4 w-4 text-success" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${consumptionChange >= 0 ? 'text-destructive' : 'text-success'}`}>{consumptionChange.toFixed(1).replace('.',',')}%</div>
          <p className="text-xs text-muted-foreground">
            vs. {previousMonthData?.mesAno || 'mês anterior'}
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Custo Mês a Mês</CardTitle>
          {costChange >= 0 ? <ArrowUp className="h-4 w-4 text-destructive" /> : <ArrowDown className="h-4 w-4 text-success" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${costChange >= 0 ? 'text-destructive' : 'text-success'}`}>{costChange.toFixed(1).replace('.',',')}%</div>
          <p className="text-xs text-muted-foreground">
             vs. {previousMonthData?.mesAno || 'mês anterior'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Acumulado no Ano</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(ytdConsumption)} m³</div>
          <p className="text-xs text-muted-foreground">Total em {currentYear} até agora</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Custo Acumulado no Ano</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(ytdCost)}</div>
          <p className="text-xs text-muted-foreground">Total em {currentYear} até agora</p>
        </CardContent>
      </Card>
    </div>
  );
}
