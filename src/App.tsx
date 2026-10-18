import React, { useState, useEffect } from 'react';
import { Worker, WorkerActivity, SlideItem } from './types';
import { INITIAL_WORKERS, INITIAL_ACTIVITIES, INITIAL_SLIDES } from './data/initialData';
import { BackgroundSkyline } from './components/BackgroundSkyline';
import { Navbar } from './components/Navbar';
import { WorkerCard } from './components/WorkerCard';
import { WorkerModal } from './components/WorkerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ExcelSheetModal } from './components/ExcelSheetModal';
import { MediaSlider } from './components/MediaSlider';
import { Footer } from './components/Footer';

import {
  subscribeWorkers,
  saveWorkerToFirestore,
  deleteWorkerFromFirestore,
  subscribeActivities,
  saveActivityToFirestore,
  deleteActivityFromFirestore,
  subscribeSlides,
  saveSlideToFirestore,
  deleteSlideFromFirestore
} from './firebase';

export default function App() {
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const stored = localStorage.getItem('bc_workers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activities, setActivities] = useState<WorkerActivity[]>(() => {
    try {
      const stored = localStorage.getItem('bc_activities');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ACTIVITIES;
  });

  const [slides, setSlides] = useState<SlideItem[]>(() => {
    try {
      const stored = localStorage.getItem('bc_slides');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SLIDES;
  });

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bc_logged') === 'true';
    } catch {
      return false;
    }
  });

  const [activeView, setActiveView] = useState<'public' | 'admin'>(() => {
    try {
      return sessionStorage.getItem('bc_logged') === 'true' ? 'admin' : 'public';
    } catch {
      return 'public';
    }
  });

  // Modals
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [excelWorker, setExcelWorker] = useState<Worker | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // --- Real-time Firestore Subscriptions ---
  useEffect(() => {
    const unsubWorkers = subscribeWorkers(
      (remoteWorkers) => {
        // If remote has items, update workers
        if (remoteWorkers.length > 0) {
          setWorkers(remoteWorkers);
          localStorage.setItem('bc_workers', JSON.stringify(remoteWorkers));
        }
      },
      (err) => console.warn('Workers sync error', err)
    );

    const unsubActivities = subscribeActivities(
      (remoteActivities) => {
        if (remoteActivities.length > 0) {
          setActivities(remoteActivities);
          localStorage.setItem('bc_activities', JSON.stringify(remoteActivities));
        }
      },
      (err) => console.warn('Activities sync error', err)
    );

    const unsubSlides = subscribeSlides(
      (remoteSlides) => {
        if (remoteSlides.length > 0) {
          setSlides(remoteSlides);
          localStorage.setItem('bc_slides', JSON.stringify(remoteSlides));
        }
      },
      (err) => console.warn('Slides sync error', err)
    );

    return () => {
      unsubWorkers();
      unsubActivities();
      unsubSlides();
    };
  }, []);

  // Sync to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('bc_workers', JSON.stringify(workers));
    } catch (e) {
      console.warn('Error saving workers', e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem('bc_activities', JSON.stringify(activities));
    } catch (e) {
      console.warn('Error saving activities', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('bc_slides', JSON.stringify(slides));
    } catch (e) {
      console.warn('Error saving slides', e);
    }
  }, [slides]);

  // Handlers with Firestore Persistence
  const handleAddWorker = async (newWorkerData: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...newWorkerData,
      id: Date.now(),
      excelRows: newWorkerData.excelRows || {},
    };
    setWorkers((prev) => [newWorker, ...prev]);
    try {
      await saveWorkerToFirestore(newWorker);
    } catch (err) {
      console.warn('Failed to save worker to Firestore', err);
    }
  };

  const handleUpdateWorker = async (updatedWorker: Worker) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w))
    );
    if (excelWorker && excelWorker.id === updatedWorker.id) {
      setExcelWorker(updatedWorker);
    }
    try {
      await saveWorkerToFirestore(updatedWorker);
    } catch (err) {
      console.warn('Failed to update worker in Firestore', err);
    }
  };

  const handleDeleteWorker = async (id: number) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    setActivities((prev) => prev.filter((a) => a.workerId !== id));
    try {
      await deleteWorkerFromFirestore(id);
    } catch (err) {
      console.warn('Failed to delete worker from Firestore', err);
    }
  };

  const handleAddActivity = async (newActData: Omit<WorkerActivity, 'id'>) => {
    const newAct: WorkerActivity = {
      ...newActData,
      id: Date.now(),
    };
    setActivities((prev) => [newAct, ...prev]);
    try {
      await saveActivityToFirestore(newAct);
    } catch (err) {
      console.warn('Failed to save activity to Firestore', err);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteActivityFromFirestore(id);
    } catch (err) {
      console.warn('Failed to delete activity from Firestore', err);
    }
  };

  const handleAddSlide = async (newSlideData: Omit<SlideItem, 'id'>) => {
    const newSlide: SlideItem = {
      ...newSlideData,
      id: Date.now(),
    };
    setSlides((prev) => [newSlide, ...prev]);
    try {
      await saveSlideToFirestore(newSlide);
    } catch (err) {
      console.warn('Failed to save slide to Firestore', err);
    }
  };

  const handleDeleteSlide = async (id: number) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteSlideFromFirestore(id);
    } catch (err) {
      console.warn('Failed to delete slide from Firestore', err);
    }
  };

  const handleResetData = async () => {
    if (confirm('Reset to sample initial workers, activities and slides?')) {
      setWorkers(INITIAL_WORKERS);
      setActivities(INITIAL_ACTIVITIES);
      setSlides(INITIAL_SLIDES);
      localStorage.setItem('bc_workers', JSON.stringify(INITIAL_WORKERS));
      localStorage.setItem('bc_activities', JSON.stringify(INITIAL_ACTIVITIES));
      localStorage.setItem('bc_slides', JSON.stringify(INITIAL_SLIDES));

      // Sync sample data to Firestore
      for (const w of INITIAL_WORKERS) {
        saveWorkerToFirestore(w).catch(() => {});
      }
      for (const a of INITIAL_ACTIVITIES) {
        saveActivityToFirestore(a).catch(() => {});
      }
      for (const s of INITIAL_SLIDES) {
        saveSlideToFirestore(s).catch(() => {});
      }
    }
  };

  const handleAdminLoginSuccess = () => {
    try {
      sessionStorage.setItem('bc_logged', 'true');
    } catch {
      // ignore
    }
    setIsAdminLoggedIn(true);
    setIsLoginModalOpen(false);
    setActiveView('admin');
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('bc_logged');
    } catch {
      // ignore
    }
    setIsAdminLoggedIn(false);
    setActiveView('public');
  };

  // Month-filtered activities
  const currentMonthKey = new Date().toISOString().slice(0, 7); // e.g. "2026-10"
  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthlyActivities = activities.filter(
    (a) => a.date && a.date.startsWith(currentMonthKey)
  );
  const displayedActivities = monthlyActivities.length > 0 ? monthlyActivities : activities;

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* Animated Construction Background */}
      <BackgroundSkyline />

      {/* Header */}
      <Navbar
        isAdminLoggedIn={isAdminLoggedIn}
        activeView={activeView}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onGoToAdmin={() => setActiveView('admin')}
        onGoToPublic={() => setActiveView('public')}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {activeView === 'admin' ? (
          <AdminDashboard
            workers={workers}
            activities={activities}
            slides={slides}
            onAddWorker={handleAddWorker}
            onDeleteWorker={handleDeleteWorker}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onResetData={handleResetData}
            onOpenExcel={(w) => setExcelWorker(w)}
          />
        ) : (
          /* PUBLIC PAGE */
          <div className="flex-1 flex flex-col">
            {/* HERO SHOWCASE SLIDER (POSTERS & VIDEOS ADDED FROM ADMIN) */}
            {slides.length > 0 && <MediaSlider slides={slides} />}

            {/* Hero Title */}
            <section className="text-center text-white pt-8 pb-8 px-5">
              <div className="max-w-[1100px] mx-auto">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-wide mb-2 text-shadow">
                  Building Construction
                </h2>
                <p className="text-base sm:text-lg opacity-90 font-normal">
                  Quality construction you can trust.
                </p>
              </div>
            </section>

            {/* Workers Section */}
            <section className="max-w-[1100px] mx-auto px-5 pb-12 w-full">
              <h2 className="text-center text-2xl font-bold text-white mb-6 text-shadow">
                Our Workers
              </h2>

              {workers.length === 0 ? (
                <p className="text-center text-white/70 py-10">No workers added yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[18px]">
                  {workers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      onSelect={(w) => setSelectedWorker(w)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Activities of the Month Section */}
            <section className="max-w-[1100px] mx-auto px-5 pb-16 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h2 className="text-2xl font-bold text-white text-shadow">
                  Activities of the Month
                </h2>
                <span className="text-xs font-semibold px-3 py-1 bg-orange-500/20 text-[#e67e22] border border-orange-500/30 rounded-full w-fit">
                  {currentMonthName}
                </span>
              </div>

              {displayedActivities.length === 0 ? (
                <div className="bg-white/95 rounded-xl p-8 text-center text-slate-500 shadow-lg">
                  No activities recorded for this month yet.
                </div>
              ) : (
                <div className="bg-white/98 rounded-xl shadow-xl overflow-hidden border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1a252f] text-white">
                          <th className="py-2.5 px-4 font-semibold w-1/4">Worker</th>
                          <th className="py-2.5 px-4 font-semibold w-1/2">Activity Completed</th>
                          <th className="py-2.5 px-4 font-semibold text-right w-1/4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {displayedActivities.map((act) => (
                          <tr key={act.id} className="hover:bg-[#fff8f0] transition-colors">
                            <td className="py-2.5 px-4 font-bold text-slate-900">{act.workerName}</td>
                            <td className="py-2.5 px-4 text-slate-700">{act.description}</td>
                            <td className="py-2.5 px-4 font-mono text-slate-500 text-right">{act.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Worker Password Protected Profile Modal (Public) */}
      <WorkerModal
        worker={selectedWorker ? workers.find((w) => w.id === selectedWorker.id) || selectedWorker : null}
        activities={activities}
        onClose={() => setSelectedWorker(null)}
      />

      {/* Admin 10-Year Excel Sheet Modal */}
      <ExcelSheetModal
        worker={excelWorker ? workers.find((w) => w.id === excelWorker.id) || excelWorker : null}
        onClose={() => setExcelWorker(null)}
        onUpdateWorker={handleUpdateWorker}
        onAddOrUpdateActivity={handleAddActivity}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
