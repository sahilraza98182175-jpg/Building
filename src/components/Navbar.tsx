import React from 'react';

interface NavbarProps {
  isAdminLoggedIn: boolean;
  activeView: 'public' | 'admin';
  onOpenLogin: () => void;
  onGoToAdmin: () => void;
  onGoToPublic: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdminLoggedIn,
  activeView,
  onOpenLogin,
  onGoToAdmin,
  onGoToPublic,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f1c2e]/92 backdrop-blur-md border-b-2 border-[#e67e22] text-white py-4 shadow-lg">
      <div className="max-w-[1100px] mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onGoToPublic}
          className="text-left font-bold text-2xl tracking-wide cursor-pointer focus:outline-none"
        >
          <span className="text-[#e67e22]">Building</span> Construction
        </button>

        {/* Admin Navigation Button */}
        <div>
          {activeView === 'admin' ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onGoToPublic}
                className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back to Home
              </button>
              <button
                onClick={onLogout}
                className="text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : isAdminLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onGoToAdmin}
                className="text-[#e67e22] text-sm font-semibold border-1.5 border-[#e67e22] px-4 py-1.5 rounded hover:bg-[#e67e22] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(230,126,34,0.5)]"
              >
                Admin Panel
              </button>
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-red-400 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="text-[#e67e22] text-sm font-semibold border-1.5 border-[#e67e22] px-4 py-1.5 rounded hover:bg-[#e67e22] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(230,126,34,0.5)]"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
