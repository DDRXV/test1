import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import DateRangePicker from '@/components/DateRangePicker';
import SatisfactionChart from '@/components/SatisfactionChart';
import { formatNumber } from '@/lib/utils';
import { getFunnelDataByDate, getLatestDate, getSatisfactionData, getUniqueDates } from '@/lib/data';

const UserSatisfaction = () => {
  const latestDate = getLatestDate();
  const [selectedDate, setSelectedDate] = useState<Date>(parseISO(latestDate));
  const [activeTab, setActiveTab] = useState('overview');
  
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const satisfactionData = useMemo(() => getSatisfactionData(dateString), [dateString]);
  
  const dates = getUniqueDates();
  
  const satisfactionTimelineData = useMemo(() => {
    return dates.map(date => {
      const dayData = getSatisfactionData(date);
      if (dayData.length === 0) return null;
      
      const avgScore = dayData.reduce((sum, item) => sum + item.User_Satisfaction_Score, 0) / dayData.length;
      
      return {
        date,
        score: avgScore
      };
    }).filter(Boolean);
  }, [dates]);
  
  const radarData = useMemo(() => {
    return satisfactionData.map(item => ({
      stage: item.Stage,
      score: item.User_Satisfaction_Score,
      transactions: item.Successful_Transactions + item.Failed_Transactions
    }));
  }, [satisfactionData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Satisfaction</h1>
        <DateRangePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <SatisfactionChart data={satisfactionData} />
            
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full data-table">
                    <thead className="data-table-header">
                      <tr>
                        <th className="data-table-cell">Stage</th>
                        <th className="data-table-cell">Satisfaction Score</th>
                        <th className="data-table-cell">Transactions</th>
                        <th className="data-table-cell">Failed Transactions</th>
                        <th className="data-table-cell">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {satisfactionData.map((item) => {
                        const totalTransactions = item.Successful_Transactions + item.Failed_Transactions;
                        const successRate = totalTransactions > 0 
                          ? (item.Successful_Transactions / totalTransactions) * 100 
                          : 0;
                        
                        return (
                          <tr key={item.Stage}>
                            <td className="data-table-cell">{item.Stage}</td>
                            <td className="data-table-cell">{item.User_Satisfaction_Score.toFixed(1)}/5</td>
                            <td className="data-table-cell">{formatNumber(totalTransactions)}</td>
                            <td className="data-table-cell">{formatNumber(item.Failed_Transactions)}</td>
                            <td className="data-table-cell">{successRate.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card className="card-data h-[400px]">
              <CardHeader>
                <CardTitle>Satisfaction Score Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={satisfactionTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis domain={[0, 5]} />
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
                              <p className="text-sm" style={{ color: '#9467bd' }}>
                                Satisfaction: {payload[0].value.toFixed(1)}/5
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#9467bd" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-data h-[400px]">
              <CardHeader>
                <CardTitle>Satisfaction by Stage</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="stage" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar name="Satisfaction Score" dataKey="score" stroke="#9467bd" fill="#9467bd" fillOpacity={0.6} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border border-border rounded-md shadow-md p-3">
                              <p className="font-medium">{payload[0].payload.stage}</p>
                              <p className="text-sm" style={{ color: '#9467bd' }}>
                                Satisfaction: {payload[0].value.toFixed(1)}/5
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Transactions: {formatNumber(payload[0].payload.transactions)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="card-data h-[400px]">
              <CardHeader>
                <CardTitle>Satisfaction vs Transactions</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="stage" />
                    <YAxis yAxisId="left" orientation="left" stroke="#9467bd" domain={[0, 5]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#1f77b4" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border border-border rounded-md shadow-md p-3">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm" style={{ color: '#9467bd' }}>
                                Satisfaction: {payload[0].value.toFixed(1)}/5
                              </p>
                              <p className="text-sm" style={{ color: '#1f77b4' }}>
                                Transactions: {formatNumber(payload[1].value)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="score" name="Satisfaction Score" fill="#9467bd" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="transactions" name="Transactions" fill="#1f77b4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSatisfaction;
