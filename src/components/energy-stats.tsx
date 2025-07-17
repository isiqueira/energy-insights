import { type EnergyData } from '@/types/energy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, BarChart, DollarSign, TrendingUp, Zap } from 'lucide-react';

interface EnergyStatsProps {
  data: EnergyData[];
}

export default function EnergyStats({ data }: EnergyStatsProps) {
  if (data.length === 0) {
    return null;
  }

  const totalConsumption = data.reduce((acc, item) => acc + item.consumoAtivoKwh, 0);
  const avgMonthlyConsumption = totalConsumption / data.length;
  const avgDailyConsumption = data.reduce((acc, item) => acc + item.mediaAtivaKwhDia, 0) / data.length;
  
  const latestMonth = data[data.length - 1];
  const previousMonth = data.length > 1 ? data[data.length - 2] : null;

  let consumptionChange = 0;
  if(previousMonth && previousMonth.consumoAtivoKwh > 0) {
    consumptionChange = ((latestMonth.consumoAtivoKwh - previousMonth.consumoAtivoKwh) / previousMonth.consumoAtivoKwh) * 100;
  }

  let costChange = 0;
  if(previousMonth && previousMonth.totalFatura > 0) {
    costChange = ((latestMonth.totalFatura - previousMonth.totalFatura) / previousMonth.totalFatura) * 100;
  }
  
  const formatNumber = (num: number) => isNaN(num) ? 'N/A' : Math.round(num).toLocaleString('pt-BR');
  const formatCurrency = (num: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Total</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalConsumption)} kWh</div>
          <p className="text-xs text-muted-foreground">Em {data.length} meses</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Médio Mensal</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(avgMonthlyConsumption)} kWh</div>
          <p className="text-xs text-muted-foreground">Média durante o período</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Médio Diário</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(avgDailyConsumption)} kWh/dia</div>
          <p className="text-xs text-muted-foreground">Uso médio diário</p>
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
            {formatNumber(latestMonth.consumoAtivoKwh)} kWh no último mês
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
             {formatCurrency(latestMonth.totalFatura)} no último mês
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
