import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceData {
  date: Date | string;
  value: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title?: string;
}

export function PerformanceChart({ data, title }: PerformanceChartProps) {
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return date;
    }
    return date.toLocaleDateString();
  };

  const formatValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatValue}
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                formatter={(value: number) => formatValue(value)}
                labelFormatter={formatDate}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 