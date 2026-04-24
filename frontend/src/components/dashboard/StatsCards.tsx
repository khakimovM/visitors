import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsCardsProps {
  currentVisitors: number;
  todayEntries: number;
  todayExits: number;
  avgWaitTime: number;
  occupancyRate?: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  currentVisitors,
  todayEntries,
  todayExits,
  avgWaitTime,
  occupancyRate = 68
}) => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('dashboard.currentVisitors'),
      value: currentVisitors,
      icon: Users,
      change: '+5%',
      changeType: 'positive' as const,
      badge: t('dashboard.realTime'),
      gradient: 'bg-gradient-primary',
    },
    {
      title: t('dashboard.todayEntries'),
      value: todayEntries,
      icon: UserCheck,
      change: '+12%',
      changeType: 'positive' as const,
      badge: null,
      gradient: 'bg-gradient-success',
    },
    {
      title: t('dashboard.todayExits'),
      value: todayExits,
      icon: UserX,
      change: '+8%',
      changeType: 'positive' as const,
      badge: null,
      gradient: 'bg-gradient-warning',
    },
    {
      title: t('dashboard.avgWaitTime'),
      value: `${avgWaitTime} min`,
      icon: Clock,
      change: '-3 min',
      changeType: 'positive' as const,
      badge: null,
      gradient: 'bg-gradient-info',
    },
  ];

  if (occupancyRate !== undefined) {
    stats.push({
      title: t('dashboard.occupancyRate'),
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      change: '+5%',
      changeType: 'positive' as const,
      badge: null,
      gradient: 'bg-gradient-primary',
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full stat-card interactive-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`stat-card-icon ${stat.gradient}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-3 h-3 text-success mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-error mr-1" />
                  )}
                  <span className={stat.changeType === 'positive' ? 'text-success' : 'text-error'}>
                    {stat.change}
                  </span>
                </div>
                {stat.badge && (
                  <Badge variant="outline" className="status-active text-xs">
                    <div className="pulse-dot w-2 h-2 bg-success rounded-full mr-1" />
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('dashboard.comparedToYesterday')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;