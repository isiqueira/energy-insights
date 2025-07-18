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
import { type WaterData } from '@/types/water';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from './ui/button';
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

export const columns: ColumnDef<WaterData>[] = [
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
    accessorKey: 'consumo',
    header: ({ column }) => {
      return (
        <div className="text-center">
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
            Consumo (m³)
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.original.consumo}</div>,
  },
  {
      id: 'monthVariation',
      header: () => <div className="text-right">Variação Mês a Mês</div>,
      cell: ({ row, table }) => {
        const sortedRows = table.getSortedRowModel().rows;
        const currentIndex = sortedRows.findIndex(sortedRow => sortedRow.original.isoDate === row.original.isoDate);
  
        if (currentIndex <= 0) { 
          return <div className="text-right text-muted-foreground">-</div>;
        }
  
        const currentConsumption = row.original.consumo;
        const previousConsumption = sortedRows[currentIndex - 1].original.consumo;
  
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
      if (!row.original.isoDate) return <div className="text-right text-muted-foreground">-</div>;
      
      const allData = table.options.data;
      const [year, month] = row.original.isoDate.split('-').map(Number);
      const prevYearIsoDate = `${year - 1}-${String(month).padStart(2, '0')}-01`;
      const prevYearData = allData.find(d => d.isoDate === prevYearIsoDate);

      if (!prevYearData || prevYearData.consumo === 0) {
        return <div className="text-right text-muted-foreground">-</div>;
      }
      
      const variation = ((row.original.consumo - prevYearData.consumo) / prevYearData.consumo) * 100;
      return renderVariation(variation);
    },
  },
  {
    accessorKey: 'valor',
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
        const amount = parseFloat(String(row.original.valor))
        const formatted = formatCurrency(amount);
        return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    id: 'custoCompAnoAnterior',
    header: () => <div className="text-right">Variação Custo (vs. Ano Ant.)</div>,
    cell: ({ row, table }) => {
      if (!row.original.isoDate) return <div className="text-right text-muted-foreground">-</div>;

      const allData = table.options.data;
      const [year, month] = row.original.isoDate.split('-').map(Number);
      const prevYearIsoDate = `${year - 1}-${String(month).padStart(2, '0')}-01`;
      const prevYearData = allData.find(d => d.isoDate === prevYearIsoDate);

      if (!prevYearData || prevYearData.valor === 0) {
        return <div className="text-right text-muted-foreground">-</div>;
      }
      
      const variation = ((row.original.valor - prevYearData.valor) / prevYearData.valor) * 100;
      return renderVariation(variation);
    },
  },
  {
    id: 'custoM3',
    header: () => <div className="text-right">Custo/m³ (R$)</div>,
    cell: ({ row }) => {
      const totalFatura = row.original.valor;
      const consumoM3 = row.original.consumo;

      if (consumoM3 === 0) {
        return <div className="text-right text-muted-foreground">N/A</div>;
      }

      const custoM3 = totalFatura / consumoM3;
      const formatted = formatCurrency(custoM3);

      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: 'periodoConsumo',
    header: () => <div className="text-right">Dias</div>,
    cell: ({ row }) => <div className="text-right">{row.original.periodoConsumo}</div>
  },
];

export default function WaterDataTable({ data }: { data: WaterData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
        id: 'isoDate',
        desc: true,
    }
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
        pagination: {
            pageSize: 12,
        },
    }
  });

  return (
    <div className="w-full">
      <div className="py-4"></div>
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
