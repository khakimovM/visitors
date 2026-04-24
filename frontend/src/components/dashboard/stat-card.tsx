import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, variant = 'default' }: StatCardProps) => {
    const iconBgColors = {
        default: 'bg-primary/10 text-primary',
        success: 'bg-accent/10 text-accent',
        warning: 'bg-warning/10 text-warning',
        danger: 'bg-destructive/10 text-destructive',
    };

    return (
        <div className="stat-card">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {trend && trendValue && (
                        <p className={cn(
                            "text-sm font-medium",
                            trend === 'up' && "text-accent",
                            trend === 'down' && "text-destructive",
                            trend === 'neutral' && "text-muted-foreground"
                        )}>
                            {trend === 'up' && '↑ '}
                            {trend === 'down' && '↓ '}
                            {trendValue}
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-xl", iconBgColors[variant])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
