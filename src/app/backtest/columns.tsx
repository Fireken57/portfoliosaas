import { ColumnDef } from '@tanstack/react-table';
import { Trade } from '@/features/trading/types';
import { format } from 'date-fns';

export const columns: ColumnDef<Trade>[] = [
  {
    accessorKey: 'asset',
    header: 'Asset',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'entryPrice',
    header: 'Entry Price',
    cell: ({ row }) => `$${row.original.entryPrice.toFixed(2)}`,
  },
  {
    accessorKey: 'exitPrice',
    header: 'Exit Price',
    cell: ({ row }) =>
      row.original.exitPrice ? `$${row.original.exitPrice.toFixed(2)}` : '-',
  },
  {
    accessorKey: 'pnl',
    header: 'P&L',
    cell: ({ row }) => {
      const pnl = row.original.pnl;
      return (
        <span className={pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
          ${pnl.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: 'fees',
    header: 'Fees',
    cell: ({ row }) => `$${row.original.fees.toFixed(2)}`,
  },
  {
    accessorKey: 'entryDate',
    header: 'Entry Date',
    cell: ({ row }) => format(new Date(row.original.entryDate), 'MMM d, yyyy'),
  },
  {
    accessorKey: 'exitDate',
    header: 'Exit Date',
    cell: ({ row }) =>
      row.original.exitDate
        ? format(new Date(row.original.exitDate), 'MMM d, yyyy')
        : '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={
          row.original.status === 'OPEN'
            ? 'text-blue-500'
            : row.original.status === 'CLOSED'
            ? 'text-green-500'
            : 'text-gray-500'
        }
      >
        {row.original.status}
      </span>
    ),
  },
]; 