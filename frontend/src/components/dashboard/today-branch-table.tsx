import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TodayBranch } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface TodayBranchTableProps {
    data: TodayBranch[];
}

const TodayBranchTable = ({ data }: TodayBranchTableProps) => {
    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">User ID</TableHead>
                        <TableHead className="font-semibold">Username</TableHead>
                        <TableHead className="font-semibold text-center">In Count</TableHead>
                        <TableHead className="font-semibold text-center">Out Count</TableHead>
                        <TableHead className="font-semibold text-center">Net Flow</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No data for today
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((branch) => {
                            const netFlow = branch.inCount - branch.outCount;
                            return (
                                <TableRow key={branch.userId} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">#{branch.userId}</TableCell>
                                    <TableCell className="font-medium">{branch.username}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className={cn("bg-accent/10 text-accent border-0")}>
                                            {branch.inCount}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className={cn("bg-destructive/10 text-destructive border-0")}>
                                            {branch.outCount}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "border-0",
                                                netFlow > 0 && "bg-accent/10 text-accent",
                                                netFlow < 0 && "bg-destructive/10 text-destructive",
                                                netFlow === 0 && "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {netFlow > 0 ? '+' : ''}{netFlow}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TodayBranchTable;
