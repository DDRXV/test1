import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Users, DollarSign, Circle as BarChart3, Clock, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DateRangePicker from '@/components/DateRangePicker';
import MetricCard from '@/components/MetricCard';
import FunnelChart from '@/components/FunnelChart';
import GatewayPerformanceChart from '@/components/GatewayPerformanceChart';
import ProcessingTimeChart from '@/components/ProcessingTimeChart';
import SatisfactionChart from '@/components/SatisfactionChart';
import RevenueChart from '@/components/RevenueChart';
import TransactionChart from '@/components/TransactionChart';
import { formatNumber, formatCurrency, formatPercentage, calculateChange } from '@/lib/utils';
import {
  getFunnelDataByDate,
  getLatestDate,
  getPreviousDate,
  getTotalUsers,
  getTotalRevenue,
  getOverallConversionRate,
  getAverageProcessingTime,
  getAverageSatisfactionScore,
  getGatewayData,
  getSatisfactionData } from
'@/lib/data';

const Dashboard = () => {
  const latestDate = getLatestDate();
  const [selectedDate, setSelectedDate] = useState<Date>(parseISO(latestDate));

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const previousDateString = getPreviousDate(dateString);

  const funnelData = useMemo(() => getFunnelDataByDate(dateString), [dateString]);
  const gatewayData = useMemo(() => getGatewayData(dateString), [dateString]);
  const satisfactionData = useMemo(() => getSatisfactionData(dateString), [dateString]);

  // Calculate metrics
  const totalUsers = getTotalUsers(dateString);
  const previousTotalUsers = getTotalUsers(previousDateString);
  const usersChange = calculateChange(totalUsers, previousTotalUsers);

  const totalRevenue = getTotalRevenue(dateString);
  const previousTotalRevenue = getTotalRevenue(previousDateString);
  const revenueChange = calculateChange(totalRevenue, previousTotalRevenue);

  const conversionRate = getOverallConversionRate(dateString);
  const previousConversionRate = getOverallConversionRate(previousDateString);
  const conversionChange = calculateChange(conversionRate, previousConversionRate);

  const processingTime = getAverageProcessingTime(dateString);
  const previousProcessingTime = getAverageProcessingTime(previousDateString);
  const processingTimeChange = calculateChange(previousProcessingTime, processingTime); // Inverted for better/worse logic

  const satisfactionScore = getAverageSatisfactionScore(dateString);
  const previousSatisfactionScore = getAverageSatisfactionScore(previousDateString);
  const satisfactionChange = calculateChange(satisfactionScore, previousSatisfactionScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <DateRangePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={formatNumber(totalUsers)}
          change={usersChange}
          icon={<Users className="h-5 w-5 text-primary" />} />

        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change={revenueChange}
          icon={<DollarSign className="h-5 w-5 text-secondary" />} />

        <MetricCard
          title="Conversion Rate"
          value={formatPercentage(conversionRate)}
          change={conversionChange}
          icon={<BarChart3 className="h-5 w-5 text-accent" />} />

        <MetricCard
          title="Avg. Processing Time"
          value={`${processingTime.toFixed(1)}s`}
          change={processingTimeChange}
          icon={<Clock className="h-5 w-5 text-info" />} />

      </div>
      
      <FunnelChart data={funnelData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GatewayPerformanceChart data={gatewayData} />
        <ProcessingTimeChart data={gatewayData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SatisfactionChart data={satisfactionData} />
        <TransactionChart data={funnelData} />
      </div>
      
      <RevenueChart />
    </div>);

};

export default Dashboard;