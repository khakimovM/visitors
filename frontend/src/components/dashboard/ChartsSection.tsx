import React from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface ChartsSectionProps {
  weeklyData: Array<{
    date: string;
    kirganlar: number;
    chiqqanlar: number;
  }>;
  branchData: Array<{
    name: string;
    kirganlar: number;
    chiqqanlar: number;
  }>;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ weeklyData, branchData }) => {
  const { t } = useLanguage();

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: t('toast.exportStarted'),
      description: `${t('toast.exportDesc')} ${format.toUpperCase()}`,
    });
  };

  // Peak hours data
  const peakHoursData = [
    { hour: '08:00', visitors: 15 },
    { hour: '09:00', visitors: 32 },
    { hour: '10:00', visitors: 45 },
    { hour: '11:00', visitors: 68 },
    { hour: '12:00', visitors: 89 },
    { hour: '13:00', visitors: 95 },
    { hour: '14:00', visitors: 78 },
    { hour: '15:00', visitors: 56 },
    { hour: '16:00', visitors: 43 },
    { hour: '17:00', visitors: 62 },
    { hour: '18:00', visitors: 87 },
    { hour: '19:00', visitors: 92 },
    { hour: '20:00', visitors: 76 },
    { hour: '21:00', visitors: 45 },
  ];

  // Customer segments data
  const customerSegments = [
    { name: 'Yangi mijozlar', value: 35, color: 'hsl(var(--primary))' },
    { name: 'Qaytgan mijozlar', value: 45, color: 'hsl(var(--success))' },
    { name: 'VIP mijozlar', value: 20, color: 'hsl(var(--warning))' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
      {/* Weekly Statistics */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="h-full chart-container">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('dashboard.weeklyStats')}
                </CardTitle>
                <CardDescription>{t('dashboard.entriesExits')}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="kirganlar" 
                  fill="hsl(var(--primary))" 
                  name={t('dashboard.entries')}
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="chiqqanlar" 
                  fill="hsl(var(--warning))" 
                  name={t('dashboard.exits')}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Branch Statistics */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="chart-container">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('dashboard.branchStats')}</CardTitle>
                <CardDescription>{t('dashboard.todayStatsDesc')}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={branchData}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={100}
                  tick={{ textAnchor: 'end' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="kirganlar" 
                  fill="hsl(var(--primary))" 
                  name={t('dashboard.entries')}
                  radius={[0, 4, 4, 0]}
                />
                <Bar 
                  dataKey="chiqqanlar" 
                  fill="hsl(var(--secondary))" 
                  name={t('dashboard.exits')}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">{t('dashboard.entries')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-sm text-muted-foreground">{t('dashboard.exits')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Peak Hours Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="h-full chart-container">
          <CardHeader>
            <CardTitle>Eng band vaqtlar</CardTitle>
            <CardDescription>Soatlik mijozlar oqimi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Segments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Mijozlar segmentlari</CardTitle>
            <CardDescription>Mijozlar turlari bo'yicha taqsimot</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-sm">{segment.name}</span>
                  </div>
                  <span className="text-sm font-medium">{segment.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChartsSection;