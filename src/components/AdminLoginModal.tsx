import React, { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'admin123') {
      onSuccess();
      setError('');
    } else {
      setError('Wrong username or password');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white/98 p-10 rounded-xl w-full max-w-[380px] text-center shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#1a252f] mb-1">Admin Panel</h2>
        <p className="text-[#888] text-sm mb-6">Building Construction</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full p-3 border border-[#ddd] rounded-md text-base outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border border-[#ddd] rounded-md text-base outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
          />

          {error && (
            <p className="text-red-600 text-xs font-semibold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#e67e22] to-[#d35400] text-white py-3 px-5 rounded-md font-semibold text-base transition-all shadow-md hover:shadow-orange-500/40 cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="text-[#e67e22] font-semibold border-1.5 border-[#e67e22] py-1.5 px-4 rounded text-sm hover:bg-[#e67e22] hover:text-white transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
