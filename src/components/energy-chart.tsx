'use client';

import { Bar, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { type EnergyData } from '@/types/energy';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

interface EnergyChartProps {
  data: EnergyData[];
}

const chartConfig = {
  consumption: {
    label: "Consumo (kWh)",
    color: "hsl(var(--primary))",
  },
  cost: {
    label: "Custo (R$)",
    color: "hsl(var(--accent))",
  }
} satisfies ChartConfig;

export default function EnergyChart({ data }: EnergyChartProps) {
  const chartData = data.map(item => ({
    date: item.mesAno,
    consumption: item.consumoAtivoKwh,
    cost: item.totalFatura,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
      <ComposedChart
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis 
          dataKey="date" 
          tickLine={false} 
          axisLine={false} 
          tickMargin={8}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
         />
        <YAxis
          yAxisId="left"
          stroke="var(--color-consumption)"
          label={{ value: 'Consumo (kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, offset: -15 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="var(--color-cost)"
          label={{ value: 'Custo (R$)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' }, offset: -15 }}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar dataKey="consumption" yAxisId="left" fill="var(--color-consumption)" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="cost" yAxisId="right" stroke="var(--color-cost)" strokeWidth={2} dot={{ fill: "var(--color-cost)" }} activeDot={{ r: 6 }} />
      </ComposedChart>
    </ChartContainer>
  );
}
