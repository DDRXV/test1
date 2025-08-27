import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelData } from '@/lib/data';

type SatisfactionChartProps = {
  data: FunnelData[];
};

const SatisfactionChart = ({ data }: SatisfactionChartProps) => {
  const chartData = useMemo(() => {
    return data
      .filter((item) => item.User_Satisfaction_Score > 0)
      .map((item) => ({
        name: item.Stage,
        score: item.User_Satisfaction_Score,
      }));
  }, [data]);

  return (
    <Card className="card-data h-[300px]">
      <CardHeader>
        <CardTitle>User Satisfaction Score</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, 5]}
              tickCount={6}
              tick={{ fontSize: 12 }}
              label={{ value: 'Score (0-5)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-md shadow-md p-3">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-accent">
                        Satisfaction: {payload[0].value.toFixed(1)}/5
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" fill="#9467bd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SatisfactionChart;
