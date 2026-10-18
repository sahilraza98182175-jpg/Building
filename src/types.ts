export interface ExcelRowItem {
  id: string | number;
  dateStr: string; // e.g. "January 01 / 10"
  attendance: string; // e.g. "5,6"
  oneDayExpense: string | number; // e.g. "100 rupees"
  monthExpense: string | number; // e.g. "3000 rupees"
  totalRupees: string | number; // e.g. "25000 rupees"
}

export interface Worker {
  id: number;
  name: string;
  role: string;
  password: string;
  dp: string;
  attendance: string;
  leave: string | number;
  expWeek: string | number; // 1 Day Expense or weekly expense
  expense: string | number; // Month Expense
  total: string | number; // Total Rupees
  phone?: string;
  badgeNumber?: string;
  siteLocation?: string;
  joiningDate?: string;
  excelRows?: Record<string, Record<string, ExcelRowItem[]>>; // year -> month -> ExcelRowItem[]
}

export interface WorkerActivity {
  id: number;
  workerId: number;
  workerName: string;
  description: string;
  date: string;
  category?: 'Masonry' | 'Electrical' | 'Welding' | 'Operation' | 'Inspection' | 'General';
}

export interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  posterUrl?: string;
  tag?: string;
}
