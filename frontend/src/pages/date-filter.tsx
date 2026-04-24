import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRange } from '@/types/analytics';

interface SingleDateFilterProps {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    onClear: () => void;
    placeholder?: string;
}

export const SingleDateFilter = ({ date, onDateChange, onClear, placeholder = "Select date" }: SingleDateFilterProps) => {
    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {date && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

interface DateRangeFilterProps {
    dateRange: DateRange;
    onDateRangeChange: (range: DateRange) => void;
    onClear: () => void;
    placeholder?: string;
}

export const DateRangeFilter = ({ dateRange, onDateRangeChange, onClear, placeholder = "Select date range" }: DateRangeFilterProps) => {
    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            placeholder
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
            {(dateRange.from || dateRange.to) && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
