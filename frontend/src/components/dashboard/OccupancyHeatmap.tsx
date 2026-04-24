import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Square } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  status: 'occupied' | 'available' | 'reserved' | 'cleaning';
  seats: number;
  waitTime?: number;
}

interface OccupancyHeatmapProps {
  branch?: string;
}

const mockTables: Table[] = [
  { id: '1', number: 1, status: 'occupied', seats: 4, waitTime: 15 },
  { id: '2', number: 2, status: 'available', seats: 2 },
  { id: '3', number: 3, status: 'occupied', seats: 6, waitTime: 30 },
  { id: '4', number: 4, status: 'reserved', seats: 4 },
  { id: '5', number: 5, status: 'cleaning', seats: 4 },
  { id: '6', number: 6, status: 'occupied', seats: 2, waitTime: 45 },
  { id: '7', number: 7, status: 'available', seats: 8 },
  { id: '8', number: 8, status: 'occupied', seats: 4, waitTime: 20 },
  { id: '9', number: 9, status: 'available', seats: 2 },
  { id: '10', number: 10, status: 'occupied', seats: 6, waitTime: 10 },
  { id: '11', number: 11, status: 'reserved', seats: 4 },
  { id: '12', number: 12, status: 'available', seats: 4 },
  { id: '13', number: 13, status: 'occupied', seats: 2, waitTime: 25 },
  { id: '14', number: 14, status: 'cleaning', seats: 6 },
  { id: '15', number: 15, status: 'available', seats: 4 },
  { id: '16', number: 16, status: 'occupied', seats: 8, waitTime: 35 },
];

const OccupancyHeatmap: React.FC<OccupancyHeatmapProps> = ({ branch = 'Markaziy filial' }) => {
  const getTableColor = (status: Table['status']) => {
    switch (status) {
      case 'occupied':
        return 'bg-error/80 hover:bg-error';
      case 'available':
        return 'bg-success/80 hover:bg-success';
      case 'reserved':
        return 'bg-warning/80 hover:bg-warning';
      case 'cleaning':
        return 'bg-info/80 hover:bg-info';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'occupied':
        return 'Band';
      case 'available':
        return 'Bo\'sh';
      case 'reserved':
        return 'Bron';
      case 'cleaning':
        return 'Tozalanmoqda';
      default:
        return 'Noma\'lum';
    }
  };

  const getStatusBadge = (status: Table['status']) => {
    switch (status) {
      case 'occupied':
        return <Badge className="status-error text-xs">Band</Badge>;
      case 'available':
        return <Badge className="status-active text-xs">Bo'sh</Badge>;
      case 'reserved':
        return <Badge className="status-warning text-xs">Bron</Badge>;
      case 'cleaning':
        return <Badge variant="outline" className="text-xs">Tozalanmoqda</Badge>;
      default:
        return null;
    }
  };

  const occupiedTables = mockTables.filter(t => t.status === 'occupied').length;
  const availableTables = mockTables.filter(t => t.status === 'available').length;
  const reservedTables = mockTables.filter(t => t.status === 'reserved').length;
  const cleaningTables = mockTables.filter(t => t.status === 'cleaning').length;

  const occupancyRate = Math.round((occupiedTables / mockTables.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 }}
    >
      <Card className='h-full'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Square className="w-5 h-5" />
                Stollar xaritasi
              </CardTitle>
              <CardDescription>
                {branch} - Band bo'lish {occupancyRate}%
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="status-active">
                {availableTables} bo'sh
              </Badge>
              <Badge className="status-error">
                {occupiedTables} band
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Restaurant Layout */}
          <div className="relative p-6 bg-muted/20 rounded-lg mb-6">
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {mockTables.map((table, index) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative p-3 rounded-lg transition-all duration-300 cursor-pointer
                    ${getTableColor(table.status)}
                    text-white text-center shadow-lg
                    hover:scale-105 hover:shadow-xl
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-bold text-lg">#{table.number}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {table.seats} o'rin
                  </div>
                  {table.waitTime && (
                    <div className="text-xs mt-1 bg-black/20 rounded px-1">
                      {table.waitTime}min
                    </div>
                  )}
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white/80" />
                </motion.div>
              ))}
            </div>

            {/* Restaurant Features */}
            <div className="absolute top-2 left-2 text-xs text-muted-foreground">
              Kirish
            </div>
            <div className="absolute top-2 right-2 text-xs text-muted-foreground">
              Oshxona
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
              Kassa
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded" />
              <span className="text-sm">Bo'sh ({availableTables})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-error rounded" />
              <span className="text-sm">Band ({occupiedTables})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded" />
              <span className="text-sm">Bron ({reservedTables})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-info rounded" />
              <span className="text-sm">Tozalanmoqda ({cleaningTables})</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{occupancyRate}%</div>
              <div className="text-sm text-muted-foreground">Band bo'lish foizi</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(mockTables.filter(t => t.waitTime).reduce((acc, t) => acc + (t.waitTime || 0), 0) / mockTables.filter(t => t.waitTime).length) || 0}min
              </div>
              <div className="text-sm text-muted-foreground">O'rtacha kutish</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {mockTables.reduce((acc, t) => acc + t.seats, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Jami o'rinlar</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OccupancyHeatmap;