import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import DateRangePicker from '@/components/DateRangePicker';
import FunnelChart from '@/components/FunnelChart';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { getFunnelDataByDate, getLatestDate, getUniqueStages, getUniqueDates, getStageData } from '@/lib/data';

const FunnelAnalysis = () => {
  const latestDate = getLatestDate();
  const [selectedDate, setSelectedDate] = useState<Date>(parseISO(latestDate));
  const [activeTab, setActiveTab] = useState('overview');
  
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const funnelData = useMemo(() => getFunnelDataByDate(dateString), [dateString]);
  
  const stageNames = getUniqueStages();
  const dates = getUniqueDates();
  
  const stagePerformanceData = useMemo(() => {
    return stageNames.map(stage => {
      const stageData = getStageData(stage);
      return {
        name: stage,
        users: stageData.find(item => item.Date === dateString)?.Users || 0,
        conversionRate: stageData.find(item => item.Date === dateString)?.Conversion_Rate || 0
      };
    });
  }, [dateString, stageNames]);
  
  const stageTimelineData = useMemo(() => {
    return dates.map(date => {
      const dayData = getFunnelDataByDate(date);
      const result: { [key: string]: any } = { date };
      
      stageNames.forEach(stage => {
        const stageItem = dayData.find(item => item.Stage === stage);
        if (stageItem) {
          result[stage] = stageItem.Users;
        } else {
          result[stage] = 0;
        }
      });
      
      return result;
    });
  }, [dates, stageNames]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Funnel Analysis</h1>
        <DateRangePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <FunnelChart data={funnelData} />
            
            <Card>
              <CardHeader>
                <CardTitle>Funnel Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full data-table">
                    <thead className="data-table-header">
                      <tr>
                        <th className="data-table-cell">Stage</th>
                        <th className="data-table-cell">Users</th>
                        <th className="data-table-cell">Conversion Rate</th>
                        <th className="data-table-cell">Drop-off</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funnelData.map((item, index) => {
                        const previousUsers = index > 0 ? funnelData[index - 1].Users : item.Users;
                        const dropOff = previousUsers - item.Users;
                        const dropOffPercentage = (dropOff / previousUsers) * 100;
                        
                        return (
                          <tr key={item.Stage}>
                            <td className="data-table-cell">{item.Stage}</td>
                            <td className="data-table-cell">{formatNumber(item.Users)}</td>
                            <td className="data-table-cell">{formatPercentage(item.Conversion_Rate)}</td>
                            <td className="data-table-cell">
                              {index > 0 ? (
                                <span className="text-error">
                                  {formatNumber(dropOff)} ({dropOffPercentage.toFixed(1)}%)
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
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
        
        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card className="card-data h-[400px]">
              <CardHeader>
                <CardTitle>Stage Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stagePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#1f77b4" />
                    <YAxis yAxisId="right" orientation="right" stroke="#2ca02c" domain={[0, 100]} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border border-border rounded-md shadow-md p-3">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm" style={{ color: '#1f77b4' }}>
                                Users: {formatNumber(payload[0].value)}
                              </p>
                              <p className="text-sm" style={{ color: '#2ca02c' }}>
                                Conversion: {payload[1].value.toFixed(1)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="users" name="Users" fill="#1f77b4" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="conversionRate" name="Conversion Rate (%)" fill="#2ca02c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card className="card-data h-[500px]">
              <CardHeader>
                <CardTitle>Stage Timeline</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stageTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
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
                                  {entry.name}: {formatNumber(entry.value)}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    {stageNames.map((stage, index) => {
                      const colors = ['#1f77b4', '#9467bd', '#bcbd22', '#e377c2', '#2ca02c', '#8c564b'];
                      return (
                        <Line
                          key={stage}
                          type="monotone"
                          dataKey={stage}
                          name={stage}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunnelAnalysis;
