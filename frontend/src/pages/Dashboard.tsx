import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, ArrowUpRight, ArrowDownRight, Clock, Activity, TrendingUp, CalendarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays } from 'date-fns';
import { ExportDropdown } from '@/components/ExportDropdown';
import { useCreateDevice } from '@/hooks/useTrafficApi';
import { useBranches, useDayStatistics, useTodayBranches, useVisitorsData } from '@/hooks/useAnalyticsApi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

const timeRanges = [
  { value: '7', labelKey: 'dashboard.last7Days' },
  { value: '14', labelKey: 'dashboard.last14Days' },
  { value: '30', labelKey: 'dashboard.last30Days' },
];

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [selectedBranch, setSelectedBranch] = useState<number | 'all'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedDay] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  // Dropdown o'zgarganda dateRange ham yangilanadi
  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    setDateRange({
      from: subDays(new Date(), parseInt(value)),
      to: new Date(),
    });
  };

  // Dropdown tanloviga qarab sarlavha va tavsif
  const chartTitle = useMemo(() => {
    const map: Record<string, string> = {
      '7': t('dashboard.chartTitle7'),
      '14': t('dashboard.chartTitle14'),
      '30': t('dashboard.chartTitle30'),
    };
    return map[selectedTimeRange] ?? t('dashboard.chartTitle7');
  }, [selectedTimeRange, t]);

  const chartDesc = useMemo(() => {
    const map: Record<string, string> = {
      '7': t('dashboard.chartDesc7'),
      '14': t('dashboard.chartDesc14'),
      '30': t('dashboard.chartDesc30'),
    };
    return map[selectedTimeRange] ?? t('dashboard.chartDesc7');
  }, [selectedTimeRange, t]);

  // dateRange dan API uchun string format
  const apiDateRange = useMemo(() => ({
    from: format(dateRange.from, 'yyyy-MM-dd'),
    to: format(dateRange.to, 'yyyy-MM-dd'),
    ...(isAdmin && selectedBranch !== 'all' ? { branchId: selectedBranch as number } : {}),
  }), [dateRange, isAdmin, selectedBranch]);

  // Fetch data using TanStack Query
  const { data: visitorsData, isLoading: isLoadingVisitors, error: visitorsError } = useVisitorsData(apiDateRange);
  const { data: todayBranches, isLoading: isLoadingTodayBranches, error: todayBranchesError } = useTodayBranches();
  const { data: branches, isLoading: isLoadingBranches, error: branchesError } = useBranches();
  const { data: dayStatistics, isLoading: isLoadingDayStats, error: dayStatsError } = useDayStatistics({ day: selectedDay });

  // Device creation mutation
  const createDeviceMutation = useCreateDevice();

  const isLoading = isLoadingVisitors || isLoadingTodayBranches || isLoadingBranches;

  // Show errors if any
  if (visitorsError) {
    toast.error(t('error'), { description: t('dashboard.errorLoadingData') });
  }
  if (todayBranchesError) {
    toast.error(t('error'), { description: t('dashboard.errorLoadingData') });
  }
  if (branchesError) {
    toast.error(t('error'), { description: t('dashboard.errorLoadingData') });
  }
  if (dayStatsError) {
    toast.error(t('error'), { description: t('errorLoadingData') });
  }

  // Transform visitors data for chart
  const chartData = useMemo(() => {
    if (!visitorsData) return [];
    return visitorsData.map(item => ({
      date: format(new Date(item.date), 'dd MMM'),
      kirish: item.inCount,
      chiqish: item.outCount,
      jami: item.inCount + item.outCount,
    }));
  }, [visitorsData]);

  // Transform hourly statistics for line chart
  const hourlyChartData = useMemo(() => {
    if (!dayStatistics) return [];
    return dayStatistics.map(item => ({
      hour: `${item.hour}:00`,
      kirish: item.inCount,
      chiqish: item.outCount,
    }));
  }, [dayStatistics]);

  // Transform branch data for horizontal chart
  const branchChartData = useMemo(() => {
    if (!todayBranches) return [];

    const filtered =
      selectedBranch === 'all'
        ? todayBranches
        : todayBranches.filter(b => b.userId === selectedBranch);

    return filtered.map(item => ({
      name: item.username,     // 👈 Y-axis label
      kirish: item.inCount,
      chiqish: item.outCount,
    }));
  }, [todayBranches, selectedBranch]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    if (!todayBranches) {
      return { todayIn: 0, todayOut: 0, currentVisitors: 0, avgWait: 0 };
    }

    const filtered =
      selectedBranch === 'all'
        ? todayBranches
        : todayBranches.filter(b => b.userId === selectedBranch);

    const todayIn = filtered.reduce((sum, b) => sum + b.inCount, 0);
    const todayOut = filtered.reduce((sum, b) => sum + b.outCount, 0);
    const currentVisitors = todayIn - todayOut;
    const totalTraffic = todayIn + todayOut;

    return { todayIn, todayOut, currentVisitors, totalTraffic };
  }, [todayBranches, selectedBranch]);

  const handleCreateDevice = async () => {
    if (!deviceId || !user?.id) {
      toast.error(t('error'), {
        description: t('dashboard.deviceIdPlaceholder'),
      });
      return;
    }

    createDeviceMutation.mutate(
      {
        userId: Number(user.id),
        deviceId: Number(deviceId),
      },
      {
        onSuccess: () => {
          toast.success(t('dashboard.deviceAddedSuccess'));
          setIsDeviceModalOpen(false);
          setDeviceId('');
        },
        onError: () => {
          toast.error(t('dashboard.deviceAddedError'));
        },
      }
    );
  };

  const branchOptions = useMemo(() => {
    const allOption = { value: 'all', label: t('dashboard.allBranches') };
    if (!branches) return [allOption];

    return [
      allOption,
      ...branches.map(branch => ({
        value: branch.id.toString(),
        label: branch.name,
      }))
    ];
  }, [branches, t]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-2 md:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-[250px]" />
            <Skeleton className="h-10 w-full sm:w-[200px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="pt-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6 p-2 md:p-0"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          {isAdmin && (
            <Select
              value={selectedBranch.toString()}
              onValueChange={(value) => setSelectedBranch(value === 'all' ? 'all' : parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[250px] border-border/50 hover:border-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch.value} value={branch.value}>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-full sm:w-[200px] border-border/50 hover:border-primary/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {t(range.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full -ml-12 -mb-12"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="border-success/50 text-success bg-success/10">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  {t('realTime')}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.currentVisitors')}</p>
                <h3 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {totalStats.currentVisitors}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-border/50 hover:border-success/50 transition-all duration-300 hover:shadow-lg group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/20 to-success/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ArrowUpRight className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-success text-xs font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.todayEntries')}</p>
                <h3 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {totalStats.todayIn}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-border/50 hover:border-warning/50 transition-all duration-300 hover:shadow-lg group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warning/20 to-warning/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ArrowDownRight className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-warning text-xs font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +8%
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.todayExits')}</p>
                <h3 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {totalStats.todayOut}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                  {t('dashboard.total')}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.totalTraffic')}</p>
                <h3 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {totalStats.totalTraffic}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Visitors Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {chartTitle}
                  </CardTitle>
                  <CardDescription className="mt-1">{chartDesc}</CardDescription>
                </div>
                <ExportDropdown
                  data={visitorsData}
                  excelFilename="sales_report.xlsx"
                  pdfFilename="sales_report.pdf"
                  buttonLabel={t('dashboard.export')}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingVisitors ? (
                <Skeleton className="h-[350px] w-full rounded-lg" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorKirish" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorChiqish" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="kirish"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fill="url(#colorKirish)"
                      name={t('entries')}
                    />
                    <Area
                      type="monotone"
                      dataKey="chiqish"
                      stroke="hsl(var(--warning))"
                      strokeWidth={3}
                      fill="url(#colorChiqish)"
                      name={t('exits')}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                  <Users className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">{t('noData')}</p>
                </div>
              )}
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary shadow-sm" />
                  <span className="text-sm font-medium text-foreground">{t('entries')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning shadow-sm" />
                  <span className="text-sm font-medium text-foreground">{t('exits')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hourly Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {t('dashboard.hourlyStats')}
                  </CardTitle>
                  <CardDescription className="mt-1">{t('dashboard.hourlyStatsDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDayStats ? (
                <Skeleton className="h-[350px] w-full rounded-lg" />
              ) : hourlyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="kirish"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      name={t('entries')}
                    />
                    <Line
                      type="monotone"
                      dataKey="chiqish"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      name={t('exits')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                  <Clock className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">{t('noData')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Branch Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="grid gap-2 justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {t('dashboard.todayBranchStats')}
                  </CardTitle>
                  <CardDescription className="mt-1">{t('dashboard.branchStatsDesc')}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {/* DATE RANGE FILTER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[260px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(dateRange.from, "dd MMM yyyy")} –{" "}
                        {format(dateRange.to, "dd MMM yyyy")}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setDateRange({
                              from: range.from,
                              to: range.to,
                            });
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* EXPORT */}
                  <ExportDropdown
                    data={visitorsData}
                    excelFilename="sales_report.xlsx"
                    pdfFilename="sales_report.pdf"
                    buttonLabel={t('dashboard.export')}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBranches ? (
                <Skeleton className="h-[350px] w-full rounded-lg" />
              ) : branchChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(350, branchChartData.length * 70)}>
                  <BarChart
                    data={branchChartData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={120}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar
                      dataKey="kirish"
                      fill="hsl(var(--primary))"
                      name={t('entries')}
                      radius={[0, 8, 8, 0]}
                      maxBarSize={40}
                    />
                    <Bar
                      dataKey="chiqish"
                      fill="hsl(var(--secondary))"
                      name={t('exits')}
                      radius={[0, 8, 8, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                  <Users className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">{t('noData')}</p>
                </div>
              )}
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary shadow-sm" />
                  <span className="text-sm font-medium text-foreground">{t('entries')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-secondary shadow-sm" />
                  <span className="text-sm font-medium text-foreground">{t('exits')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
