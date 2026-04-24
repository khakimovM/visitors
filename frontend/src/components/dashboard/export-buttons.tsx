import { FileSpreadsheet, FileText } from 'lucide-react';

interface ExportButtonsProps {
    onExportExcel: () => void;
    onExportPDF: () => void;
}

const ExportButtons = ({ onExportExcel, onExportPDF }: ExportButtonsProps) => {
    return (
        <div className="flex items-center gap-2">
            <button onClick={onExportExcel} className="export-excel">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
            </button>
            <button onClick={onExportPDF} className="export-pdf">
                <FileText className="h-4 w-4" />
                PDF
            </button>
        </div>
    );
};

export default ExportButtons;
