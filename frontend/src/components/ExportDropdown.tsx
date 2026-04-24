"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel } from "@/lib/export-excel";
import { exportToPDF } from "@/lib/export-pdf";
import { BranchInfo, VisitorDataPoint } from "@/types/analytics";

interface ExportDropdownProps {
    data: VisitorDataPoint[] | BranchInfo[];              // Jadval yoki chart data
    excelFilename?: string;    // Excel fayl nomi
    pdfFilename?: string;      // PDF fayl nomi
    buttonLabel?: string;      // Tugma labeli
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
    data,
    excelFilename = "hisobot.xlsx",
    pdfFilename = "hisobot.pdf",
    buttonLabel = "Export",
}) => {
    const handleExportExcel = () => {
        if (!data || data.length === 0) return;
        exportToExcel(data, excelFilename);
    };

    const handleExportPDF = () => {
        if (!data || data.length === 0) return;
        exportToPDF(data, pdfFilename);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                >
                    <Download className="h-4 w-4 mr-2" />
                    {buttonLabel}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                    Excel (.xlsx)
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2 text-red-600" />
                    PDF (.pdf)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
