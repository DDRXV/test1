import { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelData } from '@/lib/data';

type ProcessingTimeChartProps = {
  data: FunnelData[];
};

const ProcessingTimeChart = ({ data }: ProcessingTimeChartProps) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.Stage,
      time: item.Average_Processing_Time_Seconds,
    }));
  }, [data]);

  return (
    <Card className="card-data h-[300px]">
      <CardHeader>
        <CardTitle>Average Processing Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, 'dataMax + 0.5']}
              tickCount={5}
              tick={{ fontSize: 12 }}
              label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-md shadow-md p-3">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-info">
                        Processing Time: {payload[0].value.toFixed(1)} seconds
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="time"
              stroke="#2ca02c"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProcessingTimeChart;
