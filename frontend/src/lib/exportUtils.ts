import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Branch, TodayBranch, HourlyStats } from '@/types/analytics';

export const exportBranchesToExcel = (data: Branch[], filename: string = 'branches') => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(b => ({
      ID: b.id,
      Name: b.name,
      Email: b.email,
      'In Count': b.inCount,
      'Out Count': b.outCount,
      'Last Activity': b.lastActivity || 'N/A',
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportTodayBranchesToExcel = (data: TodayBranch[], filename: string = 'today_branches') => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(b => ({
      'User ID': b.userId,
      Username: b.username,
      'In Count': b.inCount,
      'Out Count': b.outCount,
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Today Branches');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportHourlyStatsToExcel = (data: HourlyStats[], filename: string = 'hourly_stats') => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(s => ({
      Hour: `${s.hour.toString().padStart(2, '0')}:00`,
      'In Count': s.inCount,
      'Out Count': s.outCount,
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hourly Statistics');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportBranchesToPDF = (data: Branch[], filename: string = 'branches') => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Branches Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [['ID', 'Name', 'Email', 'In', 'Out', 'Last Activity']],
    body: data.map(b => [
      b.id,
      b.name,
      b.email,
      b.inCount,
      b.outCount,
      b.lastActivity ? new Date(b.lastActivity).toLocaleString() : 'N/A',
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${filename}.pdf`);
};

export const exportTodayBranchesToPDF = (data: TodayBranch[], filename: string = 'today_branches') => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Today's Branch Activity", 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [['User ID', 'Username', 'In Count', 'Out Count']],
    body: data.map(b => [b.userId, b.username, b.inCount, b.outCount]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${filename}.pdf`);
};

export const exportHourlyStatsToPDF = (data: HourlyStats[], filename: string = 'hourly_stats') => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Hourly Statistics Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [['Hour', 'In Count', 'Out Count']],
    body: data.map(s => [
      `${s.hour.toString().padStart(2, '0')}:00`,
      s.inCount,
      s.outCount,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${filename}.pdf`);
};
