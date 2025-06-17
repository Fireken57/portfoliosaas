import { ColumnDef } from '@tanstack/react-table';
import { MarketData } from '@/features/trading/types';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<MarketData>[] = [
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as Date;
      return timestamp.toLocaleTimeString();
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: 'change',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const change = parseFloat(row.getValue('change'));
      const formatted = new Intl.NumberFormat('en-US', {
        signDisplay: 'always',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(change);
      return (
        <div className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: 'changePercent',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Change %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const changePercent = parseFloat(row.getValue('changePercent'));
      const formatted = new Intl.NumberFormat('en-US', {
        signDisplay: 'always',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(changePercent);
      return (
        <div className={changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
          {formatted}%
        </div>
      );
    },
  },
  {
    accessorKey: 'volume',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Volume
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const volume = parseFloat(row.getValue('volume'));
      const formatted = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(volume);
      return formatted;
    },
  },
  {
    accessorKey: 'high',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          High
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const high = parseFloat(row.getValue('high'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(high);
      return formatted;
    },
  },
  {
    accessorKey: 'low',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Low
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const low = parseFloat(row.getValue('low'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(low);
      return formatted;
    },
  },
]; 