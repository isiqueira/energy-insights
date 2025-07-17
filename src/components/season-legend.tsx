'use client';

const seasons = [
  { name: 'Verão', color: 'hsl(var(--chart-5))' },
  { name: 'Outono', color: 'hsl(var(--chart-3))' },
  { name: 'Inverno', color: 'hsl(var(--chart-1))' },
  { name: 'Primavera', color: 'hsl(var(--chart-2))' },
];

export default function SeasonLegend() {
  return (
    <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t">
      {seasons.map((season) => (
        <div key={season.name} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: season.color }}
          />
          <span className="text-sm text-muted-foreground">{season.name}</span>
        </div>
      ))}
    </div>
  );
}
