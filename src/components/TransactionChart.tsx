import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import { FunnelData } from '@/lib/data';

type TransactionChartProps = {
  data: FunnelData[];
};

const TransactionChart = ({ data }: TransactionChartProps) => {
  const chartData = useMemo(() => {
    const successful = data.reduce((sum, item) => sum + item.Successful_Transactions, 0);
    const failed = data.reduce((sum, item) => sum + item.Failed_Transactions, 0);
    
    return [
      { name: 'Successful', value: successful },
      { name: 'Failed', value: failed },
    ];
  }, [data]);

  const COLORS = ['#2ca02c', '#d62728'];

  return (
    <Card className="card-data h-[300px]">
      <CardHeader>
        <CardTitle>Transaction Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-md shadow-md p-3">
                      <p className="font-medium" style={{ color: payload[0].color }}>
                        {payload[0].name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Count: {formatNumber(payload[0].value)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Percentage: {((payload[0].value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
