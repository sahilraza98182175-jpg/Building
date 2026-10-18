import React, { useState } from 'react';
import { X, Globe, Copy, Check, ExternalLink, Smartphone, Share2 } from 'lucide-react';

interface ShareWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWebsiteModal: React.FC<ShareWebsiteModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The live public preview URL for the application
  const livePublicUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? window.location.origin
      : 'https://ais-pre-ko4j26az6uxeffy2tkzggf-345357399823.asia-southeast1.run.app';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(livePublicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = livePublicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a252f] to-[#2c3e50] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-[#e67e22]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live Website Full URL</h2>
              <p className="text-xs text-slate-300">पब्लिश और शेयर करने के लिए वेबसाइट का लिंक</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Official Public Website URL (24/7 Live)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-800 break-all select-all focus-within:border-[#e67e22]">
                {livePublicUrl}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#e67e22] hover:bg-[#d35400] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                title="Copy Link to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <a
              href={livePublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#107c41] hover:bg-[#0d5f32] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow cursor-pointer text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Website in New Tab</span>
            </a>

            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#e67e22]" />
              <span>Share Link</span>
            </button>
          </div>

          {/* Guidance Info Card */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
              <Smartphone className="w-4 h-4 text-[#e67e22]" />
              <span>Workers aur Visitors ke saath kaise share karein:</span>
            </div>
            <ul className="text-xs text-orange-900/90 space-y-1.5 list-disc list-inside">
              <li>
                Is <strong>Full URL</strong> ko aap WhatsApp, SMS ya Email ke jariye apne workers aur clients ko bhej sakte hain.
              </li>
              <li>
                Koi bhi person is link ko apne <strong>Mobile Phone, Laptop ya Tablet</strong> par bina kisi app install kiye direct open kar sakta hai.
              </li>
              <li>
                Worker apna card click karke password daal kar apna <strong>10-Year Excel Sheet Ledger & PDF</strong> dekh aur download kar sakta hai.
              </li>
              <li>
                Aap <strong>Admin</strong> button se kabhi bhi login karke workers aur slides update kar sakte hain jo Cloud Firebase me realtime save hota hai.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close (बंद करें)
          </button>
        </div>
      </div>
    </div>
  );
};
