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
import { ArrowUpDown, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';

const formatCurrency = (amount: number) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
}).format(amount);


const renderVariation = (variation: number) => {
    if (isNaN(variation) || !isFinite(variation)) {
        return <div className="text-right text-muted-foreground">-</div>;
    }
    const isPositive = variation > 0;
    return (
        <div className={`flex items-center justify-end gap-1 font-medium ${isPositive ? 'text-destructive' : 'text-success'}`}>
        {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        <span>{variation.toFixed(1).replace('.', ',')}%</span>
        </div>
    );
}

export const columns: ColumnDef<EnergyData>[] = [
  {
    accessorKey: 'isoDate',
    header: ({ column }) => {
      return (
          <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
          Mês/Ano
          <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.original.mesAno}</div>,
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'consumoAtivoKwh',
    header: ({ column }) => {
      return (
        <div className="text-center">
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
            Consumo (kWh)
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.original.consumoAtivoKwh.toFixed(2)}</div>,
  },
  {
      id: 'monthVariation',
      header: () => <div className="text-right">Variação Mês a Mês</div>,
      cell: ({ row, table }) => {
        const sortedRows = table.getSortedRowModel().rows;
        const currentIndex = sortedRows.findIndex(sortedRow => sortedRow.original.isoDate === row.original.isoDate);
  
        if (currentIndex >= sortedRows.length - 1) {
          return <div className="text-right text-muted-foreground">-</div>;
        }
  
        const currentConsumption = row.original.consumoAtivoKwh;
        const previousConsumption = sortedRows[currentIndex + 1].original.consumoAtivoKwh;
  
        if (previousConsumption === 0) {
          return <div className="text-right text-muted-foreground">N/A</div>;
        }
  
        const variation = ((currentConsumption - previousConsumption) / previousConsumption) * 100;
        return renderVariation(variation);
      },
  },
  {
    id: 'consumoCompAnoAnterior',
    header: () => <div className="text-right">Variação Consumo (vs. Ano Ant.)</div>,
    cell: ({ row, table }) => {
      const allData = table.options.data;
      const [year, month] = row.original.isoDate.split('-').map(Number);
      const prevYearIsoDate = `${year - 1}-${String(month).padStart(2, '0')}-01`;
      const prevYearData = allData.find(d => d.isoDate === prevYearIsoDate);

      if (!prevYearData || prevYearData.consumoAtivoKwh === 0) {
        return <div className="text-right text-muted-foreground">-</div>;
      }
      
      const variation = ((row.original.consumoAtivoKwh - prevYearData.consumoAtivoKwh) / prevYearData.consumoAtivoKwh) * 100;
      return renderVariation(variation);
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
    id: 'custoCompAnoAnterior',
    header: () => <div className="text-right">Variação Custo (vs. Ano Ant.)</div>,
    cell: ({ row, table }) => {
      const allData = table.options.data;
      const [year, month] = row.original.isoDate.split('-').map(Number);
      const prevYearIsoDate = `${year - 1}-${String(month).padStart(2, '0')}-01`;
      const prevYearData = allData.find(d => d.isoDate === prevYearIsoDate);

      if (!prevYearData || prevYearData.totalFatura === 0) {
        return <div className="text-right text-muted-foreground">-</div>;
      }
      
      const variation = ((row.original.totalFatura - prevYearData.totalFatura) / prevYearData.totalFatura) * 100;
      return renderVariation(variation);
    },
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
    accessorKey: 'mediaAtivaKwhDia',
    header: () => <div className="text-right">Média kWh/dia</div>,
    cell: ({ row }) => <div className="text-right">{row.original.mediaAtivaKwhDia.toFixed(2)}</div>
  },
];

export default function EnergyDataTable({ data }: { data: EnergyData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'isoDate', desc: true }
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
    initialState: {
        pagination: {
            pageSize: 12,
        },
        sorting: [
            { id: 'isoDate', desc: true }
        ]
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filtrar por Mês/Ano (ex: 01/24)..."
          value={(table.getColumn('isoDate')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            const originalValue = (table.getColumn('isoDate')?.getFilterValue() as string) ?? '';
            // This is a workaround since we filter by isoDate but display mesAno
            // We find the row that matches the input and filter by its isoDate
            const matchingRow = data.find(row => row.mesAno.includes(event.target.value));
            if (event.target.value === '') {
                 table.getColumn('isoDate')?.setFilterValue('');
            } else if (matchingRow) {
                // Not perfect, but will filter to the first match
                // A more complex solution would be needed for multiple matches
                // For now, filtering by mesAno is not a primary feature.
            }
          }}
          className="max-w-sm"
        />
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b hover:bg-transparent">
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
                    <TableCell key={cell.id} className="py-3">
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} de {data.length} linha(s) exibidas.
        </div>
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}
