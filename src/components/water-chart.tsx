'use client';

import { Bar, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Cell } from 'recharts';
import { type WaterData } from '@/types/water';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { getSeason } from '@/lib/utils';
import SeasonLegend from './season-legend';

interface WaterChartProps {
  data: WaterData[];
}

const chartConfig = {
  consumption: {
    label: "Consumo (m³)",
  },
  cost: {
    label: "Custo (R$)",
    color: "hsl(var(--accent))",
  }
} satisfies ChartConfig;

const seasonColors: { [key: string]: string } = {
  'Verão': 'hsl(var(--chart-3))',
  'Outono': 'hsl(var(--chart-5))',
  'Inverno': 'hsl(var(--chart-1))',
  'Primavera': 'hsl(var(--chart-2))',
};

export default function WaterChart({ data }: WaterChartProps) {
  const chartData = data.map(item => ({
    date: item.mesAno,
    consumption: item.consumo,
    cost: item.valor,
    season: getSeason(item.mesAno),
  }));

  return (
    <>
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
            label={{ value: 'Consumo (m³)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, offset: -15 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--color-cost)"
            label={{ value: 'Custo (R$)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' }, offset: -15 }}
          />
          <Tooltip 
            formatter={(value, name) => {
                if (name === 'consumption') return [`${(value as number).toFixed(0)} m³`, "Consumo"];
                if (name === 'cost') return [new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value as number), "Custo"];
                return [value, name];
            }}
            cursor={{fill: 'hsl(var(--muted))'}}
          />
          <Legend content={<SeasonLegend />} />
          <Bar dataKey="consumption" yAxisId="left" radius={[4, 4, 0, 0]}>
             {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={seasonColors[entry.season as keyof typeof seasonColors]} />
            ))}
          </Bar>
          <Line type="monotone" dataKey="cost" yAxisId="right" stroke="var(--color-cost)" strokeWidth={2} dot={{ fill: "var(--color-cost)" }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ChartContainer>
    </>
  );
}
