import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelData } from '@/lib/data';

type GatewayPerformanceChartProps = {
  data: FunnelData[];
};

const GatewayPerformanceChart = ({ data }: GatewayPerformanceChartProps) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.Stage,
      'Gateway A': item.Gateway_A_Success_Rate,
      'Gateway B': item.Gateway_B_Success_Rate,
      'Gateway C': item.Gateway_C_Success_Rate,
    }));
  }, [data]);

  return (
    <Card className="card-data h-[300px]">
      <CardHeader>
        <CardTitle>Payment Gateway Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[80, 100]}
              tickCount={5}
              tick={{ fontSize: 12 }}
              label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-md shadow-md p-3">
                      <p className="font-medium">{label}</p>
                      {payload.map((entry) => (
                        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {entry.value.toFixed(1)}%
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="Gateway A" fill="#1f77b4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Gateway B" fill="#2ca02c" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Gateway C" fill="#9467bd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GatewayPerformanceChart;
