import React, { useState, useEffect, useRef } from 'react';
import { SlideItem } from '../types';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Film, Image as ImageIcon } from 'lucide-react';

interface MediaSliderProps {
  slides: SlideItem[];
}

export const MediaSlider: React.FC<MediaSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalSlides = slides.length;

  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) return;

    const currentSlide = slides[currentIndex];
    // If current slide is a video, give it longer duration (12s) or advance after video
    const intervalTime = currentSlide?.mediaType === 'video' ? 12000 : 5500;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isPlaying, totalSlides, slides]);

  if (totalSlides === 0) return null;

  const currentSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="relative w-full max-w-[1100px] mx-auto px-5 pt-4 pb-2">
      <div className="relative h-[280px] sm:h-[380px] md:h-[440px] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/60 bg-black group">
        {/* Slide Media */}
        {currentSlide.mediaType === 'video' ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              key={currentSlide.mediaUrl}
              src={currentSlide.mediaUrl}
              poster={currentSlide.posterUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Audio Toggle for Video */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
              title={isMuted ? 'Unmute Video' : 'Mute Video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={currentSlide.mediaUrl}
              alt={currentSlide.title}
              className="w-full h-full object-cover transform duration-700 hover:scale-105"
            />
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />

        {/* Slide Tag / Media Indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#e67e22] text-white shadow-md">
            {currentSlide.mediaType === 'video' ? (
              <>
                <Film className="w-3 h-3" />
                <span>Video Showcase</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3 h-3" />
                <span>Project Poster</span>
              </>
            )}
          </span>
          {currentSlide.tag && (
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-md text-white">
              {currentSlide.tag}
            </span>
          )}
        </div>

        {/* Slide Captions */}
        <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black drop-shadow-lg leading-tight mb-1 text-white">
            {currentSlide.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 drop-shadow-md max-w-2xl line-clamp-2 opacity-90">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Left / Right Nav Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#e67e22] text-white p-2 sm:p-2.5 rounded-full backdrop-blur-sm opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#e67e22] text-white p-2 sm:p-2.5 rounded-full backdrop-blur-sm opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Controls Bar & Indicators */}
        <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded bg-black/40 hover:bg-black/80 text-white/80 hover:text-white transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Auto-slide' : 'Play Auto-slide'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1.5 ml-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-[#e67e22]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
