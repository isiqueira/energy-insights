import { type EnergyData } from '@/types/energy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, BarChart, DollarSign, TrendingUp, Zap } from 'lucide-react';

interface EnergyStatsProps {
  allData: EnergyData[];
  currentMonthData: EnergyData;
  previousMonthData: EnergyData | null;
}

export default function EnergyStats({ allData, currentMonthData, previousMonthData }: EnergyStatsProps) {
  if (allData.length === 0) {
    return null;
  }

  const totalConsumption = allData.reduce((acc, item) => acc + item.consumoAtivoKwh, 0);
  const avgMonthlyConsumption = totalConsumption / allData.length;
  
  const totalDays = allData.reduce((acc, item) => acc + item.numDiasFaturamento, 0);
  const avgDailyConsumption = totalConsumption / totalDays;

  let consumptionChange = 0;
  if(previousMonthData && previousMonthData.consumoAtivoKwh > 0) {
    consumptionChange = ((currentMonthData.consumoAtivoKwh - previousMonthData.consumoAtivoKwh) / previousMonthData.consumoAtivoKwh) * 100;
  }

  let costChange = 0;
  if(previousMonthData && previousMonthData.totalFatura > 0) {
    costChange = ((currentMonthData.totalFatura - previousMonthData.totalFatura) / previousMonthData.totalFatura) * 100;
  }
  
  const formatNumber = (num: number) => isNaN(num) ? 'N/A' : Math.round(num).toLocaleString('pt-BR');
  const formatCurrency = (num: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo no Mês</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(currentMonthData.consumoAtivoKwh)} kWh</div>
          <p className="text-xs text-muted-foreground">Total para {currentMonthData.mesAno}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Custo no Mês</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentMonthData.totalFatura)}</div>
          <p className="text-xs text-muted-foreground">Fatura de {currentMonthData.mesAno}</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Mês a Mês</CardTitle>
          {consumptionChange >= 0 ? <ArrowUp className="h-4 w-4 text-destructive" /> : <ArrowDown className="h-4 w-4 text-success" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{consumptionChange.toFixed(1).replace('.',',')}%</div>
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
          <div className="text-2xl font-bold">{costChange.toFixed(1).replace('.',',')}%</div>
          <p className="text-xs text-muted-foreground">
             vs. {previousMonthData?.mesAno || 'mês anterior'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Médio Diário</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentMonthData.mediaAtivaKwhDia.toFixed(2)} kWh/dia</div>
          <p className="text-xs text-muted-foreground">Durante {currentMonthData.mesAno}</p>
        </CardContent>
      </Card>
    </div>
  );
}
