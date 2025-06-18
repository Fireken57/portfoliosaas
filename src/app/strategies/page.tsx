'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StrategyService } from '@/features/trading/services/strategy';
import { Strategy } from '@/features/trading/types';
import { useToast } from '@/components/ui/use-toast';

const strategyTypes = [
  { value: 'TREND', label: 'Trend Following' },
  { value: 'MEAN_REVERSION', label: 'Mean Reversion' },
  { value: 'BREAKOUT', label: 'Breakout' },
  { value: 'CUSTOM', label: 'Custom' },
];

export default function StrategiesPage() {
  const [strategyService] = useState(() => new StrategyService());
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [newStrategy, setNewStrategy] = useState<Partial<Strategy>>({
    type: 'TREND',
    parameters: {},
  });
  const { toast } = useToast();

  useEffect(() => {
    setStrategies(strategyService.getStrategies());
  }, [strategyService]);

  const handleCreateStrategy = () => {
    if (!newStrategy.name || !newStrategy.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const strategy: Strategy = {
      id: `strategy-${Date.now()}`,
      name: newStrategy.name,
      description: newStrategy.description,
      type: newStrategy.type as Strategy['type'],
      parameters: newStrategy.parameters || {},
      entryRules: (data: any) => false,
      exitRules: (data: any) => false,
      performance: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        profitFactor: 0,
        totalPnl: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
      },
    };

    strategyService.addStrategy(strategy);
    setStrategies(strategyService.getStrategies());
    setNewStrategy({
      type: 'TREND',
      parameters: {},
    });

    toast({
      title: 'Success',
      description: 'Strategy created successfully',
    });
  };

  const handleUpdateStrategy = (id: string, updates: Partial<Strategy>) => {
    strategyService.updateStrategy(id, updates);
    setStrategies(strategyService.getStrategies());
    toast({
      title: 'Success',
      description: 'Strategy updated successfully',
    });
  };

  const handleDeleteStrategy = (id: string) => {
    strategyService.deleteStrategy(id);
    setStrategies(strategyService.getStrategies());
    toast({
      title: 'Success',
      description: 'Strategy deleted successfully',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Trading Strategies</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newStrategy.name || ''}
                  onChange={(e) =>
                    setNewStrategy((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Strategy name"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={newStrategy.description || ''}
                  onChange={(e) =>
                    setNewStrategy((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Strategy description"
                />
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={newStrategy.type}
                  onValueChange={(value) =>
                    setNewStrategy((prev) => ({ ...prev, type: value as "TREND" | "MEAN_REVERSION" | "BREAKOUT" | "CUSTOM" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateStrategy} className="w-full">
                Create Strategy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{strategy.name}</h3>
                    <p className="text-sm text-gray-500">{strategy.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Type:</span>{' '}
                        {strategyTypes.find((t) => t.value === strategy.type)?.label}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Total Trades:</span>{' '}
                        {strategy.performance.totalTrades}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Win Rate:</span>{' '}
                        {strategy.performance.winRate.toFixed(1)}%
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Total P&L:</span>{' '}
                        ${strategy.performance.totalPnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStrategy(strategy)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStrategy(strategy.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedStrategy && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Edit Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={selectedStrategy.name}
                  onChange={(e) =>
                    handleUpdateStrategy(selectedStrategy.id, {
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={selectedStrategy.description}
                  onChange={(e) =>
                    handleUpdateStrategy(selectedStrategy.id, {
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={selectedStrategy.type}
                  onValueChange={(value) =>
                    handleUpdateStrategy(selectedStrategy.id, {
                      type: value as Strategy['type'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedStrategy(null)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setSelectedStrategy(null)}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 