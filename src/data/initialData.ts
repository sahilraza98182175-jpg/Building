import { Worker, WorkerActivity, SlideItem, ExcelRowItem } from '../types';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTHS_HINDI: Record<string, string> = {
  'January': 'जनवरी (January)',
  'February': 'फरवरी (February)',
  'March': 'मार्च (March)',
  'April': 'अप्रैल (April)',
  'May': 'मई (May)',
  'June': 'जून (June)',
  'July': 'जुलाई (July)',
  'August': 'अगस्त (August)',
  'September': 'सितंबर (September)',
  'October': 'अक्टूबर (October)',
  'November': 'नवंबर (November)',
  'December': 'दिसंबर (December)',
};

export const YEARS = [
  '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'
];

export const DAYS_IN_MONTH: Record<string, number> = {
  'January': 31,
  'February': 28,
  'March': 31,
  'April': 30,
  'May': 31,
  'June': 30,
  'July': 31,
  'August': 31,
  'September': 30,
  'October': 31,
  'November': 30,
  'December': 31,
};

export function generateWorkerExcelRows(
  _year: string,
  _monthName: string,
  _baseTotal?: number
): ExcelRowItem[] {
  // Starts completely empty: "pahke se sab box exel ka khali hona hai jo me admin se add karta hoo wah sirf show hona hai"
  return [];
}

export function createInitialExcelLedger(): Record<string, Record<string, ExcelRowItem[]>> {
  // All Excel boxes start empty by default
  return {};
}

export const INITIAL_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'Skyline Metropolis Project',
    subtitle: '54-Storey Commercial & Luxury Residential Tower In Development',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    tag: 'FEATURED POSTER',
  },
  {
    id: 2,
    title: 'Precision Heavy Machinery in Action',
    subtitle: 'High-Elevation Tower Crane Lifting & Structural Precast Assembling',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    tag: 'LIVE SITE VIDEO',
  },
  {
    id: 3,
    title: 'Seismic Structural Reinforcement',
    subtitle: 'Grade M50 Concrete Core Pillars with High-Tensile Steel Matrix',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
    tag: 'SITE ARCHITECTURE',
  },
  {
    id: 4,
    title: 'Master Craftsmen & Certified Workforce',
    subtitle: 'Over 10+ Years of Verified Safety, Zero-Defect Handover & Execution',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80',
    tag: 'WORKFORCE SPOTLIGHT',
  },
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 101,
    name: 'Rajesh Kumar',
    role: 'Senior Mason & Bricklayer',
    password: '1234',
    dp: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    attendance: '5,6',
    leave: 2,
    expWeek: '100 rupees',
    expense: 'Rs. 4,500',
    total: 'Rs. 32,500',
    phone: '+91 98765 43210',
    badgeNumber: 'BC-101',
    siteLocation: 'Tower A - 4th Floor',
    joiningDate: '12 Jan 2017',
    excelRows: createInitialExcelLedger(),
  },
  {
    id: 102,
    name: 'Vikram Singh',
    role: 'Heavy Crane Operator',
    password: '2345',
    dp: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80',
    attendance: '6',
    leave: 0,
    expWeek: '120 rupees',
    expense: 'Rs. 5,800',
    total: 'Rs. 48,000',
    phone: '+91 98123 45678',
    badgeNumber: 'BC-102',
    siteLocation: 'Main Tower Crane 01',
    joiningDate: '05 Mar 2017',
    excelRows: createInitialExcelLedger(),
  },
  {
    id: 103,
    name: 'Amit Sharma',
    role: 'Lead Site Electrician',
    password: '3456',
    dp: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
    attendance: '5,6',
    leave: 3,
    expWeek: '100 rupees',
    expense: 'Rs. 3,800',
    total: 'Rs. 36,000',
    phone: '+91 97234 56789',
    badgeNumber: 'BC-103',
    siteLocation: 'Substation & Grid B',
    joiningDate: '20 Jul 2018',
    excelRows: createInitialExcelLedger(),
  },
  {
    id: 104,
    name: 'Mohammad Farooq',
    role: 'Structural Welder & Fabricator',
    password: '4567',
    dp: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    attendance: '5,4',
    leave: 1,
    expWeek: '150 rupees',
    expense: 'Rs. 5,200',
    total: 'Rs. 41,500',
    phone: '+91 96345 67890',
    badgeNumber: 'BC-104',
    siteLocation: 'Steel Girders Sector C',
    joiningDate: '15 Nov 2017',
    excelRows: createInitialExcelLedger(),
  },
  {
    id: 105,
    name: 'Suresh Patel',
    role: 'Concrete Quality Supervisor',
    password: '5678',
    dp: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=400&q=80',
    attendance: '6',
    leave: 0,
    expWeek: '100 rupees',
    expense: 'Rs. 4,900',
    total: 'Rs. 44,000',
    phone: '+91 95456 78901',
    badgeNumber: 'BC-105',
    siteLocation: 'Batching Plant & Core Pillars',
    joiningDate: '10 Feb 2017',
    excelRows: createInitialExcelLedger(),
  },
  {
    id: 106,
    name: 'Karan Mehra',
    role: 'Scaffolding & Rigging Specialist',
    password: '6789',
    dp: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80',
    attendance: '5,6',
    leave: 5,
    expWeek: '100 rupees',
    expense: 'Rs. 3,100',
    total: 'Rs. 29,000',
    phone: '+91 94567 89012',
    badgeNumber: 'BC-106',
    siteLocation: 'West Wing Facade',
    joiningDate: '01 Aug 2019',
    excelRows: createInitialExcelLedger(),
  },
];

export const INITIAL_ACTIVITIES: WorkerActivity[] = [
  {
    id: 1,
    workerId: 101,
    workerName: 'Rajesh Kumar',
    description: 'Completed external brick wall alignment on 4th floor residential sector.',
    date: '2026-10-13',
    category: 'Masonry',
  },
  {
    id: 2,
    workerId: 102,
    workerName: 'Vikram Singh',
    description: 'Safely hoisted 18 prefabricated precast slabs to roof level during morning shift.',
    date: '2026-10-13',
    category: 'Operation',
  },
  {
    id: 3,
    workerId: 103,
    workerName: 'Amit Sharma',
    description: 'Installed 3-phase primary distribution breaker and tested site emergency backup generator.',
    date: '2026-10-12',
    category: 'Electrical',
  },
  {
    id: 4,
    workerId: 104,
    workerName: 'Mohammad Farooq',
    description: 'Reinforced seismic steel brackets across junction 14-A and 14-B.',
    date: '2026-10-12',
    category: 'Welding',
  },
  {
    id: 5,
    workerId: 105,
    workerName: 'Suresh Patel',
    description: 'Slump test passed on batch #8841 (Grade M40 concrete foundation pour).',
    date: '2026-10-11',
    category: 'Inspection',
  },
  {
    id: 6,
    workerId: 106,
    workerName: 'Karan Mehra',
    description: 'Dismantled perimeter safety nets and inspected level 6 harness safety anchors.',
    date: '2026-10-10',
    category: 'General',
  },
];
