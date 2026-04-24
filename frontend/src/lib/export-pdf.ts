"use client";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { BranchInfo, VisitorDataPoint } from "@/types/analytics";

export const exportToPDF = async (
  data: VisitorDataPoint[] | BranchInfo[],
  filename = "hisobot.pdf"
) => {
  if (!data || data.length === 0) return;

  // Yangi PDF yaratish
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  // Font
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Title
  const title = "Hisobot";
  page.drawText(title, { x: margin, y, size: 18, font, color: rgb(0, 0.5, 0.2) });
  y -= 30;

  // Jadval headers
  const headers = Object.keys(data[0]);
  const columnWidth = (width - margin * 2) / headers.length;

  headers.forEach((header, i) => {
    // Rectangle avval, keyin matn ustida chiziladi
    page.drawRectangle({
      x: margin + i * columnWidth,
      y: y - 2,
      width: columnWidth,
      height: 20,
      color: rgb(0, 0.7, 0.5),
    });
    page.drawText(String(header), { x: margin + i * columnWidth + 3, y, size: 12, font, color: rgb(1, 1, 1) });
  });
  y -= 25;

  // Rows
  const rowHeight = 20;
  data.forEach((row, rowIndex) => {
    headers.forEach((key, colIndex) => {
      const text = String(row[key] || "");
      page.drawText(text, { x: margin + colIndex * columnWidth + 2, y, size: 12, font: fontNormal });
    });
    y -= rowHeight;

    // Page overflow
    if (y < margin) {
      y = height - margin;
      pdfDoc.addPage();
    }
  });

  // PDFni yaratish
  const pdfBytes = await pdfDoc.save();

  // Fayl sifatida yuklab olish
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, filename);
};
