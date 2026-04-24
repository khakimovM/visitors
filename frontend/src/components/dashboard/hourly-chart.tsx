import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HourlyStats } from '@/types/analytics';

interface HourlyChartProps {
    data: HourlyStats[];
}

const HourlyChart = ({ data }: HourlyChartProps) => {
    const chartData = data.map(item => ({
        ...item,
        time: `${item.hour.toString().padStart(2, '0')}:00`,
    }));

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-in))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--chart-in))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-out))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--chart-out))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickLine={{ stroke: 'hsl(var(--chart-grid))' }}
                        axisLine={{ stroke: 'hsl(var(--chart-grid))' }}
                    />
                    <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickLine={{ stroke: 'hsl(var(--chart-grid))' }}
                        axisLine={{ stroke: 'hsl(var(--chart-grid))' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="inCount"
                        name="Visitors In"
                        stroke="hsl(var(--chart-in))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorIn)"
                    />
                    <Area
                        type="monotone"
                        dataKey="outCount"
                        name="Visitors Out"
                        stroke="hsl(var(--chart-out))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOut)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HourlyChart;
