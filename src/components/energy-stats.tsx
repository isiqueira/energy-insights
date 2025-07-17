import { type EnergyData } from '@/types/energy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, BarChart, TrendingUp, Zap } from 'lucide-react';

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

  const formatNumber = (num: number) => isNaN(num) ? 'N/A' : Math.round(num).toLocaleString();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalConsumption)} kWh</div>
          <p className="text-xs text-muted-foreground">Across {data.length} months</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Monthly Consumption</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(avgMonthlyConsumption)} kWh</div>
          <p className="text-xs text-muted-foreground">Average over the period</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Daily Consumption</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(avgDailyConsumption)} kWh/day</div>
          <p className="text-xs text-muted-foreground">Average daily usage</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Month-over-Month</CardTitle>
          {consumptionChange >= 0 ? <ArrowUp className="h-4 w-4 text-destructive" /> : <ArrowDown className="h-4 w-4 text-success" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(latestMonth.consumoAtivoKwh)} kWh</div>
          {previousMonth && <p className={`text-xs ${consumptionChange >= 0 ? 'text-destructive' : 'text-success'}`}>
            {consumptionChange.toFixed(1)}% from previous month
          </p>}
        </CardContent>
      </Card>
    </div>
  );
}
