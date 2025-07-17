'use client';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type EnergyData } from '@/types/energy';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';

const formatCurrency = (amount: number) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
}).format(amount);


export const columns: ColumnDef<EnergyData>[] = [
  {
    accessorKey: 'mesAno',
    header: 'Mês/Ano',
  },
  {
    accessorKey: 'consumoAtivoKwh',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Consumo (kWh)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-right">{row.original.consumoAtivoKwh.toFixed(2)}</div>,
  },
  {
      id: 'monthVariation',
      header: () => <div className="text-right">Variação Mês a Mês</div>,
      cell: ({ row, table }) => {
        const rowIndex = row.index;
        const allData = table.options.data;
  
        if (rowIndex === 0) {
          return <div className="text-right text-muted-foreground">-</div>;
        }
  
        const currentConsumption = row.original.consumoAtivoKwh;
        const previousConsumption = allData[rowIndex - 1].consumoAtivoKwh;
  
        if (previousConsumption === 0) {
          return <div className="text-right text-muted-foreground">N/A</div>;
        }
  
        const variation = ((currentConsumption - previousConsumption) / previousConsumption) * 100;
        const isPositive = variation > 0;
  
        return (
          <div className={`flex items-center justify-end gap-1 font-medium ${isPositive ? 'text-destructive' : 'text-success'}`}>
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{variation.toFixed(1).replace('.', ',')}%</span>
          </div>
        );
      },
  },
  {
    accessorKey: 'totalFatura',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fatura Total (R$)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const amount = parseFloat(String(row.original.totalFatura))
        const formatted = formatCurrency(amount);
        return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    id: 'custoKwh',
    header: () => <div className="text-right">Custo/kWh (R$)</div>,
    cell: ({ row }) => {
      const totalFatura = row.original.totalFatura;
      const consumoKwh = row.original.consumoAtivoKwh;

      if (consumoKwh === 0) {
        return <div className="text-right text-muted-foreground">N/A</div>;
      }

      const custoKwh = totalFatura / consumoKwh;
      
      const formatted = formatCurrency(custoKwh);

      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    id: 'consumoAnoAnterior',
    header: () => <div className="text-right">Consumo (kWh) Ano Anterior</div>,
    cell: ({ row, table }) => {
      const allData = table.options.data;
      const [month, year] = row.original.mesAno.split('/');
      const prevYearMesAno = `${month}/${parseInt(year) - 1}`;
      const prevYearData = allData.find(d => d.mesAno === prevYearMesAno);

      if (!prevYearData) {
        return <div className="text-right text-muted-foreground">-</div>;
      }
      return <div className="text-right">{prevYearData.consumoAtivoKwh.toFixed(2)}</div>;
    },
  },
  {
    id: 'faturaAnoAnterior',
    header: () => <div className="text-right">Fatura Total (Ano Anterior)</div>,
    cell: ({ row, table }) => {
      const allData = table.options.data;
      const [month, year] = row.original.mesAno.split('/');
      const prevYearMesAno = `${month}/${parseInt(year) - 1}`;
      const prevYearData = allData.find(d => d.mesAno === prevYearMesAno);

      if (!prevYearData) {
        return <div className="text-right text-muted-foreground">-</div>;
      }
      return <div className="text-right font-medium">{formatCurrency(prevYearData.totalFatura)}</div>;
    },
  },
  {
    accessorKey: 'mediaAtivaKwhDia',
    header: () => <div className="text-right">Média kWh/dia</div>,
    cell: ({ row }) => <div className="text-right">{row.original.mediaAtivaKwhDia.toFixed(2)}</div>
  },
];

export default function EnergyDataTable({ data }: { data: EnergyData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'leituraDate', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filtrar por Mês/Ano..."
          value={(table.getColumn('mesAno')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('mesAno')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} de {data.length} linha(s) exibidas.
        </div>
        <div className="space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Próximo
            </Button>
        </div>
      </div>
    </div>
  );
}
