import React, { useState, useEffect } from 'react';
import { Worker, ExcelRowItem, WorkerActivity } from '../types';
import {
  YEARS as DEFAULT_YEARS,
  MONTHS,
  MONTHS_HINDI
} from '../data/initialData';
import {
  X,
  FileSpreadsheet,
  Download,
  Save,
  Check,
  Calendar,
  Plus,
  Trash2,
  Printer,
  RotateCcw
} from 'lucide-react';

interface ExcelSheetModalProps {
  worker: Worker | null;
  onClose: () => void;
  onUpdateWorker: (updatedWorker: Worker) => void;
  onAddOrUpdateActivity?: (activity: Omit<WorkerActivity, 'id'>) => void;
}

export const ExcelSheetModal: React.FC<ExcelSheetModalProps> = ({
  worker,
  onClose,
  onUpdateWorker,
}) => {
  const [yearsList, setYearsList] = useState<string[]>(DEFAULT_YEARS);
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [excelRowsMap, setExcelRowsMap] = useState<Record<string, Record<string, ExcelRowItem[]>>>({});

  // Quick Add Row Inputs
  const [newDateStr, setNewDateStr] = useState<string>('');
  const [newAttendance, setNewAttendance] = useState<string>('');
  const [newOneDayExp, setNewOneDayExp] = useState<string>('');
  const [newMonthExp, setNewMonthExp] = useState<string>('');
  const [newTotalRupees, setNewTotalRupees] = useState<string>('');

  // Editing state for an existing row
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<ExcelRowItem>({
    id: '',
    dateStr: '',
    attendance: '',
    oneDayExpense: '',
    monthExpense: '',
    totalRupees: '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize from worker's real saved records ONLY (starts completely empty by default)
  useEffect(() => {
    if (worker) {
      if (worker.excelRows && Object.keys(worker.excelRows).length > 0) {
        setExcelRowsMap(worker.excelRows);
      } else {
        setExcelRowsMap({});
      }
      setSelectedYear('2026');
      setSelectedMonth('January');
      setEditingRowIndex(null);
      resetNewRowForm('January');
    }
  }, [worker]);

  const resetNewRowForm = (monthName: string) => {
    setNewDateStr(`${monthName} 01 / 10`);
    setNewAttendance('5,6');
    setNewOneDayExp('100 rupees');
    setNewMonthExp('');
    setNewTotalRupees('');
  };

  if (!worker) return null;

  // Current month rows - ONLY what was explicitly added by admin!
  const currentRows: ExcelRowItem[] = excelRowsMap[selectedYear]?.[selectedMonth] || [];

  const handleMonthChange = (m: string) => {
    setSelectedMonth(m);
    setEditingRowIndex(null);
    const existingCount = (excelRowsMap[selectedYear]?.[m] || []).length;
    const nextDay = existingCount + 1;
    const padDay = nextDay < 10 ? `0${nextDay}` : `${nextDay}`;
    setNewDateStr(`${m} ${padDay} / 10`);
  };

  const handleYearChange = (yr: string) => {
    setSelectedYear(yr);
    setEditingRowIndex(null);
  };

  const handleAddNewRow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newDateStr.trim()) return;

    const newRow: ExcelRowItem = {
      id: `${selectedYear}-${selectedMonth}-${Date.now()}`,
      dateStr: newDateStr.trim(),
      attendance: newAttendance.trim() || '5,6',
      oneDayExpense: newOneDayExp.trim() || '100 rupees',
      monthExpense: newMonthExp.trim() || '-',
      totalRupees: newTotalRupees.trim() || '-',
    };

    const nextRows = [...currentRows, newRow];

    const updatedMap = {
      ...excelRowsMap,
      [selectedYear]: {
        ...(excelRowsMap[selectedYear] || {}),
        [selectedMonth]: nextRows,
      },
    };

    setExcelRowsMap(updatedMap);

    // Auto-advance day suggestion for next entry
    const nextNum = nextRows.length + 1;
    const padDay = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    setNewDateStr(`${selectedMonth} ${padDay} / 10`);
  };

  const startEditRow = (index: number) => {
    setEditingRowIndex(index);
    setEditFormData({ ...currentRows[index] });
  };

  const cancelEdit = () => {
    setEditingRowIndex(null);
  };

  const saveRowEdit = () => {
    if (editingRowIndex === null) return;

    const nextRows = [...currentRows];
    nextRows[editingRowIndex] = { ...editFormData };

    const updatedMap = {
      ...excelRowsMap,
      [selectedYear]: {
        ...(excelRowsMap[selectedYear] || {}),
        [selectedMonth]: nextRows,
      },
    };

    setExcelRowsMap(updatedMap);
    setEditingRowIndex(null);
  };

  const handleDeleteRow = (index: number) => {
    const nextRows = currentRows.filter((_, i) => i !== index);

    const updatedMap = {
      ...excelRowsMap,
      [selectedYear]: {
        ...(excelRowsMap[selectedYear] || {}),
        [selectedMonth]: nextRows,
      },
    };

    setExcelRowsMap(updatedMap);
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
    }
  };

  const handleClearMonth = () => {
    if (confirm(`क्या आप ${MONTHS_HINDI[selectedMonth]} ${selectedYear} की सभी पंक्तियों को खाली करना चाहते हैं?`)) {
      const updatedMap = {
        ...excelRowsMap,
        [selectedYear]: {
          ...(excelRowsMap[selectedYear] || {}),
          [selectedMonth]: [],
        },
      };
      setExcelRowsMap(updatedMap);
      setEditingRowIndex(null);
      resetNewRowForm(selectedMonth);
    }
  };

  const handleSaveWorkbook = () => {
    // Determine representative values from the latest row if present
    const lastRow = currentRows[currentRows.length - 1];
    const latestAttendance = lastRow ? lastRow.attendance : worker.attendance || '5,6';
    const latestOneDayExp = lastRow ? lastRow.oneDayExpense : worker.expWeek || '100 rupees';
    const latestMonthExp = lastRow ? lastRow.monthExpense : worker.expense || '0';
    const latestTotal = lastRow ? lastRow.totalRupees : worker.total || '0';

    const updatedWorker: Worker = {
      ...worker,
      excelRows: excelRowsMap,
      attendance: latestAttendance,
      expWeek: latestOneDayExp,
      expense: latestMonthExp,
      total: latestTotal,
    };

    onUpdateWorker(updatedWorker);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddNewYear = () => {
    const lastYear = Number(yearsList[yearsList.length - 1]) || 2035;
    const nextYear = String(lastYear + 1);
    setYearsList((prev) => [...prev, nextYear]);
    setSelectedYear(nextYear);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToCSV = () => {
    const headers = [
      '# (क्र.सं.)',
      'Date (तारीख)',
      'Attendance (उपस्थिति)',
      '1 Day Expensive (1 दिन का खर्च)',
      'Month Expensive (मासिक खर्च)',
      'Total Rupees (कुल रुपये)'
    ];

    const rows = currentRows.map((r, i) => [
      i + 1,
      `"${r.dateStr}"`,
      `"${r.attendance}"`,
      `"${r.oneDayExpense}"`,
      `"${r.monthExpense}"`,
      `"${r.totalRupees}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `कर्मचारी: ${worker.name} (${worker.role}) - ${MONTHS_HINDI[selectedMonth]} ${selectedYear}`,
        headers.join(','),
        ...rows.map((e) => e.join(','))
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${worker.name.replace(/\s+/g, '_')}_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* EXPANDED FULL-PAGE SPREADSHEET PAPER */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-[99vw] max-w-[1650px] h-[96vh] flex flex-col overflow-hidden border border-slate-300 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EXCEL TOP TITLE BAR */}
        <div className="bg-[#107c41] text-white px-5 py-2.5 flex items-center justify-between text-xs sm:text-sm select-none shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white text-[#107c41] rounded flex items-center justify-center font-bold text-sm shadow-sm">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide">
                {worker.name} - Official Excel Register ({selectedYear})
              </span>
              <span className="ml-2.5 bg-white/20 px-2.5 py-0.5 rounded text-xs font-semibold text-emerald-100">
                {MONTHS_HINDI[selectedMonth]} {selectedYear}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="bg-white/15 hover:bg-white/30 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium"
              title="Print Large Paper Sheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Paper</span>
            </button>

            <button
              onClick={exportToCSV}
              className="bg-white/15 hover:bg-white/30 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleSaveWorkbook}
              className="bg-emerald-900 hover:bg-emerald-950 text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer text-xs sm:text-sm shadow-md border border-emerald-700 hover:shadow-emerald-950/40"
              title="Save all changes to worker account"
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'सुरक्षित हो गया (Saved & Synced)!' : 'Save & Sync Account (सुरक्षित करें)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-red-600 rounded transition-colors ml-1 cursor-pointer"
              title="Close Excel Sheet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MONTH SELECTOR TABS */}
        <div className="bg-[#1f4e38] text-white px-4 py-2 flex items-center gap-1.5 overflow-x-auto select-none border-b border-emerald-900 scrollbar-thin shrink-0">
          <span className="text-xs font-bold text-emerald-200 shrink-0 mr-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>महीना (Month):</span>
          </span>
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => handleMonthChange(m)}
              className={`px-3 py-1 rounded text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedMonth === m
                  ? 'bg-white text-[#107c41] font-bold shadow-md scale-105'
                  : 'text-emerald-100 hover:bg-white/15'
              }`}
            >
              {MONTHS_HINDI[m]}
            </button>
          ))}
        </div>

        {/* QUICK ADD ROW BAR (ADMIN CAN EASILY ADD NEW DATE/ATTENDANCE/EXPENSES) */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 shrink-0">
          <form
            onSubmit={handleAddNewRow}
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0">
                <Plus className="w-3.5 h-3.5 text-[#107c41]" />
                <span>नई पंक्ति जोड़ें (Add Row):</span>
              </span>

              {/* Date Input */}
              <input
                type="text"
                value={newDateStr}
                onChange={(e) => setNewDateStr(e.target.value)}
                placeholder="Date (e.g. January 01 / 10)"
                required
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-800 w-44 focus:outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41]"
              />

              {/* Attendance Input */}
              <input
                type="text"
                value={newAttendance}
                onChange={(e) => setNewAttendance(e.target.value)}
                placeholder="Attendance (e.g. 5,6)"
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-center font-bold text-slate-800 w-32 focus:outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41]"
              />

              {/* 1 Day Expense Input */}
              <input
                type="text"
                value={newOneDayExp}
                onChange={(e) => setNewOneDayExp(e.target.value)}
                placeholder="1 Day Exp (e.g. 100 rupees)"
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-right font-medium text-amber-900 w-40 focus:outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41]"
              />

              {/* Month Expense Input */}
              <input
                type="text"
                value={newMonthExp}
                onChange={(e) => setNewMonthExp(e.target.value)}
                placeholder="Month Expense (e.g. Rs. 3,500)"
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-right font-medium text-orange-900 w-40 focus:outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41]"
              />

              {/* Total Rupees Input */}
              <input
                type="text"
                value={newTotalRupees}
                onChange={(e) => setNewTotalRupees(e.target.value)}
                placeholder="Total Rupees (e.g. Rs. 32,500)"
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-right font-black text-emerald-950 w-44 focus:outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41]"
              />

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#107c41] hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record (दर्ज करें)</span>
              </button>
            </div>

            {currentRows.length > 0 && (
              <button
                type="button"
                onClick={handleClearMonth}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="Clear all rows for this month"
              >
                <RotateCcw className="w-3 h-3" />
                <span>इस महीने का डाटा साफ़ करें</span>
              </button>
            )}
          </form>
        </div>

        {/* EXPANDED EXCEL SPREADSHEET PAPER TABLE */}
        <div className="flex-1 overflow-auto bg-slate-100 p-3 sm:p-5">
          <div className="bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden min-h-full flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full border-collapse bg-white text-sm select-none">
                <thead>
                  <tr className="bg-[#f3f2f1] text-slate-800 font-bold border-b-2 border-slate-300 sticky top-0 z-10 shadow-sm text-center">
                    <th className="w-14 py-3.5 px-3 border-r border-slate-300 bg-[#e1dfdd] text-slate-700 font-bold">
                      # (क्र.सं.)
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-300 text-left bg-slate-100/90 text-slate-900 font-bold">
                      Date (तारीख)
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-300 text-center text-slate-900 font-bold">
                      Attendance (उपस्थिति)
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-300 text-right text-slate-900 font-bold">
                      1 Day Expensive (1 दिन का खर्च)
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-300 text-right text-slate-900 font-bold">
                      Month Expensive (मासिक खर्च)
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-300 text-right font-black text-emerald-900">
                      Total Rupees (कुल रुपये)
                    </th>
                    <th className="w-36 py-3.5 px-3 text-center bg-slate-100 text-slate-800 font-bold">
                      Option (एडिट / डिलीट)
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#e1dfdd] font-sans">
                  {currentRows.length === 0 ? (
                    <>
                      {/* Blank paper message + empty grid cells preview */}
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 px-4 text-center bg-slate-50/70 border-b border-dashed border-slate-300"
                        >
                          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-2.5" />
                          <h4 className="text-base font-bold text-slate-700 mb-1">
                            {MONTHS_HINDI[selectedMonth]} {selectedYear} के सभी बॉक्स खाली हैं
                          </h4>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            (All boxes are empty by default. Use the form above to add Date, Attendance, 1 Day Expense, Month Expense, and Total Rupees.)
                          </p>
                        </td>
                      </tr>
                      {/* 4 Empty blank ledger paper rows for realistic spreadsheet view */}
                      {[1, 2, 3, 4].map((emptyIdx) => (
                        <tr key={emptyIdx} className="h-10 hover:bg-slate-50/60">
                          <td className="border-r border-[#e8e8e8] bg-[#fafafa] text-center text-slate-300 font-mono text-xs">
                            {emptyIdx}
                          </td>
                          <td className="border-r border-[#e8e8e8] px-4 text-slate-300 italic text-xs">-</td>
                          <td className="border-r border-[#e8e8e8] px-4 text-center text-slate-300 italic text-xs">-</td>
                          <td className="border-r border-[#e8e8e8] px-4 text-right text-slate-300 italic text-xs">-</td>
                          <td className="border-r border-[#e8e8e8] px-4 text-right text-slate-300 italic text-xs">-</td>
                          <td className="border-r border-[#e8e8e8] px-4 text-right text-slate-300 italic text-xs">-</td>
                          <td className="px-3 text-center text-slate-300 italic text-xs">-</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    currentRows.map((row, index) => {
                      const isEditing = editingRowIndex === index;

                      if (isEditing) {
                        return (
                          <tr key={index} className="bg-amber-50">
                            <td className="py-3 px-3 text-center border-r border-[#dadada] font-mono font-bold text-slate-600">
                              {index + 1}
                            </td>

                            {/* Edit Date */}
                            <td className="py-2 px-3 border-r border-[#dadada]">
                              <input
                                type="text"
                                value={editFormData.dateStr}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, dateStr: e.target.value })
                                }
                                placeholder="e.g. January 01 / 10"
                                className="w-full px-2.5 py-1.5 text-xs font-bold border border-emerald-600 rounded bg-white shadow-inner"
                                autoFocus
                              />
                            </td>

                            {/* Edit Attendance */}
                            <td className="py-2 px-3 border-r border-[#dadada]">
                              <input
                                type="text"
                                value={editFormData.attendance}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, attendance: e.target.value })
                                }
                                placeholder="e.g. 5,6"
                                className="w-full px-2.5 py-1.5 text-xs border border-emerald-600 rounded bg-white text-center font-bold"
                              />
                            </td>

                            {/* Edit 1 Day Expensive */}
                            <td className="py-2 px-3 border-r border-[#dadada]">
                              <input
                                type="text"
                                value={editFormData.oneDayExpense}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, oneDayExpense: e.target.value })
                                }
                                placeholder="e.g. 100 rupees"
                                className="w-full px-2.5 py-1.5 text-xs border border-emerald-600 rounded bg-white text-right font-medium text-amber-800"
                              />
                            </td>

                            {/* Edit Month Expensive */}
                            <td className="py-2 px-3 border-r border-[#dadada]">
                              <input
                                type="text"
                                value={editFormData.monthExpense}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, monthExpense: e.target.value })
                                }
                                placeholder="e.g. Rs. 3,500"
                                className="w-full px-2.5 py-1.5 text-xs border border-emerald-600 rounded bg-white text-right font-medium text-orange-800"
                              />
                            </td>

                            {/* Edit Total Rupees */}
                            <td className="py-2 px-3 border-r border-[#dadada]">
                              <input
                                type="text"
                                value={editFormData.totalRupees}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, totalRupees: e.target.value })
                                }
                                placeholder="e.g. Rs. 32,500"
                                className="w-full px-2.5 py-1.5 text-xs border border-emerald-600 rounded bg-white text-right font-black text-emerald-900"
                              />
                            </td>

                            {/* Save / Cancel Action */}
                            <td className="py-2 px-3 text-center space-x-1.5">
                              <button
                                onClick={saveRowEdit}
                                className="px-3 py-1 bg-[#107c41] text-white rounded font-bold text-xs hover:bg-emerald-800 cursor-pointer shadow-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-slate-300 text-slate-700 rounded font-semibold text-xs hover:bg-slate-400 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={index}
                          className="hover:bg-emerald-50/40 transition-colors"
                        >
                          {/* # */}
                          <td className="py-3 px-3 text-center border-r border-[#dadada] bg-[#f8f8f8] text-slate-600 font-mono text-xs font-semibold">
                            {index + 1}
                          </td>

                          {/* Date */}
                          <td
                            onDoubleClick={() => startEditRow(index)}
                            className="py-3 px-4 border-r border-[#dadada] font-bold text-slate-900"
                          >
                            {row.dateStr}
                          </td>

                          {/* Attendance */}
                          <td
                            onDoubleClick={() => startEditRow(index)}
                            className="py-3 px-4 text-center border-r border-[#dadada] font-bold"
                          >
                            <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold inline-block shadow-xs">
                              {row.attendance}
                            </span>
                          </td>

                          {/* 1 Day Expensive */}
                          <td
                            onDoubleClick={() => startEditRow(index)}
                            className="py-3 px-4 text-right font-medium text-amber-900 border-r border-[#dadada]"
                          >
                            {row.oneDayExpense}
                          </td>

                          {/* Month Expensive */}
                          <td
                            onDoubleClick={() => startEditRow(index)}
                            className="py-3 px-4 text-right font-medium text-orange-900 border-r border-[#dadada]"
                          >
                            {row.monthExpense}
                          </td>

                          {/* Total Rupees */}
                          <td
                            onDoubleClick={() => startEditRow(index)}
                            className="py-3 px-4 text-right font-black text-emerald-950 text-base border-r border-[#dadada]"
                          >
                            {row.totalRupees}
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-center space-x-2">
                            <button
                              onClick={() => startEditRow(index)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#107c41] hover:text-white text-slate-700 rounded text-xs font-semibold transition-colors cursor-pointer border border-slate-300"
                              title="Edit Row"
                            >
                              एडिट (Edit)
                            </button>
                            <button
                              onClick={() => handleDeleteRow(index)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Row"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* In-sheet Bottom Status Bar */}
            <div className="bg-slate-50 border-t border-slate-300 px-5 py-2.5 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span>
                  <strong>कुल पंक्तियाँ (Total Rows):</strong> {currentRows.length}
                </span>
                <span>•</span>
                <span>
                  <strong>कर्मचारी:</strong> {worker.name} ({worker.role})
                </span>
              </div>
              <button
                onClick={handleSaveWorkbook}
                className="bg-[#107c41] hover:bg-emerald-800 text-white px-4 py-1.5 rounded font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Worker Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM YEAR TABS (OVER 10 YEARS & FUTURE YEARS) */}
        <div className="bg-[#f3f2f1] border-t border-slate-300 px-4 py-2 flex items-center justify-between select-none overflow-x-auto text-xs shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1.5">
              वर्ष (Year):
            </span>
            {yearsList.map((yr) => (
              <button
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`px-3.5 py-1.5 rounded-t-md border-t-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-white border-[#107c41] text-[#107c41] shadow-sm scale-105'
                    : 'bg-slate-200/80 border-transparent text-slate-600 hover:bg-white/60'
                }`}
              >
                {yr}
              </button>
            ))}

            <button
              onClick={handleAddNewYear}
              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer ml-1"
              title="Add future year (2036, 2037...)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Year</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden md:flex items-center gap-3">
            <span>कर्मचारी ID: <strong className="font-mono">{worker.badgeNumber || `BC-${worker.id}`}</strong></span>
            <span>|</span>
            <span>Admin Live Sync Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
