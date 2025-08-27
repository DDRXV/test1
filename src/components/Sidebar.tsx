import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Circle as BarChart3, Pi as PieChart, CreditCard, Settings, ChevronLeft, ChevronRight, LineChart } from 'lucide-react';

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const routes = [
  {
    label: 'Dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/'
  },
  {
    label: 'Funnel Analysis',
    icon: <PieChart className="h-5 w-5" />,
    href: '/funnel'
  },
  {
    label: 'Payment Gateways',
    icon: <CreditCard className="h-5 w-5" />,
    href: '/gateways'
  },
  {
    label: 'User Satisfaction',
    icon: <LineChart className="h-5 w-5" />,
    href: '/satisfaction'
  },
  {
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings'
  }];


  return (
    <div
      className={cn(
        'relative h-full bg-card border-r border-border transition-all duration-300 ease-in-out',
        open ? 'w-64' : 'w-16'
      )}>

      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <div
          className={cn(
            'flex items-center gap-2 overflow-hidden transition-all duration-300',
            open ? 'opacity-100' : 'opacity-0'
          )}>

          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg whitespace-nowrap">Funnel Analytics</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-4"
          onClick={() => setOpen(!open)}>

          {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="py-4 px-2">
          <nav className="space-y-1">
            {routes.map((route) =>
            <NavLink
              key={route.href}
              to={route.href}
              className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive ?
                'bg-primary/10 text-primary' :
                'hover:bg-muted text-foreground/80 hover:text-foreground',
                !open && 'justify-center'
              )
              }>

                {route.icon}
                <span
                className={cn(
                  'transition-all duration-300',
                  open ? 'opacity-100' : 'opacity-0 w-0 hidden'
                )}>

                  {route.label}
                </span>
              </NavLink>
            )}
          </nav>
        </div>
      </ScrollArea>
    </div>);

};

export default Sidebar;