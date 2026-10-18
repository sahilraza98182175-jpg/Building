import React, { useState } from 'react';
import { Worker } from '../types';

interface WorkerCardProps {
  worker: Worker;
  onSelect: (worker: Worker) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const defaultDP = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80';

  return (
    <div
      onClick={() => onSelect(worker)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(worker);
        }
      }}
      className="group bg-white/95 rounded-xl py-5 px-3 text-center shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#e67e22] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col items-center justify-center"
    >
      <img
        src={imgError || !worker.dp ? defaultDP : worker.dp}
        alt={worker.name}
        onError={() => setImgError(true)}
        className="w-[88px] h-[88px] rounded-full object-cover border-3 border-[#e67e22] bg-[#ddd] mb-3 group-hover:scale-108 transition-transform duration-300 shadow-sm"
      />
      <h3 className="font-bold text-slate-900 text-[0.98rem] mb-1 leading-snug">
        {worker.name}
      </h3>
      <p className="text-[0.82rem] text-slate-500 font-normal">
        {worker.role}
      </p>
    </div>
  );
};
