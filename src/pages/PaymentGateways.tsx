import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import DateRangePicker from '@/components/DateRangePicker';
import GatewayPerformanceChart from '@/components/GatewayPerformanceChart';
import ProcessingTimeChart from '@/components/ProcessingTimeChart';
import { formatNumber } from '@/lib/utils';
import { getFunnelDataByDate, getLatestDate, getGatewayData, getUniqueDates } from '@/lib/data';

const PaymentGateways = () => {
  const latestDate = getLatestDate();
  const [selectedDate, setSelectedDate] = useState<Date>(parseISO(latestDate));
  const [activeTab, setActiveTab] = useState('performance');
  
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const gatewayData = useMemo(() => getGatewayData(dateString), [dateString]);
  
  const dates = getUniqueDates();
  
  const gatewayTimelineData = useMemo(() => {
    return dates.map(date => {
      const dayData = getGatewayData(date);
      if (dayData.length === 0) return null;
      
      const avgA = dayData.reduce((sum, item) => sum + item.Gateway_A_Success_Rate, 0) / dayData.length;
      const avgB = dayData.reduce((sum, item) => sum + item.Gateway_B_Success_Rate, 0) / dayData.length;
      const avgC = dayData.reduce((sum, item) => sum + item.Gateway_C_Success_Rate, 0) / dayData.length;
      
      return {
        date,
        'Gateway A': avgA,
        'Gateway B': avgB,
        'Gateway C': avgC
      };
    }).filter(Boolean);
  }, [dates]);
  
  const transactionData = useMemo(() => {
    const successful = gatewayData.reduce((sum, item) => sum + item.Successful_Transactions, 0);
    const failed = gatewayData.reduce((sum, item) => sum + item.Failed_Transactions, 0);
    
    return [
      { name: 'Successful', value: successful },
      { name: 'Failed', value: failed },
    ];
  }, [gatewayData]);
  
  const COLORS = ['#2ca02c', '#d62728'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Gateway Analysis</h1>
        <DateRangePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <GatewayPerformanceChart data={gatewayData} />
            
            <Card>
              <CardHeader>
                <CardTitle>Gateway Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full data-table">
                    <thead className="data-table-header">
                      <tr>
                        <th className="data-table-cell">Stage</th>
                        <th className="data-table-cell">Gateway A</th>
                        <th className="data-table-cell">Gateway B</th>
                        <th className="data-table-cell">Gateway C</th>
                        <th className="data-table-cell">Processing Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gatewayData.map((item) => (
                        <tr key={item.Stage}>
                          <td className="data-table-cell">{item.Stage}</td>
                          <td className="data-table-cell">{item.Gateway_A_Success_Rate.toFixed(1)}%</td>
                          <td className="data-table-cell">{item.Gateway_B_Success_Rate.toFixed(1)}%</td>
                          <td className="data-table-cell">{item.Gateway_C_Success_Rate.toFixed(1)}%</td>
                          <td className="data-table-cell">{item.Average_Processing_Time_Seconds.toFixed(1)}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <ProcessingTimeChart data={gatewayData} />
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card className="card-data h-[500px]">
              <CardHeader>
                <CardTitle>Gateway Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gatewayTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis domain={[80, 100]} />
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
                    <Line type="monotone" dataKey="Gateway A" stroke="#1f77b4" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Gateway B" stroke="#2ca02c" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Gateway C" stroke="#9467bd" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-data h-[400px]">
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      labelLine={false}
                    >
                      {transactionData.map((entry, index) => (
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
                                Percentage: {((payload[0].value / transactionData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
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
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
                    <p className="text-2xl font-bold">
                      {formatNumber(transactionData.reduce((sum, item) => sum + item.value, 0))}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Successful Transactions</h3>
                    <p className="text-2xl font-bold text-success">
                      {formatNumber(transactionData[0].value)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Failed Transactions</h3>
                    <p className="text-2xl font-bold text-error">
                      {formatNumber(transactionData[1].value)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
                    <p className="text-2xl font-bold">
                      {((transactionData[0].value / transactionData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentGateways;
