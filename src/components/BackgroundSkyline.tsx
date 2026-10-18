import React from 'react';

export const BackgroundSkyline: React.FC = () => {
  return (
    <div className="bg-wrap" aria-hidden="true">
      {/* 10 Silhouetted Buildings */}
      <div className="building b1" />
      <div className="building b2" />
      <div className="building b3" />
      <div className="building b4" />
      <div className="building b5" />
      <div className="building b6" />
      <div className="building b7" />
      <div className="building b8" />
      <div className="building b9" />
      <div className="building b10" />

      {/* Swaying Tower Crane with animated hook */}
      <div className="crane" />

      {/* Floating construction amber particles */}
      <div className="particle" style={{ left: '8%', animationDelay: '0s', animationDuration: '8s' }} />
      <div className="particle" style={{ left: '22%', animationDelay: '2.5s', animationDuration: '10s' }} />
      <div className="particle" style={{ left: '38%', animationDelay: '4.8s', animationDuration: '7.5s' }} />
      <div className="particle" style={{ left: '52%', animationDelay: '1.2s', animationDuration: '9s' }} />
      <div className="particle" style={{ left: '68%', animationDelay: '3.4s', animationDuration: '11s' }} />
      <div className="particle" style={{ left: '82%', animationDelay: '5.6s', animationDuration: '8.5s' }} />
      <div className="particle" style={{ left: '94%', animationDelay: '0.8s', animationDuration: '9.5s' }} />
    </div>
  );
};
