import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, UserCheck, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

interface Person {
  id: string;
  name: string;
  type: 'customer' | 'staff';
  entryTime: string;
  exitTime?: string;
  branch: string;
  status: 'inside' | 'exited' | 'waiting';
  tableNumber?: string;
}

const mockData: Person[] = [
  {
    id: '1',
    name: 'Aziz Karimov',
    type: 'customer',
    entryTime: '09:30',
    branch: 'Markaziy filial',
    status: 'inside',
    tableNumber: '12',
  },
  {
    id: '2',
    name: 'Feruza Abdullayeva',
    type: 'staff',
    entryTime: '08:00',
    branch: 'Markaziy filial',
    status: 'inside',
  },
  {
    id: '3',
    name: 'Bobur Tashkentov',
    type: 'customer',
    entryTime: '10:15',
    exitTime: '11:45',
    branch: 'Chilonzor filiali',
    status: 'exited',
    tableNumber: '8',
  },
  {
    id: '4',
    name: 'Malika Yunusova',
    type: 'customer',
    entryTime: '11:20',
    branch: 'Yunusobod filiali',
    status: 'waiting',
  },
  {
    id: '5',
    name: 'Jasur Saidov',
    type: 'staff',
    entryTime: '07:30',
    branch: 'Chilonzor filiali',
    status: 'inside',
  },
];

const RealTimeTable: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  const filteredData = mockData.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || person.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || person.branch === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusBadge = (status: Person['status']) => {
    switch (status) {
      case 'inside':
        return <Badge className="status-active">{t('realtime.inside')}</Badge>;
      case 'exited':
        return <Badge className="status-inactive">{t('realtime.exited')}</Badge>;
      case 'waiting':
        return <Badge className="status-warning">{t('realtime.waiting')}</Badge>;
      default:
        return null;
    }
  };

  const getPersonIcon = (type: Person['type']) => {
    return type === 'staff' ? (
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <UserCheck className="w-4 h-4 text-white" />
      </div>
    ) : (
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-xs">{type === 'customer' ? 'M' : 'X'}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <Card className='h-full'>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {t('realtime.title')}
              </CardTitle>
              <CardDescription>
                Hozirda {filteredData.filter(p => p.status === 'inside').length} kishi ichkarida
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Eksport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Ism bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="inside">{t('realtime.inside')}</SelectItem>
                <SelectItem value="exited">{t('realtime.exited')}</SelectItem>
                <SelectItem value="waiting">{t('realtime.waiting')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha filiallar</SelectItem>
                <SelectItem value="Markaziy filial">Markaziy filial</SelectItem>
                <SelectItem value="Chilonzor filiali">Chilonzor filiali</SelectItem>
                <SelectItem value="Yunusobod filiali">Yunusobod filiali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('realtime.person')}</TableHead>
                  <TableHead>{t('realtime.entry')}</TableHead>
                  <TableHead>{t('realtime.exit')}</TableHead>
                  <TableHead>{t('realtime.branch')}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((person, index) => (
                  <motion.tr
                    key={person.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getPersonIcon(person.type)}
                        <div>
                          <div className="font-medium">{person.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {person.type === 'customer' ? 'Mijoz' : 'Xodim'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {person.entryTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      {person.exitTime ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {person.exitTime}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{person.branch}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(person.status)}
                    </TableCell>
                    <TableCell>
                      {person.tableNumber ? (
                        <Badge variant="outline">#{person.tableNumber}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Ma'lumot topilmadi
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RealTimeTable;