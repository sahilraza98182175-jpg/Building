import React, { useState } from 'react';
import { Worker, WorkerActivity, SlideItem } from '../types';
import {
  Trash2,
  Upload,
  RotateCcw,
  FileSpreadsheet,
  Film,
  Image as ImageIcon,
  Plus,
  Play,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  workers: Worker[];
  activities: WorkerActivity[];
  slides: SlideItem[];
  onAddWorker: (worker: Omit<Worker, 'id'>) => void;
  onDeleteWorker: (id: number) => void;
  onAddActivity: (activity: Omit<WorkerActivity, 'id'>) => void;
  onDeleteActivity: (id: number) => void;
  onAddSlide: (slide: Omit<SlideItem, 'id'>) => void;
  onDeleteSlide: (id: number) => void;
  onResetData: () => void;
  onOpenExcel: (worker: Worker) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  workers,
  activities,
  slides,
  onAddWorker,
  onDeleteWorker,
  onAddActivity,
  onDeleteActivity,
  onAddSlide,
  onDeleteSlide,
  onResetData,
  onOpenExcel,
}) => {
  // Add Worker Form State
  const [workerName, setWorkerName] = useState('');
  const [workerRole, setWorkerRole] = useState('');
  const [workerPass, setWorkerPass] = useState('');
  const [workerDP, setWorkerDP] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [workerAttendance, setWorkerAttendance] = useState('');
  const [workerLeave, setWorkerLeave] = useState('');
  const [workerExpWeek, setWorkerExpWeek] = useState('');
  const [workerExpense, setWorkerExpense] = useState('');
  const [workerTotal, setWorkerTotal] = useState('');

  // Add Activity Form State
  const [activityWorkerId, setActivityWorkerId] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityDate, setActivityDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Add Slide Form State
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideMediaType, setSlideMediaType] = useState<'image' | 'video'>('image');
  const [slideMediaUrl, setSlideMediaUrl] = useState('');
  const [slideTag, setSlideTag] = useState('');
  const [slideFileName, setSlideFileName] = useState('');
  const [slideFilePreview, setSlideFilePreview] = useState('');
  const [showUrlOption, setShowUrlOption] = useState(false);

  const defaultDP = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80';

  const handleSlideFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSlideFileName(file.name);
    const isVideo = file.type.startsWith('video');
    setSlideMediaType(isVideo ? 'video' : 'image');

    // Auto-fill title from file name if empty
    if (!slideTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setSlideTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setSlideMediaUrl(dataUrl);
        setSlideFilePreview(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setWorkerDP(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !workerRole.trim() || !workerPass.trim()) return;

    onAddWorker({
      name: workerName.trim(),
      role: workerRole.trim(),
      password: workerPass.trim(),
      dp: workerDP || defaultDP,
      attendance: '-',
      leave: '0',
      expWeek: '0',
      expense: '0',
      total: '0',
      excelRows: {},
    });

    // Reset Form
    setWorkerName('');
    setWorkerRole('');
    setWorkerPass('');
    setWorkerDP('');
    setFileName('');
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wId = Number(activityWorkerId);
    if (!wId || !activityDesc.trim() || !activityDate) return;

    const worker = workers.find((w) => w.id === wId);
    if (!worker) return;

    onAddActivity({
      workerId: wId,
      workerName: worker.name,
      description: activityDesc.trim(),
      date: activityDate,
    });

    setActivityDesc('');
  };

  const handleSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideMediaUrl.trim()) return;

    onAddSlide({
      title: slideTitle.trim(),
      subtitle: slideSubtitle.trim() || 'Building Construction Live Project',
      mediaType: slideMediaType,
      mediaUrl: slideMediaUrl.trim(),
      tag: slideTag.trim() || (slideMediaType === 'video' ? 'LIVE VIDEO' : 'PROJECT POSTER'),
    });

    setSlideTitle('');
    setSlideSubtitle('');
    setSlideMediaUrl('');
    setSlideTag('');
    setSlideFileName('');
    setSlideFilePreview('');
  };

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 w-full space-y-8">
      {/* Reset button banner */}
      <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-700">
        <span className="text-xs text-slate-300">
          Admin Portal: Click on any worker to open their <strong>10-Year Excel Sheet</strong> and edit worker activities.
        </span>
        <button
          onClick={onResetData}
          className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* SECTION 1: WORKERS WITH EXCEL SHEET TRIGGER */}
      <section className="bg-white/98 rounded-xl p-6 sm:p-7 shadow-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-5 border-b-[2.5px] border-[#e67e22] gap-2">
          <h2 className="text-xl font-bold text-[#1a252f]">
            Workers Management
          </h2>
          <span className="text-xs text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1 w-fit">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Click any worker to open Excel Sheet (10 Years)</span>
          </span>
        </div>

        {/* Add Worker Form */}
        <form onSubmit={handleWorkerSubmit} className="flex flex-wrap gap-2.5 items-center mb-6">
          <input
            type="text"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
            placeholder="Worker Name"
            required
            className="p-2.5 border border-slate-300 rounded-md text-sm min-w-[140px] focus:outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/15"
          />
          <input
            type="text"
            value={workerRole}
            onChange={(e) => setWorkerRole(e.target.value)}
            placeholder="Role"
            required
            className="p-2.5 border border-slate-300 rounded-md text-sm min-w-[140px] focus:outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/15"
          />
          <input
            type="password"
            value={workerPass}
            onChange={(e) => setWorkerPass(e.target.value)}
            placeholder="Password"
            required
            className="p-2.5 border border-slate-300 rounded-md text-sm min-w-[130px] font-mono focus:outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/15"
          />

          <label className="inline-flex items-center gap-1.5 p-2.5 bg-slate-100 hover:bg-orange-50 border-1.5 border-dashed border-[#e67e22] rounded-md cursor-pointer text-xs sm:text-sm text-slate-700 font-medium transition-colors">
            <Upload className="w-4 h-4 text-[#e67e22]" />
            <span>{fileName ? fileName.slice(0, 14) + '...' : 'Select DP from File'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#e67e22] to-[#d35400] hover:from-[#d35400] hover:to-[#b84300] text-white font-semibold py-2.5 px-6 rounded-md text-sm transition-all shadow-md hover:shadow-orange-500/30 cursor-pointer"
          >
            Add Worker
          </button>
        </form>

        {/* Workers Table */}
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#1a252f] text-white">
                <th className="py-2.5 px-3 font-semibold">DP</th>
                <th className="py-2.5 px-3 font-semibold">Name (Click for Excel)</th>
                <th className="py-2.5 px-3 font-semibold">Role</th>
                <th className="py-2.5 px-3 font-semibold">Password</th>
                <th className="py-2.5 px-3 font-semibold">Attendance</th>
                <th className="py-2.5 px-3 font-semibold">1 Day Exp</th>
                <th className="py-2.5 px-3 font-semibold">Month Exp</th>
                <th className="py-2.5 px-3 font-semibold">Total Rs</th>
                <th className="py-2.5 px-3 font-semibold text-center">Excel & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {workers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-slate-400">
                    No workers yet
                  </td>
                </tr>
              ) : (
                workers.map((w) => (
                  <tr key={w.id} className="hover:bg-[#fff8f0] transition-colors">
                    <td className="py-2.5 px-3">
                      <img
                        src={w.dp}
                        alt={w.name}
                        onClick={() => onOpenExcel(w)}
                        className="w-9 h-9 rounded-full object-cover border border-[#e67e22] cursor-pointer hover:scale-110 transition-transform"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onOpenExcel(w)}
                        className="font-bold text-slate-900 hover:text-[#107c41] flex items-center gap-1.5 cursor-pointer text-left"
                      >
                        <span>{w.name}</span>
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#107c41]" />
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{w.role}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 tracking-wider">••••••</td>
                    <td className="py-2.5 px-3 text-slate-800 font-semibold">{w.attendance || '-'}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-800">{w.expWeek || '0'}</td>
                    <td className="py-2.5 px-3 font-mono text-orange-800">{w.expense || '0'}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{w.total || '0'}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenExcel(w)}
                          className="bg-[#107c41] hover:bg-[#0c5c30] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                          title="Open 10-Year Excel Sheet for this worker"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>10 Yrs Sheet</span>
                        </button>
                        <button
                          onClick={() => onDeleteWorker(w.id)}
                          className="bg-gradient-to-r from-[#c0392b] to-[#a93226] text-white px-2.5 py-1 rounded text-xs font-semibold hover:shadow-md transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: WEBSITE SLIDES (POSTERS & VIDEOS) MANAGER */}
      <section className="bg-white/98 rounded-xl p-6 sm:p-7 shadow-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-[#1a252f] pb-2 mb-2 border-b-[2.5px] border-[#e67e22]">
          Website Slides (Posters & Videos)
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Add image posters or video clips that automatically appear as a showcase slide on the main website when visitors open it.
        </p>

        {/* Add Slide Form */}
        <form onSubmit={handleSlideSubmit} className="bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-200 mb-6 space-y-4">
          {/* FOLDER FILE UPLOAD BOX */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#e67e22]" />
                <span>Select Poster / Video from Device Folder (फ़ोल्डर से चुनें) *</span>
              </label>

              <button
                type="button"
                onClick={() => setShowUrlOption(!showUrlOption)}
                className="text-xs text-[#e67e22] hover:underline cursor-pointer"
              >
                {showUrlOption ? 'Hide URL input' : 'Or enter URL link instead'}
              </button>
            </div>

            {/* Drag & Browse Box */}
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#e67e22] hover:border-[#d35400] bg-orange-50/40 hover:bg-orange-50/70 rounded-xl cursor-pointer transition-all group">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#e67e22] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">
                Click here to browse folder & select Image or Video
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                Supports video (.mp4, .webm) and poster images (.jpg, .png, .webp) directly from your computer/device
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleSlideFileUpload}
                className="hidden"
              />
            </label>

            {/* LIVE PREVIEW OF SELECTED FOLDER FILE */}
            {slideMediaUrl && (
              <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-lg border border-emerald-300 shadow-sm animate-in fade-in">
                <div className="w-24 h-16 sm:w-32 sm:h-20 bg-black rounded overflow-hidden shrink-0 flex items-center justify-center">
                  {slideMediaType === 'video' ? (
                    <video
                      src={slideMediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={slideMediaUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e67e22] text-white">
                      {slideMediaType === 'video' ? 'VIDEO FILE' : 'POSTER IMAGE'}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      File Loaded from Folder
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-mono truncate max-w-sm">
                    {slideFileName || 'Selected Media Asset'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Optional URL input if toggled */}
          {showUrlOption && (
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Media URL (External Link)
              </label>
              <input
                type="url"
                value={slideMediaUrl}
                onChange={(e) => {
                  setSlideMediaUrl(e.target.value);
                  setSlideFilePreview(e.target.value);
                }}
                placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white font-mono focus:outline-none focus:border-[#e67e22]"
              />
            </div>
          )}

          {/* Titles & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Slide Title *
              </label>
              <input
                type="text"
                value={slideTitle}
                onChange={(e) => setSlideTitle(e.target.value)}
                placeholder="e.g. Tower Crane Operations"
                required
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#e67e22]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={slideSubtitle}
                onChange={(e) => setSlideSubtitle(e.target.value)}
                placeholder="e.g. High-elevation structural beam hoisting"
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#e67e22]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={slideTag}
                onChange={(e) => setSlideTag(e.target.value)}
                placeholder="e.g. LIVE SITE / PROJECT POSTER"
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#e67e22]"
              />
            </div>
          </div>

          {/* Quick presets & Submit Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Quick Samples:</span>
              <button
                type="button"
                onClick={() => {
                  setSlideTitle('Crane Hoisting & Grid Framework');
                  setSlideSubtitle('High-capacity machinery assembling prefabricated beams');
                  setSlideMediaType('video');
                  setSlideMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                  setSlideTag('LIVE DRONE VIDEO');
                  setSlideFileName('ForBiggerBlazes.mp4');
                }}
                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[11px] text-slate-700 cursor-pointer"
              >
                + Crane Video
              </button>
              <button
                type="button"
                onClick={() => {
                  setSlideTitle('Foundation Concrete Pave Project');
                  setSlideSubtitle('Continuous slump pouring and vibrating for seismic grid');
                  setSlideMediaType('image');
                  setSlideMediaUrl('https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1600&q=80');
                  setSlideTag('SITE POSTER');
                  setSlideFileName('concrete_foundation.jpg');
                }}
                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[11px] text-slate-700 cursor-pointer"
              >
                + Concrete Poster
              </button>
            </div>

            <button
              type="submit"
              disabled={!slideMediaUrl}
              className={`px-4 py-2 rounded text-xs font-bold transition-all shadow flex items-center gap-1.5 ${
                slideMediaUrl
                  ? 'bg-[#e67e22] hover:bg-[#d35400] text-white cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Slide to Website</span>
            </button>
          </div>
        </form>

        {/* Existing Slides List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative rounded-lg overflow-hidden border border-slate-200 shadow bg-slate-900 group"
            >
              <div className="h-32 w-full bg-black relative">
                {slide.mediaType === 'video' ? (
                  <video
                    src={slide.mediaUrl}
                    poster={slide.posterUrl}
                    className="w-full h-full object-cover opacity-80"
                    muted
                  />
                ) : (
                  <img
                    src={slide.mediaUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#e67e22] text-white flex items-center gap-1">
                  {slide.mediaType === 'video' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  <span>{slide.mediaType === 'video' ? 'VIDEO' : 'POSTER'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteSlide(slide.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
                  title="Remove Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 bg-white">
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{slide.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: WORKER ACTIVITIES */}
      <section className="bg-white/98 rounded-xl p-6 sm:p-7 shadow-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-[#1a252f] pb-2 mb-5 border-b-[2.5px] border-[#e67e22]">
          Worker Activities
        </h2>

        {/* Add Activity Form */}
        <form onSubmit={handleActivitySubmit} className="flex flex-wrap gap-2.5 items-center mb-6">
          <select
            value={activityWorkerId}
            onChange={(e) => setActivityWorkerId(e.target.value)}
            required
            className="p-2.5 border border-slate-300 rounded-md text-sm min-w-[180px] focus:outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/15"
          >
            <option value="">Select Worker</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.role})
              </option>
            ))}
          </select>

          <input
            type="text"
            value={activityDesc}
            onChange={(e) => setActivityDesc(e.target.value)}
            placeholder="Activity description"
            required
            className="p-2.5 border border-slate-300 rounded-md text-sm flex-1 min-w-[220px] focus:outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/15"
          />

          <input
            type="date"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
            required
            className="p-2.5 border border-slate-300 rounded-md text-sm min-w-[140px] focus:outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/15"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-[#e67e22] to-[#d35400] hover:from-[#d35400] hover:to-[#b84300] text-white font-semibold py-2.5 px-5 rounded-md text-sm transition-all shadow-md hover:shadow-orange-500/30 cursor-pointer"
          >
            Add Activity
          </button>
        </form>

        {/* Activities Table */}
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#1a252f] text-white">
                <th className="py-2.5 px-4 font-semibold w-1/4">Worker</th>
                <th className="py-2.5 px-4 font-semibold w-1/2">Activity</th>
                <th className="py-2.5 px-4 font-semibold w-1/6">Date</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No activities yet
                  </td>
                </tr>
              ) : (
                activities.slice().reverse().map((a) => (
                  <tr key={a.id} className="hover:bg-[#fff8f0] transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{a.workerName}</td>
                    <td className="py-2.5 px-4 text-slate-700">{a.description}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{a.date}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteActivity(a.id)}
                        className="bg-gradient-to-r from-[#c0392b] to-[#a93226] text-white px-3 py-1 rounded text-xs font-semibold hover:shadow-md transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
