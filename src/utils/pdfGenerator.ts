import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Worker, ExcelRowItem } from '../types';
import { MONTHS_HINDI } from '../data/initialData';

export function generateWorkerLedgerPDF(
  worker: Worker,
  year: string,
  month: string,
  rows: ExcelRowItem[]
) {
  // Create A4 Landscape PDF for wide ledger accounting paper
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm

  // 1. Header Banner Background
  doc.setFillColor(16, 124, 65); // #107c41 Forest Green (Excel theme)
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('BUILDING CONSTRUCTION MANAGEMENT PORTAL', 14, 12);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL WORKER ATTENDANCE & EXPENSE MONTHLY LEDGER REGISTER', 14, 20);

  // Month & Year Badge on right
  const monthHindi = MONTHS_HINDI[month] || month;
  doc.setFillColor(243, 156, 18); // Amber/Orange badge
  doc.roundedRect(pageWidth - 75, 6, 62, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${month.toUpperCase()} ${year}`, pageWidth - 44, 16, { align: 'center' });

  // 2. Worker Information Box
  doc.setFillColor(248, 250, 252); // light slate
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.5);
  doc.roundedRect(14, 34, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Worker Name:`, 18, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(`${worker.name}`, 46, 41);

  doc.setFont('helvetica', 'bold');
  doc.text(`Designation/Role:`, 18, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(`${worker.role}`, 53, 49);

  doc.setFont('helvetica', 'bold');
  doc.text(`Worker ID:`, 120, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(`BC-${worker.id}`, 142, 41);

  doc.setFont('helvetica', 'bold');
  doc.text(`Period:`, 120, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(`${month} ${year} (${monthHindi})`, 136, 49);

  doc.setFont('helvetica', 'bold');
  doc.text(`Generated On:`, 210, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 240, 41);

  doc.setFont('helvetica', 'bold');
  doc.text(`Total Records:`, 210, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(`${rows.length} Entries`, 240, 49);

  // 3. Prepare Table Data
  const tableHeaders = [
    ['#', 'Date (Tarikh)', 'Attendance', '1 Day Expensive', 'Month Expensive', 'Total Rupees']
  ];

  const tableBody = rows.length > 0
    ? rows.map((r, idx) => [
        idx + 1,
        r.dateStr || '-',
        r.attendance || '-',
        r.oneDayExpense || '-',
        r.monthExpense || '-',
        r.totalRupees || '-',
      ])
    : [
        ['-', 'No records entered yet for this month', '-', '-', '-', '-']
      ];

  // 4. Render Table with autoTable
  autoTable(doc, {
    startY: 61,
    head: tableHeaders,
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 37, 47], // #1a252f Dark Navy
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
      2: { halign: 'center', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 50 },
      4: { halign: 'right', cellWidth: 54 },
      5: { halign: 'right', fontStyle: 'bold', cellWidth: 54 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14, bottom: 35 },
  });

  // Calculate position after table
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 140;
  const signatureY = Math.min(Math.max(finalY + 18, 175), pageHeight - 20);

  // 5. Signatures & Verification Area
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.4);

  // Worker signature line
  doc.line(30, signatureY, 95, signatureY);
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Worker Signature / Angutha', 62.5, signatureY + 4, { align: 'center' });

  // Verification Stamp box in center
  doc.setDrawColor(16, 124, 65);
  doc.setLineWidth(0.6);
  doc.roundedRect(pageWidth / 2 - 32, signatureY - 12, 64, 18, 2, 2);
  doc.setTextColor(16, 124, 65);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL VERIFIED LEDGER', pageWidth / 2, signatureY - 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('BUILDING CONSTRUCTION PORTAL', pageWidth / 2, signatureY, { align: 'center' });

  // Site Admin signature line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(pageWidth - 95, signatureY, pageWidth - 30, signatureY);
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Site Admin Signature & Stamp', pageWidth - 62.5, signatureY + 4, { align: 'center' });

  // 6. Footer note
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Official Computerized Ledger Record • Generated by Building Construction Portal • Verified & Synced via Firebase Cloud`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  // 7. Save the PDF file
  const safeName = worker.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${safeName}_Ledger_${month}_${year}.pdf`);
}
