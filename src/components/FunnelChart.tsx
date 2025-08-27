import { useMemo } from 'react';
import { ResponsiveContainer, Funnel, FunnelChart as RechartsFunnelChart, LabelList, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { FunnelData } from '@/lib/data';

type FunnelChartProps = {
  data: FunnelData[];
};

const FunnelChart = ({ data }: FunnelChartProps) => {
  const funnelData = useMemo(() => {
    return data.map((item) => ({
      name: item.Stage,
      value: item.Users,
      conversionRate: item.Conversion_Rate,
      fill: getFillColor(item.Stage),
    }));
  }, [data]);

  return (
    <Card className="card-data h-[400px]">
      <CardHeader>
        <CardTitle>Funnel Conversion</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsFunnelChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border border-border rounded-md shadow-md p-3">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Users: {formatNumber(data.value)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Conversion: {formatPercentage(data.conversionRate)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive
              labelLine={false}
            >
              <LabelList
                position="right"
                fill="#fff"
                stroke="none"
                dataKey="name"
                className="text-xs"
              />
              <LabelList
                position="right"
                fill="#fff"
                stroke="none"
                dataKey="value"
                formatter={formatNumber}
                offset={60}
                className="text-xs"
              />
            </Funnel>
          </RechartsFunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

function getFillColor(stage: string): string {
  switch (stage) {
    case 'Awareness':
      return '#1f77b4'; // Blue
    case 'Interest':
      return '#9467bd'; // Purple
    case 'Consideration':
      return '#bcbd22'; // Yellow-green
    case 'Trial':
      return '#e377c2'; // Pink
    case 'Activation':
      return '#2ca02c'; // Green
    case 'Purchase':
      return '#8c564b'; // Brown
    default:
      return '#7f7f7f'; // Gray
  }
}

export default FunnelChart;
