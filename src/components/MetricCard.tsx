import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricCardProps = {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  description?: string;
};

const MetricCard = ({ title, value, change, icon, description }: MetricCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isNeutral = change === 0 || change === undefined;

  return (
    <Card className="card-metric">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-md">{icon}</div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold">{value}</div>
        {!isNeutral && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <ArrowUp className="h-4 w-4 text-success" />
            ) : (
              <ArrowDown className="h-4 w-4 text-error" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                isPositive && 'text-success',
                isNegative && 'text-error'
              )}
            >
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">from previous day</span>
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
