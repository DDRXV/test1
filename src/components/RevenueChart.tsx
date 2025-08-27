import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { getUniqueDates, getRevenueData } from '@/lib/data';

const RevenueChart = () => {
  const chartData = useMemo(() => {
    const dates = getUniqueDates();
    const revenueData = getRevenueData();
    
    return dates.map(date => {
      const dayData = revenueData.find(item => item.Date === date);
      return {
        date,
        revenue: dayData ? dayData.Revenue_USD : 0
      };
    });
  }, []);

  return (
    <Card className="card-data h-[300px]">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}k`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const date = new Date(label);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  
                  return (
                    <div className="bg-popover border border-border rounded-md shadow-md p-3">
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-sm text-secondary">
                        Revenue: {formatCurrency(payload[0].value)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2ca02c" 
              fill="#2ca02c20" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
