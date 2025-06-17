import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AllocationData {
  name: string;
  value: number;
}

interface AllocationChartProps {
  title: string;
  data: AllocationData[];
  colors?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function AllocationChart({ title, data, colors = COLORS }: AllocationChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formattedData = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => `${name} (${percentage}%)`}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'EUR'
                  })}`,
                  'Value'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 