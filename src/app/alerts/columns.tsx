'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Alert } from '@/features/trading/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ColumnProps {
  onDelete: (id: string) => Promise<void>;
  onSymbolClick: (symbol: string) => void;
}

export const columns = ({
  onDelete,
  onSymbolClick,
}: ColumnProps): ColumnDef<Alert>[] => [
  {
    accessorKey: 'symbol',
    header: 'Symbol',
    cell: ({ row }) => (
      <Button
        variant="link"
        onClick={() => onSymbolClick(row.original.symbol)}
        className="p-0 h-auto font-medium"
      >
        {row.original.symbol}
      </Button>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <span
          className={`px-2 py-1 rounded text-sm ${
            type === 'PRICE'
              ? 'bg-blue-100 text-blue-800'
              : type === 'VOLUME'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: 'condition',
    header: 'Condition',
    cell: ({ row }) => {
      const condition = row.getValue('condition') as string;
      const value = row.getValue('value') as number;
      return `${condition} ${value}`;
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => row.original.value.toFixed(2),
  },
  {
    accessorKey: 'message',
    header: 'Message',
  },
  {
    accessorKey: 'triggered',
    header: 'Status',
    cell: ({ row }) => {
      const triggered = row.getValue('triggered') as boolean;
      return (
        <span
          className={`px-2 py-1 rounded text-sm ${
            triggered
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {triggered ? 'Triggered' : 'Active'}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return new Date(date).toLocaleString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(row.original.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ),
  },
]; 