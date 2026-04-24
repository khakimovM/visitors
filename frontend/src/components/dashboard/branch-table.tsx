import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Branch } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface BranchTableProps {
    data: Branch[];
}

const BranchTable = ({ data }: BranchTableProps) => {
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'No activity';
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold text-center">In</TableHead>
                        <TableHead className="font-semibold text-center">Out</TableHead>
                        <TableHead className="font-semibold">Last Activity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No branches found
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((branch) => (
                            <TableRow key={branch.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">#{branch.id}</TableCell>
                                <TableCell className="font-medium">{branch.name}</TableCell>
                                <TableCell className="text-muted-foreground">{branch.email}</TableCell>
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
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDate(branch.lastActivity)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default BranchTable;
