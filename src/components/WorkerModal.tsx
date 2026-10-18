import React, { useState, useEffect } from 'react';
import { Worker, WorkerActivity, ExcelRowItem } from '../types';
import { MONTHS, MONTHS_HINDI } from '../data/initialData';
import { FileSpreadsheet, Printer, Calendar, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { generateWorkerLedgerPDF } from '../utils/pdfGenerator';

interface WorkerModalProps {
  worker: Worker | null;
  activities?: WorkerActivity[];
  onClose: () => void;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({ worker, activities = [], onClose }) => {
  const [enteredPass, setEnteredPass] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passError, setPassError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  useEffect(() => {
    setEnteredPass('');
    setIsUnlocked(false);
    setPassError('');
    setImgError(false);
    setSelectedMonth('January');
    setSelectedYear('2026');
  }, [worker]);

  if (!worker) return null;

  const defaultDP = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80';
  const displayDP = imgError || !worker.dp ? defaultDP : worker.dp;

  const handleCheckPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPass.trim() === worker.password) {
      setIsUnlocked(true);
      setPassError('');
    } else {
      setPassError('Wrong password!');
    }
  };

  // Only rows added by admin
  const workerExcelRows: ExcelRowItem[] =
    worker.excelRows?.[selectedYear]?.[selectedMonth] || [];

  const handleDownloadPDF = () => {
    generateWorkerLedgerPDF(worker, selectedYear, selectedMonth, workerExcelRows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[99vw] max-w-[1650px] h-[96vh] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-300 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#107c41] text-white px-5 py-2.5 flex items-center justify-between text-xs sm:text-sm select-none shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white text-[#107c41] rounded flex items-center justify-center font-bold text-xs shadow-sm">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wide">
              {worker.name} - Worker Official Account & Ledger Register
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white hover:bg-red-600 rounded transition-colors cursor-pointer text-xl leading-none px-2"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {!isUnlocked ? (
          /* STEP 1: PASSWORD GATE (NO HINTS SHOWN) */
          <div className="p-10 text-center flex-1 flex flex-col items-center justify-center">
            <img
              src={displayDP}
              alt="DP"
              onError={() => setImgError(true)}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#e67e22] mx-auto mb-3.5 bg-slate-100 shadow-md"
            />
            <h2 className="text-2xl font-bold text-[#1a252f] mb-1">{worker.name}</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">{worker.role}</p>

            <form onSubmit={handleCheckPass} className="w-full max-w-xs space-y-3.5">
              <input
                type="password"
                value={enteredPass}
                onChange={(e) => {
                  setEnteredPass(e.target.value);
                  if (passError) setPassError('');
                }}
                placeholder="Enter worker password"
                autoFocus
                required
                className="w-full p-3 border-2 border-slate-300 rounded-lg text-base outline-none focus:border-[#107c41] focus:ring-2 focus:ring-emerald-500/20 text-center font-mono"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#107c41] to-[#0d5f32] text-white py-3 px-5 rounded-lg font-bold text-base transition-all shadow-md hover:shadow-emerald-700/40 cursor-pointer"
              >
                Open Official Ledger
              </button>
              {passError && (
                <p className="text-red-600 text-sm font-semibold">{passError}</p>
              )}
            </form>
          </div>
        ) : (
          /* STEP 2: EXPANDED PROFESSIONAL LEDGER PAPER (NO EXTRA SUMMARY TABLE) */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Worker Top Profile Header */}
            {/* Compact Filter Bar (No duplicate 2nd image or name) */}
            <div className="bg-white px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800">{worker.name}</span>
                <span className="text-xs text-slate-500 font-medium">({worker.role})</span>
              </div>

              {/* Month & Year Filter on Paper */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-500 ml-1.5" />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-xs font-bold text-slate-800 bg-transparent py-1 px-2 outline-none cursor-pointer"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {MONTHS_HINDI[m]}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent py-1 px-2 outline-none border-l border-slate-300 cursor-pointer"
                  >
                    {['2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors border border-red-600"
                  title="Download Official PDF Ledger"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Download PDF (पीडीएफ)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Paper</span>
                </button>
              </div>
            </div>

            {/* EXPANDED EXCEL LEDGER TABLE: ONLY ADMIN-ADDED ROWS */}
            <div className="flex-1 overflow-auto p-3 sm:p-6 bg-slate-100">
              <div className="bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden min-h-full flex flex-col">
                <div className="bg-[#107c41] text-white px-5 py-3 flex items-center justify-between text-sm sm:text-base font-bold shrink-0">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>
                      तारीख-वार विवरण (Daily Ledger Register) - {MONTHS_HINDI[selectedMonth]} {selectedYear}
                    </span>
                  </div>
                  <span className="text-xs font-normal text-emerald-100">
                    {workerExcelRows.length} रिकॉर्ड दर्ज
                  </span>
                </div>

                {workerExcelRows.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 space-y-3 bg-slate-50/50 flex-1 flex flex-col justify-center">
                    <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <p className="text-base font-bold text-slate-700">
                        अभी तक मैनेजमेंट द्वारा इस महीने का कोई रिकॉर्ड दर्ज नहीं किया गया है
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        (All boxes are empty. No records have been added yet by admin for {selectedMonth} {selectedYear}.)
                      </p>
                    </div>
                    {/* Blank paper preview rows */}
                    <div className="w-full max-w-4xl mx-auto border border-dashed border-slate-300 rounded overflow-hidden mt-4">
                      <table className="w-full text-xs text-slate-400">
                        <tbody>
                          {[1, 2, 3, 4].map((i) => (
                            <tr key={i} className="border-b border-dashed border-slate-200 h-8">
                              <td className="w-12 text-center bg-slate-50 border-r border-slate-200">{i}</td>
                              <td className="px-4 italic">- खाली (Empty) -</td>
                              <td className="w-28 text-center border-l border-slate-200 italic">-</td>
                              <td className="w-36 text-right border-l border-slate-200 italic px-3">-</td>
                              <td className="w-36 text-right border-l border-slate-200 italic px-3">-</td>
                              <td className="w-36 text-right border-l border-slate-200 italic px-3">-</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                          <th className="py-3 px-3 text-center w-12 border-r border-slate-200">#</th>
                          <th className="py-3 px-4 border-r border-slate-200 text-slate-900 font-bold">
                            Date (तारीख)
                          </th>
                          <th className="py-3 px-4 border-r border-slate-200 text-center text-slate-900 font-bold">
                            Attendance (उपस्थिति)
                          </th>
                          <th className="py-3 px-4 border-r border-slate-200 text-right text-slate-900 font-bold">
                            1 Day Expensive (1 दिन का खर्च)
                          </th>
                          <th className="py-3 px-4 border-r border-slate-200 text-right text-slate-900 font-bold">
                            Month Expensive (मासिक खर्च)
                          </th>
                          <th className="py-3 px-4 text-right text-emerald-950 font-black">
                            Total Rupees (कुल रुपये)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-sans">
                        {workerExcelRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/50 transition-colors">
                            <td className="py-3 px-3 text-center border-r border-slate-200 font-mono text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 border-r border-slate-200 font-bold text-slate-900">
                              {row.dateStr}
                            </td>
                            <td className="py-3 px-4 border-r border-slate-200 text-center font-bold">
                              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold inline-block">
                                {row.attendance}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-r border-slate-200 text-right font-medium text-amber-800">
                              {row.oneDayExpense}
                            </td>
                            <td className="py-3 px-4 border-r border-slate-200 text-right font-medium text-orange-800">
                              {row.monthExpense}
                            </td>
                            <td className="py-3 px-4 text-right font-black text-emerald-900 text-base">
                              {row.totalRupees}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Close Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs shrink-0 px-6">
              <span className="text-slate-500">
                Building Construction Verified Worker Ledger • Records synced with Management
              </span>
              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-5 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
